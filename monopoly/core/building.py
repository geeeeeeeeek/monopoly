# Building class
import unittest

RATIO_RENT_TO_PRICE_FOR_HOUSE = 4
RATIO_RENT_TO_PRICE_FOR_HOTEL = 2

HOTEL_CONSTRUCTION_COST = 150
HOUSE_CONSTRUCTION_COST = 100

START_REWARD = 200


# immutable
class Building(object):
    # land_index = None
    # building_type = None
    # price = 0
    # description = "Empty Building"
    # id = 0
    # owner = None

    def __init__(self, id, land_index, building_type, price, description,
                 owner):
        self.id = id
        self.land_index = land_index
        self.building_type = building_type
        self.price = price
        self.description = description
        self.owner = owner

    def get_description(self):
        return self.description

    def get_land_index(self):
        return self.land_index

    def get_building_type(self):
        return self.building_type

    def get_price(self):
        return self.price

    def get_id(self):
        return self.id

    def __hash__(self):
        return hash(self.id)

    def __eq__(self, other):
        return self.id == other.id

    def __ne__(self, other):
        return not self.__eq__(other)


class BuildingType(object):
    HOUSE = 0
    HOTEL = 1
    NOTHING = 2




# def test_answer():
#     b = Building(1, 1, 1, 1)
#     assert 1 == b.get_price()


if __name__ == '__main__':
    pass
    # unittest.main()
    # test_answer()
    # print b.get_description()
