"""
demo_process.py — create a 3-station process and simulate cards moving through it.

Usage:
    python demo_process.py [--host localhost:5000] [--cards 5] [--speed 1.0] [--clean]

Steps
-----
1. Create three stations: Receiving → Assembly → Shipping
2. Create a process that links them with two routes
3. Create a lot template for "Widget"
4. Create --cards cards at Receiving (the first station)
5. Simulate each card moving through the pipeline with a configurable delay between moves

Pass --clean to delete the stations / process / template created by this script when done.
"""

import argparse
import json
import time
import uuid
import sys
import requests

BASE_STATIONS = [
    {"name": "Receiving",  "type": "human", "x": 100, "y": 200, "rotation": 0},
    {"name": "Assembly",   "type": "human", "x": 400, "y": 200, "rotation": 0},
    {"name": "Shipping",   "type": "human", "x": 700, "y": 200, "rotation": 0},
]

PROCESS_NAME = "Demo Widget Process"
TEMPLATE_NAME = "Widget"


# --------------------------------------------------------------------------- #
# Thin HTTP client — no Cognito, talks directly to local Flask server
# --------------------------------------------------------------------------- #

class OptioLocal:
    def __init__(self, base_url: str):
        self.base = base_url.rstrip("/") + "/api/"
        self.map_id = self._get_map_id()

    def _get_map_id(self):
        maps = self.get("site_maps")
        if not maps:
            sys.exit("No maps found — run seed_local_map.py first")
        return maps[0]["_id"]

    HEADERS = {"Content-Type": "application/json", "Authorization": "local-dev"}

    @staticmethod
    def _parse(r):
        # Flask returns bson.json_util.dumps which double-serializes — unwrap if needed
        data = r.json()
        if isinstance(data, str):
            import json
            data = json.loads(data)
        return data

    def get(self, path):
        r = requests.get(self.base + path, headers=self.HEADERS)
        r.raise_for_status()
        return self._parse(r)

    def post(self, path, body):
        r = requests.post(self.base + path, json=body, headers=self.HEADERS)
        r.raise_for_status()
        return self._parse(r)

    def put(self, path, body):
        r = requests.put(self.base + path, json=body, headers=self.HEADERS)
        r.raise_for_status()
        return self._parse(r)

    def delete(self, path):
        r = requests.delete(self.base + path, headers=self.HEADERS)
        r.raise_for_status()

    # ---- domain helpers --------------------------------------------------- #

    def get_stations(self):
        return self.get(f"site_maps/{self.map_id}/stations")

    def get_processes(self):
        return self.get(f"site_maps/{self.map_id}/processes")

    def get_tasks(self):
        return self.get(f"site_maps/{self.map_id}/tasks")

    def get_lot_templates(self):
        return self.get(f"site_maps/{self.map_id}/cards/templates")

    def get_lots(self):
        return self.get(f"site_maps/{self.map_id}/cards")

    def create_station(self, name, station_type, x, y, rotation):
        return self.post("stations", {
            "_id": str(uuid.uuid4()),
            "name": name,
            "type": station_type,
            "map_id": self.map_id,
            "x": x,
            "y": y,
            "rotation": rotation,
            "cycle_times": {},
            "dashboards": [],
            "schema": "lots",
        })

    def create_process(self, name, station_ids, route_ids):
        return self.post("processes", {
            "_id": str(uuid.uuid4()),
            "name": name,
            "map_id": self.map_id,
            "stations": station_ids,
            "routes": route_ids,
        })

    def update_process(self, process):
        return self.put(f"processes/{process['_id']}", process)

    def create_route(self, name, load_id, unload_id, process_id):
        return self.post("tasks", {
            "_id": str(uuid.uuid4()),
            "name": name,
            "map_id": self.map_id,
            "load": load_id,
            "unload": unload_id,
            "process_id": process_id,
            "type": "human",
        })

    def create_lot_template(self, name, process_id):
        return self.post("cards/templates", {
            "_id": str(uuid.uuid4()),
            "name": name,
            "map_id": self.map_id,
            "processId": process_id,
            "fields": [],
        })

    def create_lot(self, name, process_id, template_id, station_id, quantity=1):
        return self.post("cards", {
            "_id": str(uuid.uuid4()),
            "name": name,
            "map_id": self.map_id,
            "process_id": process_id,
            "lotTemplateId": template_id,
            "bins": {station_id: {"count": quantity}},
            "fields": [],
            "flags": [],
            "totalQuantity": quantity,
            "syncWithTemplate": False,
        })

    def move_lot(self, lot, from_station_id, to_station_id, quantity):
        """Move a lot from one station to another, verifying the server accepted it."""
        updated = dict(lot)
        bins = dict(lot.get("bins", {}))
        bins.pop(from_station_id, None)
        if to_station_id != "__DONE__":
            bins[to_station_id] = {"count": quantity}
        updated["bins"] = bins
        self.put(f"cards/{lot['_id']}", updated)

        # Verify the move actually landed
        actual = self.get(f"cards/{lot['_id']}")
        if to_station_id == "__DONE__":
            if from_station_id in actual.get("bins", {}):
                raise RuntimeError(f"Move failed: card {lot['_id']} still at {from_station_id}")
        else:
            if to_station_id not in actual.get("bins", {}):
                raise RuntimeError(f"Move failed: card {lot['_id']} not at {to_station_id}, bins={actual.get('bins')}")
        return actual


# --------------------------------------------------------------------------- #
# Setup
# --------------------------------------------------------------------------- #

def setup(api: OptioLocal):
    print("\n=== Setting up demo process ===")

    # 1. stations
    existing = {s["name"]: s for s in api.get_stations()}
    stations = {}
    for spec in BASE_STATIONS:
        if spec["name"] in existing:
            print(f"  Station '{spec['name']}' already exists — reusing")
            stations[spec["name"]] = existing[spec["name"]]
        else:
            s = api.create_station(spec["name"], spec["type"], spec["x"], spec["y"], spec["rotation"])
            stations[spec["name"]] = s
            print(f"  Created station '{spec['name']}' ({s['_id']})")

    # 2. process (need IDs up front for route creation, so create with empty routes first)
    existing_processes = {p["name"]: p for p in api.get_processes()}
    if PROCESS_NAME in existing_processes:
        print(f"  Process '{PROCESS_NAME}' already exists — reusing")
        process = existing_processes[PROCESS_NAME]
    else:
        station_ids = [stations[n]["_id"] for n in ["Receiving", "Assembly", "Shipping"]]
        process = api.create_process(PROCESS_NAME, station_ids, [])
        print(f"  Created process '{PROCESS_NAME}' ({process['_id']})")

    process_id = process["_id"]

    # 3. routes  Receiving→Assembly, Assembly→Shipping
    existing_tasks = {t["name"]: t for t in api.get_tasks()}
    routes = {}
    for load, unload in [("Receiving", "Assembly"), ("Assembly", "Shipping")]:
        name = f"{load} → {unload}"
        if name in existing_tasks:
            print(f"  Route '{name}' already exists — reusing")
            routes[name] = existing_tasks[name]
        else:
            r = api.create_route(name, stations[load]["_id"], stations[unload]["_id"], process_id)
            routes[name] = r
            print(f"  Created route '{name}' ({r['_id']})")

    # Ensure process.routes lists all route IDs (process was created before routes existed)
    route_ids = [r["_id"] for r in routes.values()]
    if set(route_ids) != set(process.get("routes", [])):
        process = api.update_process({**process, "routes": route_ids})
        print(f"  Updated process routes: {route_ids}")

    # 4. lot template
    existing_templates = {t["name"]: t for t in api.get_lot_templates()}
    if TEMPLATE_NAME in existing_templates:
        print(f"  Template '{TEMPLATE_NAME}' already exists — reusing")
        template = existing_templates[TEMPLATE_NAME]
    else:
        template = api.create_lot_template(TEMPLATE_NAME, process_id)
        print(f"  Created lot template '{TEMPLATE_NAME}' ({template['_id']})")

    return stations, process, routes, template


# --------------------------------------------------------------------------- #
# Simulation
# --------------------------------------------------------------------------- #

def simulate(api: OptioLocal, stations, process, routes, template, n_cards: int, speed: float):
    print(f"\n=== Creating {n_cards} cards at Receiving ===")
    receiving = stations["Receiving"]
    assembly  = stations["Assembly"]
    shipping  = stations["Shipping"]

    lots = []
    for i in range(1, n_cards + 1):
        lot = api.create_lot(
            f"Widget-{i:03d}",
            process["_id"],
            template["_id"],
            receiving["_id"],
            quantity=1,
        )
        lots.append(lot)
        print(f"  Created {lot['name']} at Receiving")

    delay = 1.0 / speed  # seconds between moves

    print(f"\n=== Running cards through pipeline (speed={speed}x, ~{delay:.1f}s between moves) ===")
    for lot in lots:
        current = lot

        # Receiving → Assembly
        time.sleep(delay)
        current = api.move_lot(current, receiving["_id"], assembly["_id"], 1)
        print(f"  {lot['name']}:  Receiving → Assembly")

        # Assembly → Shipping
        time.sleep(delay)
        current = api.move_lot(current, assembly["_id"], shipping["_id"], 1)
        print(f"  {lot['name']}:  Assembly  → Shipping")

        # Shipping → done (remove from shipping bin)
        time.sleep(delay)
        current = api.move_lot(current, shipping["_id"], "__DONE__", 1)
        print(f"  {lot['name']}:  Shipping  → DONE ✓")

    print(f"\n=== All {n_cards} cards processed ===")


# --------------------------------------------------------------------------- #
# Cleanup
# --------------------------------------------------------------------------- #

def cleanup(api: OptioLocal, stations, process, routes, template):
    print("\n=== Cleaning up demo data ===")

    # delete lots belonging to this process
    lots = api.get_lots()
    for lot in lots:
        if lot.get("process_id") == process["_id"]:
            api.delete(f"cards/{lot['_id']}")
    print(f"  Deleted lots for process '{PROCESS_NAME}'")

    for name, route in routes.items():
        api.delete(f"tasks/{route['_id']}")
        print(f"  Deleted route '{name}'")

    api.delete(f"cards/templates/{template['_id']}")
    print(f"  Deleted template '{TEMPLATE_NAME}'")

    api.delete(f"processes/{process['_id']}")
    print(f"  Deleted process '{PROCESS_NAME}'")

    for spec in BASE_STATIONS:
        s = stations[spec["name"]]
        api.delete(f"stations/{s['_id']}")
        print(f"  Deleted station '{spec['name']}'")


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #

def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--host",   default="localhost:5000", help="API host:port (default: localhost:5000)")
    parser.add_argument("--cards",  type=int, default=5,      help="Number of cards to create (default: 5)")
    parser.add_argument("--speed",  type=float, default=1.0,  help="Simulation speed multiplier (default: 1.0)")
    parser.add_argument("--clean",  action="store_true",       help="Delete created data after simulation")
    args = parser.parse_args()

    api = OptioLocal(f"http://{args.host}")
    print(f"Connected to map: {api.map_id}")

    stations, process, routes, template = setup(api)
    simulate(api, stations, process, routes, template, args.cards, args.speed)

    if args.clean:
        cleanup(api, stations, process, routes, template)


if __name__ == "__main__":
    main()
