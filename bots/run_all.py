"""
Run all bots immediately — useful for first deploy, catching up after downtime,
or manual data refresh.

Usage:
    python bots/run_all.py
    python bots/run_all.py --bot bot_wac_monitor   # run just one
"""

import argparse
import importlib
import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("run_all")

ALL_BOTS = [
    "bot_integrity",
    "bot_wac_monitor",
    "bot_fda_approvals",
    "bot_trials",
    "bot_biosimilar",
    "bot_ira_prices",
    "bot_international",
    "bot_cms_asp",
    "bot_sec_earnings",
]


def run_bot(name: str):
    try:
        logger.info(f"Starting {name}...")
        mod = importlib.import_module(name)
        mod.run()
        logger.info(f"Finished {name}")
        return True
    except Exception:
        logger.exception(f"FAILED: {name}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Run drug economics data bots")
    parser.add_argument("--bot", help="Run a single bot by name", default=None)
    args = parser.parse_args()

    if args.bot:
        if args.bot not in ALL_BOTS:
            logger.error(f"Unknown bot: {args.bot}. Available: {ALL_BOTS}")
            sys.exit(1)
        success = run_bot(args.bot)
        sys.exit(0 if success else 1)

    logger.info(f"Running all {len(ALL_BOTS)} bots...")
    results = {}
    for bot in ALL_BOTS:
        results[bot] = run_bot(bot)

    passed = sum(1 for v in results.values() if v)
    failed = sum(1 for v in results.values() if not v)
    logger.info(f"Done — {passed} passed, {failed} failed")

    if failed:
        logger.warning("Failed bots: " + ", ".join(b for b, v in results.items() if not v))
        sys.exit(1)


if __name__ == "__main__":
    main()
