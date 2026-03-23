import unittest

from core.volatility_surface import VolatilitySurface


class VolatilitySurfaceTests(unittest.TestCase):
    def test_rebuild_clears_stale_surface_buckets(self):
        surface = VolatilitySurface(
            {
                "vol_surface": {
                    "time_buckets": [1.0],
                    "prob_buckets": [0.5],
                    "lookback_window": 1,
                    "update_interval": 1,
                }
            }
        )

        for offset, value in enumerate([0.010, 0.012, 0.008, 0.011, 0.009], start=1):
            surface.add_observation(3000.0 + offset, 1.0, 0.5, value)

        surface.rebuild(current_time=3600.0)
        self.assertNotEqual(surface.query(1.0, 0.5), 2.0)

        surface.rebuild(current_time=8000.0)
        self.assertEqual(surface.query(1.0, 0.5), 2.0)
