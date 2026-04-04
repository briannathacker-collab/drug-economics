import json
import os
from datetime import datetime
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"


def log_update(
    drug_name: str,
    manufacturer: str,
    source: str,
    update_type: str,
    description: str,
    prev: int | None = None,
    new: int | None = None,
    pct: float | None = None,
    source_url: str | None = None,
    connector_run: dict | None = None,
):
    entry = {
        "date": datetime.today().strftime("%Y-%m-%d"),
        "timestamp": datetime.now().isoformat(),
        "source": source,
        "update_type": update_type,
        "drug_name": drug_name,
        "manufacturer": manufacturer,
        "description": description,
        "previous_value_cents": prev,
        "new_value_cents": new,
        "pct_change": pct,
        "source_url": source_url,
    }

    if connector_run is not None:
        entry["connector_run"] = connector_run

    path = DATA_DIR / "changelog.json"
    existing = json.loads(path.read_text()) if path.exists() else []
    existing.insert(0, entry)
    # Keep last 1000 entries
    existing = existing[:1000]
    path.write_text(json.dumps(existing, indent=2))
