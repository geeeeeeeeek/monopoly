from building import Building
from util import *


class Player(object):
    # _money = 0
    # _index = 0
    # _remaining_stop = 0
    # _properties = set()
    # _position = 0

    def __init__(self, index):
        self._index = index
        self._money = INIT_PLAYER_MONEY
        self._position = 0
        self._remaining_stop = 0
        self._properties = set()


    def get_position(self):
        return self._position

    def get_money(self):
        return self._money

    def get_stop(self):
        return self._remaining_stop

    def add_properties(self, land):
        self._properties.add(land)

    def get_properties(self):
        return self._properties

    def get_asset(self):
        ret = self.get_money()
        for land in self._properties:
            ret += land.get_evaluation()
        return ret

    def remove_property(self, building):
        self._properties.remove(building)

    def set_money(self, new_val):
        self._money = new_val

    def add_money(self, val):
        self._money += val

    def deduct_money(self, val):
        self._money -= val

    def get_stop_num(self):
        return self._remaining_stop

    def set_stop(self, val):
        self._remaining_stop = val

    def add_stop(self, val):
        self._remaining_stop += val

    def add_one_stop(self):
        self._remaining_stop += 1

    def deduct_stop_num(self):
        self._remaining_stop -= 1

    def set_position(self, pos):
        self._position = pos

    def get_index(self):
        return self._index

    def __str__(self):
        return "Player index: {0}".format(self._index)




def test():
    b = Building(1, 1, 1, 1, 1, 1)
    c = Building(1, 1, 1, 1, 1, 1)
    # assert b == c


test()
