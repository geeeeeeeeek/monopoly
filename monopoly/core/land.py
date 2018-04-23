from building import *


class Land(object):
    # _pos = 0  # index
    # _description = "Empty Land"  # land
    # _content = None

    # property
    def __init__(self, pos, description, content):
        self._pos = pos
        self._description = description
        self._content = content

    def add_handler(self, handler):
        self._handlers.append(handler)

    def set_content(self, cotent_land):
        self._content = cotent_land

    def get_type(self):
        return self._content.get_type()

    def get_evaluation(self):
        if self.get_content().get_type() == LandType.INFRA or self.get_content(
        ).get_type() == LandType.CONSTRUCTION_LAND:
            return self.get_content().get_evaluation()
        return 0

    def get_content(self):
        return self._content

    def get_position(self):
        return self._pos

    def get_description(self):
        return self._description

    def get_price(self):
        return self._price

    def __str__(self):
        type_str = LandType.get_description(self.get_type())
        return "land position {0}, land content type {1}".format(
            self.get_position(), type_str)


class ConstructionLand(object):
    # _price = 0
    # _properties = BuildingType.NOTHING  # the list of the properties, if len == 0,
    # # means no
    # _building_num = 0
    # _owner = None

    def __init__(self, price):
        self._price = price
        self._properties = BuildingType.NOTHING
        self._building_num = 0
        self._owner = None

    def get_price(self):
        return self._price

    def get_evaluation(self):
        building_value = self._price
        if self._properties == BuildingType.HOUSE:
            building_value += HOUSE_CONSTRUCTION_COST * self._building_num
        elif self._properties == BuildingType.HOTEL:
            building_value += HOUSE_CONSTRUCTION_COST * 3 + HOTEL_CONSTRUCTION_COST
        return building_value

    def get_property(self):
        return self._properties

    def get_property_type(self):
        if self._building_num == 0:
            return BuildingType.NOTHING
        return self._properties

    def get_type(self):
        return LandType.CONSTRUCTION_LAND

    def get_next_construction_price(self):
        if self._properties == BuildingType.HOUSE and self._building_num == 3:
            return HOTEL_CONSTRUCTION_COST
        return HOUSE_CONSTRUCTION_COST

    def get_property_num(self):
        return self._building_num

    def clear_properties(self):
        self._properties = BuildingType.NOTHING
        self._building_num = 0

    def set_owner(self, index):
        self._owner = index

    def is_constructable(self):
        return not self._properties == BuildingType.HOTEL

    def get_owner_index(self):
        return self._owner

    def add_properties(self):
        if self._properties == BuildingType.NOTHING or \
                (self._properties == BuildingType.HOUSE and
                 self._building_num < 3):
            self._building_num += 1
            self._properties = BuildingType.HOUSE
            return True
        elif self._properties == BuildingType.HOUSE and self._building_num == 3:
            self._properties = BuildingType.HOTEL
            self._building_num = 1
            return True
        elif self._properties == BuildingType.HOTEL:
            return False
        else:
            # error
            print 'Fatal error when adding properties'
            assert False

    def get_rent(self):
        if self._properties == BuildingType.NOTHING:
            ret = 0
        if self._properties == BuildingType.HOTEL:
            ret = (self._price + HOTEL_CONSTRUCTION_COST) / \
                  RATIO_RENT_TO_PRICE_FOR_HOTEL
        else:
            ret = (self._price + \
                   self._building_num *
                   HOUSE_CONSTRUCTION_COST) / \
                  RATIO_RENT_TO_PRICE_FOR_HOUSE
        print 'debug114, rent is', ret
        return ret


class Infra(object):
    # _price = 0
    # _owner = None

    def __init__(self, price):
        self._price = price
        self._owner = None

    def get_owner_index(self):
        return self._owner

    def get_price(self):
        return self._price

    def get_type(self):
        return LandType.INFRA

    def set_owner(self, index):
        self._owner = index

    def get_payment(self):
        return self.get_price() / 4

    def get_evaluation(self):
        return self.get_price()


class StartLand(object):
    # _reward = 0

    def __init__(self, reward):
        self._reward = reward

    def get_reward(self):
        return self._reward

    def get_type(self):
        return LandType.START

    def get_owner_index(self):
        return None


class JailLand(object):
    # _stops = 0

    def __init__(self, stops):
        self._stops = stops

    def get_stop_num(self):
        return self._stops

    def get_type(self):
        return LandType.JAIL

    def get_owner_index(self):
        return None


class ParkingLand(object):
    def get_type(self):
        return LandType.PARKING

    def get_owner_index(self):
        return None


class ChanceLand(object):
    def get_type(self):
        return LandType.CHANCE

    def get_owner_index(self):
        return None


class LandType(object):
    CONSTRUCTION_LAND = 0
    INFRA = 1
    START = 2
    PARKING = 3
    JAIL = 4
    CHANCE = 5

    @staticmethod
    def get_description(val):
        ret = ["Construction Land",
               "Infrastructure",
               "New Start",
               "Parking ",
               "AIV Jail",
               "Chance Card"]
        return ret[val]
