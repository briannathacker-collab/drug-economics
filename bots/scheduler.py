"""
Drug Economics — Bot Scheduler
Runs all background data bots on their appropriate cadences.
Deploy as a separate worker process alongside the Next.js frontend.

On startup, runs all bots immediately to catch up on stale data,
then continues on their normal cron schedules.
"""

import argparse
import importlib
import logging
import signal
import sys
import time
from pathlib import Path

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

# Ensure bots directory is on the import path
sys.path.insert(0, str(Path(__file__).resolve().parent))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("scheduler")


def safe_run(module_name: str):
    """Import and run a bot module, catching all errors so the scheduler stays alive."""
    try:
        logger.info(f"Running {module_name}...")
        mod = importlib.import_module(module_name)
        importlib.reload(mod)  # pick up code changes without restart
        mod.run()
        logger.info(f"Finished {module_name}")
    except Exception:
        logger.exception(f"Bot {module_name} failed — scheduler continues")


# ── Bot schedule definitions ──
BOT_SCHEDULE = [
    {
        "module": "bot_integrity",
        "trigger": CronTrigger(hour="5", minute="0"),
        "id": "integrity",
        "name": "Daily Data Integrity Check",
    },
    {
        "module": "bot_wac_monitor",
        "trigger": CronTrigger(day_of_week="mon", hour="7", minute="0"),
        "id": "wac_monitor",
        "name": "WAC Price Increase Monitor",
    },
    {
        "module": "bot_fda_approvals",
        "trigger": CronTrigger(day_of_week="tue", hour="7", minute="0"),
        "id": "fda_approvals",
        "name": "FDA Approvals & Patent Monitor",
    },
    {
        "module": "bot_trials",
        "trigger": CronTrigger(day_of_week="wed", hour="7", minute="0"),
        "id": "trials",
        "name": "ClinicalTrials Pipeline Refresh",
    },
    {
        "module": "bot_biosimilar",
        "trigger": CronTrigger(day_of_week="thu", hour="7", minute="0"),
        "id": "biosimilar",
        "name": "FDA Biosimilar Approval Monitor",
    },
    {
        "module": "bot_ira_prices",
        "trigger": CronTrigger(day="1", hour="8", minute="0"),
        "id": "ira_prices",
        "name": "IRA Negotiated Price Monitor",
    },
    {
        "module": "bot_international",
        "trigger": CronTrigger(day="5", hour="8", minute="0"),
        "id": "international",
        "name": "International Price Comparison",
    },
    {
        "module": "bot_cms_asp",
        "trigger": CronTrigger(month="1,4,7,10", day="15", hour="6", minute="0"),
        "id": "cms_asp",
        "name": "CMS ASP Quarterly Refresh",
    },
    {
        "module": "bot_sec_earnings",
        "trigger": CronTrigger(month="2,5,8,11", day="15", hour="7", minute="0"),
        "id": "sec_earnings",
        "name": "SEC Quarterly Earnings Refresh",
    },
]


def run_startup_sweep():
    """Run all bots once on startup to catch up after downtime."""
    logger.info("=== Startup sweep: running all bots to catch up ===")
    for bot in BOT_SCHEDULE:
        safe_run(bot["module"])
    logger.info("=== Startup sweep complete ===")


def main():
    parser = argparse.ArgumentParser(description="Drug Economics bot scheduler")
    parser.add_argument(
        "--no-startup-sweep",
        action="store_true",
        help="Skip the initial run of all bots on startup",
    )
    args = parser.parse_args()

    scheduler = BackgroundScheduler(timezone="America/New_York")

    # Register all scheduled jobs
    for bot in BOT_SCHEDULE:
        scheduler.add_job(
            lambda m=bot["module"]: safe_run(m),
            bot["trigger"],
            id=bot["id"],
            name=bot["name"],
            misfire_grace_time=3600,  # allow 1hr late runs instead of skipping
        )

    logger.info("Drug Economics bot scheduler starting...")
    logger.info("Registered jobs:")
    for job in scheduler.get_jobs():
        logger.info(f"  {job.name} — {job.trigger}")

    # Run all bots on startup unless skipped
    if not args.no_startup_sweep:
        run_startup_sweep()

    scheduler.start()
    logger.info("Scheduler is running. Press Ctrl+C to stop.")

    # Keep the process alive, handle graceful shutdown
    shutdown = False

    def handle_signal(signum, frame):
        nonlocal shutdown
        logger.info("Shutdown signal received, stopping scheduler...")
        shutdown = True

    signal.signal(signal.SIGINT, handle_signal)
    signal.signal(signal.SIGTERM, handle_signal)

    while not shutdown:
        time.sleep(60)

    scheduler.shutdown(wait=True)
    logger.info("Scheduler stopped.")


if __name__ == "__main__":
    main()
