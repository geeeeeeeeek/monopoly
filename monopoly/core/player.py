from building import Building
class Player(object):
    _money = 0
    _remaining_stop = 0
    _properties = set()
    _position = 0

    def get_position(self):
        return self._position

    def get_money(self):
        return self._money

    def get_stop(self):
        return self._remaining_stop

    def get_properties(self):
        return self._properties

    def remove_property(self, building):
        self._properties.remove(building)

    def set_money(self, new_val):
        self._money = new_val

    def set_stop(self):
        self._remaining_stop = 1

def test():
    b = Building(1,1,1,1,1,1)
    c = Building(1,1,1,1,1,1)
    assert b == c

test()





