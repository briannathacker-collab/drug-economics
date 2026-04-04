import os
import httpx


def send_price_increase_alert(increases: list[dict]):
    """Send alert when a drug price increase > 5% is confirmed."""
    lines = []
    for i in increases:
        lines.append(
            f"ALERT: {i['drug_name']} ({i['manufacturer']}) "
            f"+{i['pct_increase']}% WAC increase detected "
            f"(confirmed by: {', '.join(i['confirmed_by'])})"
        )
    message = "DRUG ECONOMICS — Price Increase Alert\n\n" + "\n".join(lines)
    _send(message)


def send_integrity_alert(issues: list[str]):
    """Send alert when daily integrity check finds data problems."""
    message = f"DRUG ECONOMICS — Data Integrity Issues ({len(issues)} found)\n\n"
    message += "\n".join(f"- {i}" for i in issues[:10])
    if len(issues) > 10:
        message += f"\n...and {len(issues) - 10} more"
    _send(message)


def _send(message: str):
    webhook = os.environ.get("SLACK_WEBHOOK_URL")
    if webhook:
        try:
            httpx.post(webhook, json={"text": message}, timeout=10)
        except Exception as e:
            print(f"NOTIFY ERROR (Slack): {e}")

    email = os.environ.get("ALERT_EMAIL")
    if email:
        print(f"NOTIFY (email target: {email}): {message[:200]}...")

    print(f"ALERT: {message}")
