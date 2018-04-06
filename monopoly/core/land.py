class Land(object):
    _pos = 0  # index
    _description = "Empty Land"  # land
    _price = 0  # price
    _properties = []  # the list of the properties, if len == 0, means no

    # property
    def __init__(self, pos, description, price):
        self._pos = pos
        self._description = description
        self._price = price

    def get_pos(self):
        return self._pos

    def get_description(self):
        return self._description

    def get_price(self):
        return self._price

    def get_properties(self):
        return self._properties

    def clear_properties(self):
        self._properties = []

    def add_properties(self, building):
        self._properties.append(building)

    def __str__(self):
        return "land pos {0}".format(self._pos)
