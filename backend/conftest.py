import pytest
import simulators.services as simulator_services


@pytest.fixture(autouse=True)
def reset_rates_cache():
    simulator_services._rates_cache["data"] = None
    simulator_services._rates_cache["fetched_at"] = 0
