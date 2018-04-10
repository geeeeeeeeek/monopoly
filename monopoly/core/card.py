class Card(object):
    # _description = ""
    # _money_deduction = 0
    # _stop_round = 0

    def __init__(self, description, money_deduction, stop_round):
        self._description = description
        self._money_deduction = money_deduction
        self._stop_round = stop_round

    def get_description(self):
        return self._description

    def get_money_deduction(self):
        return self._money_deduction

    def get_stop_round(self):
        return self._stop_round

    def __str__(self):
        return self.get_description()
