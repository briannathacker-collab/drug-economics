"""Shared schema validators for bot data outputs."""

from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"


def validate_cms_asp(data: list[dict]):
    """Validate CMS ASP data structure before writing."""
    if not isinstance(data, list):
        raise ValueError("CMS ASP data must be a list")
    for drug in data:
        if "drug_name" not in drug:
            raise ValueError(f"Missing drug_name in CMS ASP entry: {drug}")
        if "ndc" not in drug and "hcpcs_code" not in drug:
            raise ValueError(f"Missing ndc/hcpcs_code in CMS ASP entry for {drug.get('drug_name')}")
        for q in drug.get("quarters", []):
            if "quarter" not in q:
                raise ValueError(f"Missing quarter label in {drug.get('drug_name')}")
            if "asp_cents" not in q:
                raise ValueError(f"Missing asp_cents in {drug.get('drug_name')} quarter {q.get('quarter')}")
            if not isinstance(q["asp_cents"], int) or q["asp_cents"] < 0:
                raise ValueError(f"Invalid asp_cents in {drug.get('drug_name')}: {q['asp_cents']}")


def validate_wac_prices(data: list[dict]):
    """Validate WAC price data before writing."""
    if not isinstance(data, list):
        raise ValueError("WAC data must be a list")
    for drug in data:
        required = ["drug_name", "manufacturer_id", "wac_monthly"]
        for field in required:
            if field not in drug:
                raise ValueError(f"Missing {field} in WAC entry: {drug.get('drug_name', 'unknown')}")
        wac = drug.get("wac_monthly", 0)
        if not isinstance(wac, int) or wac < 0:
            raise ValueError(f"Invalid wac_monthly for {drug.get('drug_name')}: {wac}")


def validate_manufacturer_financials(data: list[dict]):
    """Validate manufacturer financial data before writing."""
    if not isinstance(data, list):
        raise ValueError("Manufacturer financials must be a list")
    for mfr in data:
        if "manufacturer" not in mfr and "manufacturer_id" not in mfr:
            raise ValueError(f"Missing manufacturer identifier: {mfr}")
        if "ticker" not in mfr:
            raise ValueError(f"Missing ticker for {mfr.get('manufacturer', 'unknown')}")


def validate_patents(data: list[dict]):
    """Validate patent data before writing."""
    if not isinstance(data, list):
        raise ValueError("Patent data must be a list")
    for entry in data:
        if "drug_name" not in entry and "drug_id" not in entry:
            raise ValueError(f"Missing drug identifier in patent entry: {entry}")


def validate_pipeline_trials(data: list[dict]):
    """Validate clinical trial pipeline data."""
    if not isinstance(data, list):
        raise ValueError("Pipeline trials data must be a list")
    valid_phases = {"Phase I", "Phase II", "Phase III", "Phase IV", "Pre-clinical"}
    for trial in data:
        phase = trial.get("phase", "")
        if phase and phase not in valid_phases:
            raise ValueError(f"Invalid trial phase '{phase}' for {trial.get('drug_name', 'unknown')}")


def validate_biosimilar_pipeline(data: list[dict]):
    """Validate biosimilar pipeline data."""
    if not isinstance(data, list):
        raise ValueError("Biosimilar data must be a list")
    valid_statuses = {"approved", "tentative_approval", "filed", "phase_3", "phase_1", "discontinued"}
    for entry in data:
        status = entry.get("status", "")
        if status and status not in valid_statuses:
            raise ValueError(f"Invalid biosimilar status '{status}' for {entry.get('drug_name', 'unknown')}")
