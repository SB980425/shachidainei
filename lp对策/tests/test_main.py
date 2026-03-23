import unittest

from main import parse_markets


class ParseMarketsTests(unittest.TestCase):
    def test_parse_markets_preserves_commas_in_market_names(self):
        env_markets = (
            "111|222:US forces enter Iran by April 30?:38.0,"
            "333|444:Will China invade Taiwan by December 31, 2027?:648.0,"
            "555|666:US x Iran ceasefire by April 15?:23.0"
        )

        markets = parse_markets(env_markets)

        self.assertEqual(len(markets), 3)
        self.assertEqual(markets[1]["token_id"], "333")
        self.assertEqual(markets[1]["no_token_id"], "444")
        self.assertEqual(markets[1]["name"], "Will China invade Taiwan by December 31, 2027?")
        self.assertEqual(markets[1]["ttx"], 648.0)

    def test_parse_markets_preserves_colons_in_market_names(self):
        env_markets = "111|222:Category: US x Iran ceasefire by April 15?:23.0"

        markets = parse_markets(env_markets)

        self.assertEqual(len(markets), 1)
        self.assertEqual(markets[0]["name"], "Category: US x Iran ceasefire by April 15?")
        self.assertEqual(markets[0]["ttx"], 23.0)


if __name__ == "__main__":
    unittest.main()
