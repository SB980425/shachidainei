import unittest

from core.risk_manager import RiskManager


class RiskManagerDailyResetTests(unittest.TestCase):
    def test_maybe_reset_daily_only_when_day_changes(self):
        risk_mgr = RiskManager({"capital": {"total_allocated": 1000.0}})
        risk_mgr._daily_reset_day = risk_mgr._day_bucket(3600.0)

        self.assertFalse(risk_mgr.maybe_reset_daily(1200.0, timestamp=3600.0))
        self.assertEqual(risk_mgr._day_start_equity, 1000.0)

        self.assertTrue(risk_mgr.maybe_reset_daily(1500.0, timestamp=90000.0))
        self.assertEqual(risk_mgr._day_start_equity, 1500.0)
        self.assertEqual(risk_mgr._daily_pnl, 0.0)
