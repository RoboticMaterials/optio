"""
demo_merge.py — two processes that feed cards into a shared Assembly station.

    Frame Shop:   Frame Cutting  →  Frame Welding  ──┐
                                                      ├──▶  Final Assembly
    Engine Shop:  Engine Parts   →  Engine Test    ──┘

Both processes route their finished sub-assemblies to a single shared
"Final Assembly" station, illustrating a merge/convergence pattern.

Usage:
    python demo_merge.py [--host localhost:5000] [--cards 4] [--speed 2.0] [--clean]
"""

import argparse
import json
import time
import uuid
import sys
import requests


# --------------------------------------------------------------------------- #
# Layout
# --------------------------------------------------------------------------- #

FRAME_STATIONS = [
    {"name": "Frame Cutting",  "x": 100, "y": 150},
    {"name": "Frame Welding",  "x": 350, "y": 150},
]
ENGINE_STATIONS = [
    {"name": "Engine Parts",   "x": 100, "y": 400},
    {"name": "Engine Test",    "x": 350, "y": 400},
]
SHARED_STATION = {"name": "Final Assembly", "x": 600, "y": 275}

FRAME_PROCESS_NAME  = "Frame Shop"
ENGINE_PROCESS_NAME = "Engine Shop"
FRAME_TEMPLATE      = "Frame Kit"
ENGINE_TEMPLATE     = "Engine Kit"


# --------------------------------------------------------------------------- #
# HTTP client (same pattern as demo_process.py)
# --------------------------------------------------------------------------- #

class OptioLocal:
    HEADERS = {"Content-Type": "application/json", "Authorization": "local-dev"}

    def __init__(self, base_url: str):
        self.base = base_url.rstrip("/") + "/api/"
        self.map_id = self._get_map_id()

    def _get_map_id(self):
        maps = self.get("site_maps")
        if not maps:
            sys.exit("No maps found — run seed_local_map.py first")
        return maps[0]["_id"]

    @staticmethod
    def _parse(r):
        data = r.json()
        if isinstance(data, str):
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

    def get_stations(self):   return self.get(f"site_maps/{self.map_id}/stations")
    def get_processes(self):  return self.get(f"site_maps/{self.map_id}/processes")
    def get_tasks(self):      return self.get(f"site_maps/{self.map_id}/tasks")
    def get_lot_templates(self): return self.get(f"site_maps/{self.map_id}/cards/templates")
    def get_lots(self):       return self.get(f"site_maps/{self.map_id}/cards")

    def upsert_station(self, existing, name, x, y):
        if name in existing:
            return existing[name]
        s = self.post("stations", {
            "_id": str(uuid.uuid4()),
            "name": name,
            "type": "human",
            "map_id": self.map_id,
            "x": x, "y": y, "rotation": 0,
            "cycle_times": {}, "dashboards": [], "schema": "lots",
        })
        print(f"  Created station '{name}' ({s['_id']})")
        return s

    def upsert_process(self, existing, name, station_ids, route_ids):
        if name in existing:
            p = existing[name]
            print(f"  Process '{name}' already exists — reusing")
            return p
        p = self.post("processes", {
            "_id": str(uuid.uuid4()),
            "name": name,
            "map_id": self.map_id,
            "routes": route_ids,
            "flattened_stations": [{"stationID": sid, "depth": 0} for sid in station_ids],
            "startDivergeType": None,
            "showQueue": True,
            "showFinish": True,
            "showStatistics": True,
        })
        print(f"  Created process '{name}' ({p['_id']})")
        return p

    def upsert_route(self, existing, name, load_id, unload_id, process_id):
        if name in existing:
            return existing[name]
        r = self.post("tasks", {
            "_id": str(uuid.uuid4()),
            "name": name,
            "map_id": self.map_id,
            "load": load_id,
            "unload": unload_id,
            "processId": process_id,
            "divergeType": None,
            "handoff": True,
            "type": "push",
            "part": None,
            "inOutRatio": 1,
            "timeout": "09:00",
        })
        print(f"  Created route '{name}' ({r['_id']})")
        return r

    def upsert_template(self, existing, name, process_id):
        if name in existing:
            return existing[name]
        t = self.post("cards/templates", {
            "_id": str(uuid.uuid4()),
            "name": name,
            "map_id": self.map_id,
            "processId": process_id,
            "fields": [],
        })
        print(f"  Created template '{name}' ({t['_id']})")
        return t

    def sync_process(self, process, station_ids, route_ids):
        """Ensure flattened_stations and routes are up to date."""
        flattened = [{"stationID": sid, "depth": 0} for sid in station_ids]
        if (set(route_ids) != set(process.get("routes", []))
                or len(process.get("flattened_stations", [])) != len(station_ids)):
            process = self.put(f"processes/{process['_id']}", {
                **process,
                "routes": route_ids,
                "flattened_stations": flattened,
                "startDivergeType": None,
                "showQueue": True, "showFinish": True, "showStatistics": True,
            })
            print(f"  Synced process '{process['name']}' routes + stations")
        return process

    def create_lot(self, name, process_id, template_id, station_id, quantity=1):
        return self.post("cards", {
            "_id": str(uuid.uuid4()),
            "name": name,
            "map_id": self.map_id,
            "process_id": process_id,
            "lotTemplateId": template_id,
            "bins": {station_id: {"count": quantity}},
            "fields": [], "flags": [],
            "totalQuantity": quantity,
            "syncWithTemplate": False,
        })

    def move_lot(self, lot, from_id, to_id, quantity=1):
        bins = dict(lot.get("bins", {}))
        bins.pop(from_id, None)
        if to_id != "__DONE__":
            bins[to_id] = {"count": quantity}
        updated = {**lot, "bins": bins}
        self.put(f"cards/{lot['_id']}", updated)
        actual = self.get(f"cards/{lot['_id']}")
        if to_id == "__DONE__":
            if from_id in actual.get("bins", {}):
                raise RuntimeError(f"Move failed: {lot['name']} still at {from_id}")
        else:
            if to_id not in actual.get("bins", {}):
                raise RuntimeError(f"Move failed: {lot['name']} not at {to_id}, bins={actual.get('bins')}")
        return actual


# --------------------------------------------------------------------------- #
# Setup
# --------------------------------------------------------------------------- #

def setup(api: OptioLocal):
    print("\n=== Setting up merge demo ===")

    existing_stations  = {s["name"]: s for s in api.get_stations()}
    existing_processes = {p["name"]: p for p in api.get_processes()}
    existing_tasks     = {t["name"]: t for t in api.get_tasks()}
    existing_templates = {t["name"]: t for t in api.get_lot_templates()}

    # 1. Shared station
    shared = api.upsert_station(existing_stations, **SHARED_STATION)

    # 2. Frame Shop stations + process + routes
    frame_s = [api.upsert_station(existing_stations, s["name"], s["x"], s["y"])
               for s in FRAME_STATIONS]
    frame_all_ids = [s["_id"] for s in frame_s] + [shared["_id"]]

    frame_proc = api.upsert_process(existing_processes, FRAME_PROCESS_NAME, frame_all_ids, [])

    frame_routes = []
    pairs = list(zip(frame_s, frame_s[1:])) + [(frame_s[-1], shared)]
    for load, unload in pairs:
        name = f"{load['name']} → {unload['name']}"
        r = api.upsert_route(existing_tasks, name, load["_id"], unload["_id"], frame_proc["_id"])
        frame_routes.append(r)

    frame_proc = api.sync_process(frame_proc, frame_all_ids, [r["_id"] for r in frame_routes])
    frame_tmpl = api.upsert_template(existing_templates, FRAME_TEMPLATE, frame_proc["_id"])

    # 3. Engine Shop stations + process + routes
    engine_s = [api.upsert_station(existing_stations, s["name"], s["x"], s["y"])
                for s in ENGINE_STATIONS]
    engine_all_ids = [s["_id"] for s in engine_s] + [shared["_id"]]

    engine_proc = api.upsert_process(existing_processes, ENGINE_PROCESS_NAME, engine_all_ids, [])

    engine_routes = []
    pairs = list(zip(engine_s, engine_s[1:])) + [(engine_s[-1], shared)]
    for load, unload in pairs:
        name = f"{load['name']} → {unload['name']}"
        r = api.upsert_route(existing_tasks, name, load["_id"], unload["_id"], engine_proc["_id"])
        engine_routes.append(r)

    engine_proc = api.sync_process(engine_proc, engine_all_ids, [r["_id"] for r in engine_routes])
    engine_tmpl = api.upsert_template(existing_templates, ENGINE_TEMPLATE, engine_proc["_id"])

    return {
        "shared": shared,
        "frame": {"proc": frame_proc, "stations": frame_s, "tmpl": frame_tmpl},
        "engine": {"proc": engine_proc, "stations": engine_s, "tmpl": engine_tmpl},
    }


# --------------------------------------------------------------------------- #
# Simulation
# --------------------------------------------------------------------------- #

def simulate(api: OptioLocal, ctx: dict, n_cards: int, speed: float):
    delay = 1.0 / speed
    shared = ctx["shared"]

    frame_proc    = ctx["frame"]["proc"]
    frame_stns    = ctx["frame"]["stations"]   # [Cutting, Welding]
    frame_tmpl    = ctx["frame"]["tmpl"]

    engine_proc   = ctx["engine"]["proc"]
    engine_stns   = ctx["engine"]["stations"]  # [Parts, Test]
    engine_tmpl   = ctx["engine"]["tmpl"]

    print(f"\n=== Creating {n_cards} lots in each shop ===")
    frame_lots  = []
    engine_lots = []
    for i in range(1, n_cards + 1):
        fl = api.create_lot(f"Frame-{i:03d}",  frame_proc["_id"],  frame_tmpl["_id"],  frame_stns[0]["_id"])
        el = api.create_lot(f"Engine-{i:03d}", engine_proc["_id"], engine_tmpl["_id"], engine_stns[0]["_id"])
        frame_lots.append(fl)
        engine_lots.append(el)
        print(f"  Frame-{i:03d}  @ {frame_stns[0]['name']}")
        print(f"  Engine-{i:03d} @ {engine_stns[0]['name']}")

    print(f"\n=== Running both shops in parallel (speed={speed}x) ===")
    for fl, el in zip(frame_lots, engine_lots):
        # ── Frame path ──────────────────────────────────────────────
        time.sleep(delay)
        fl = api.move_lot(fl, frame_stns[0]["_id"], frame_stns[1]["_id"])
        print(f"  {fl['name']}:  {frame_stns[0]['name']} → {frame_stns[1]['name']}")

        # ── Engine path (interleaved) ────────────────────────────────
        el = api.move_lot(el, engine_stns[0]["_id"], engine_stns[1]["_id"])
        print(f"  {el['name']}: {engine_stns[0]['name']} → {engine_stns[1]['name']}")

        # ── Both arrive at shared Final Assembly ─────────────────────
        time.sleep(delay)
        fl = api.move_lot(fl, frame_stns[1]["_id"], shared["_id"])
        print(f"  {fl['name']}:  {frame_stns[1]['name']} → {shared['name']}  ◀ MERGE")

        el = api.move_lot(el, engine_stns[1]["_id"], shared["_id"])
        print(f"  {el['name']}: {engine_stns[1]['name']} → {shared['name']}  ◀ MERGE")

        # ── Final assembly complete ───────────────────────────────────
        time.sleep(delay)
        fl = api.move_lot(fl, shared["_id"], "__DONE__")
        el = api.move_lot(el, shared["_id"], "__DONE__")
        print(f"  {fl['name']} + {el['name']}  →  DONE ✓")

    print(f"\n=== {n_cards} pairs merged and finished ===")


# --------------------------------------------------------------------------- #
# Cleanup
# --------------------------------------------------------------------------- #

def cleanup(api: OptioLocal, ctx: dict):
    print("\n=== Cleaning up ===")
    all_process_ids = {ctx["frame"]["proc"]["_id"], ctx["engine"]["proc"]["_id"]}
    for lot in api.get_lots():
        if lot.get("process_id") in all_process_ids:
            api.delete(f"cards/{lot['_id']}")
    print("  Deleted lots")

    for proc_key in ("frame", "engine"):
        proc = ctx[proc_key]["proc"]
        for route_id in proc.get("routes", []):
            try: api.delete(f"tasks/{route_id}")
            except Exception: pass
        api.delete(f"cards/templates/{ctx[proc_key]['tmpl']['_id']}")
        api.delete(f"processes/{proc['_id']}")
        print(f"  Deleted {proc['name']} routes, template, process")
        for s in ctx[proc_key]["stations"]:
            api.delete(f"stations/{s['_id']}")
            print(f"  Deleted station '{s['name']}'")

    api.delete(f"stations/{ctx['shared']['_id']}")
    print(f"  Deleted shared station '{ctx['shared']['name']}'")


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #

def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--host",  default="localhost:5000")
    parser.add_argument("--cards", type=int,   default=4)
    parser.add_argument("--speed", type=float, default=2.0)
    parser.add_argument("--clean", action="store_true")
    args = parser.parse_args()

    api = OptioLocal(f"http://{args.host}")
    print(f"Connected to map: {api.map_id}")

    ctx = setup(api)
    simulate(api, ctx, args.cards, args.speed)

    if args.clean:
        cleanup(api, ctx)


if __name__ == "__main__":
    main()
