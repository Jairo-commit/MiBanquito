import logging
import time
from decimal import Decimal

import requests

logger = logging.getLogger(__name__)

DEFAULT_CDT_RATE = Decimal("0.12")
DEFAULT_LOAN_RATE = Decimal("0.015")

SODA_API_URL = "https://www.datos.gov.co/resource/mfkf-jn8f.json"

_rates_cache = {"data": None, "fetched_at": 0}
CACHE_TTL = 300


def fetch_current_rates():
    now = time.monotonic()
    cache_is_valid = (
        _rates_cache["data"] is not None
        and now - _rates_cache["fetched_at"] < CACHE_TTL
    )
    if cache_is_valid:
        return _rates_cache["data"]
    try:
        response = requests.get(SODA_API_URL, timeout=3)
        response.raise_for_status()
        data = response.json()
        if data:
            latest = data[0]
            result = {
                "cdt_rate": Decimal(str(latest.get("tasa_cdt", DEFAULT_CDT_RATE))),
                "loan_rate": Decimal(
                    str(latest.get("tasa_credito", DEFAULT_LOAN_RATE))
                ),
            }
            _rates_cache["data"] = result
            _rates_cache["fetched_at"] = now
            return result
    except Exception as e:
        logger.warning("SODA API unavailable, using default rates: %s", e)
    return {
        "cdt_rate": DEFAULT_CDT_RATE,
        "loan_rate": DEFAULT_LOAN_RATE,
    }


def calculate_cdt(capital, effective_annual_rate, days):
    capital = Decimal(str(capital))
    effective_annual_rate = Decimal(str(effective_annual_rate))
    days = Decimal(str(days))
    exponent = days / Decimal("365")
    interest = capital * ((1 + effective_annual_rate) ** exponent - 1)
    return interest.quantize(Decimal("0.01"))


def calculate_loan_quota(principal, monthly_rate, term_months):
    principal = Decimal(str(principal))
    monthly_rate = Decimal(str(monthly_rate))
    term_months = int(term_months)
    rate_factor = (1 + monthly_rate) ** term_months
    quota = principal * (monthly_rate * rate_factor) / (rate_factor - 1)
    return quota.quantize(Decimal("0.01"))
