#!/usr/bin/env python3
"""Regenerate the JavaScript data fallbacks used when HTML files are opened locally."""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
FILES = {
    "journals.json": ("journals-data.js", "CCC_JOURNALS"),
    "college-coverage.json": ("coverage-data.js", "CCC_COVERAGE"),
    "events.json": ("events-data.js", "CCC_EVENTS"),
    "site-config.json": ("site-config-data.js", "CCC_SITE_CONFIG"),
    "programs.json": ("programs-data.js", "CCC_PROGRAMS"),
}

for source, (target, variable) in FILES.items():
    data = json.loads((DATA / source).read_text(encoding="utf-8"))
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    (DATA / target).write_text(f"window.{variable} = {payload};\n", encoding="utf-8")
    print(f"Updated data/{target}")
