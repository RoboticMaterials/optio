from __future__ import annotations

import base64
from io import BytesIO

from PIL import Image, ImageDraw
from pymongo import MongoClient

MAP_ID = "local-dev-map"
MAP_NAME = "Local Dev Factory"


def build_map_image() -> str:
    image = Image.new("RGB", (1600, 1000), "white")
    draw = ImageDraw.Draw(image)

    draw.rectangle((40, 40, 1560, 960), outline="#999999", width=4)
    draw.rectangle((80, 80, 520, 420), outline="#4f81bd", width=6)
    draw.text((100, 100), "Receiving / Staging", fill="#4f81bd")

    draw.rectangle((620, 80, 1040, 420), outline="#9bbb59", width=6)
    draw.text((650, 100), "Assembly", fill="#5f7f2f")

    draw.rectangle((1140, 80, 1520, 420), outline="#c0504d", width=6)
    draw.text((1170, 100), "Packaging", fill="#a63d3a")

    draw.rectangle((120, 560, 560, 880), outline="#8064a2", width=6)
    draw.text((160, 590), "Storage", fill="#604a7b")

    draw.rectangle((760, 560, 1480, 880), outline="#f79646", width=6)
    draw.text((800, 590), "Shipping / Outbound", fill="#b35d16")

    draw.line((520, 250, 620, 250), fill="#666666", width=8)
    draw.line((1040, 250, 1140, 250), fill="#666666", width=8)
    draw.line((860, 420, 860, 560), fill="#666666", width=8)

    buffer = BytesIO()
    image.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("ascii")


def main() -> None:
    client = MongoClient("localhost:27017")
    db = client.ContactDB

    map_doc = {
        "_id": MAP_ID,
        "name": MAP_NAME,
        "created_by_name": "local-dev",
        "map": build_map_image(),
        "origin_x": 0,
        "origin_y": 0,
        "resolution": 1,
    }

    db.site_maps.replace_one({"_id": MAP_ID}, map_doc, upsert=True)
    db.settings.update_one(
        {},
        {
            "$set": {
                "currentMapId": MAP_ID,
                "defaultMapId": MAP_ID,
                "lastUsedMap": MAP_ID,
                "authenticated": False,
            }
        },
        upsert=True,
    )

    print(f"Seeded map: {MAP_ID}")


if __name__ == "__main__":
    main()
