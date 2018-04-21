from move_result_enum import *


class MoveResult(object):
    # move_result_type = None
    # value = None
    # yes = None
    # land = None

    def __init__(self, move_result_type, value, land):
        self.move_result_type = move_result_type
        self.value = value
        self.land = land
        self.yes = None
        self.msg = None

    def set_msg(self, msg):
        self.msg = msg

    def get_move_result_type(self):
        return self.move_result_type

    def get_value(self):
        return self.value

    def get_land(self):
        return self.land

    def set_decision(self, decision):
        assert self.move_result_type == MoveResultType.BUY_LAND_OPTION or \
               self.move_result_type == MoveResultType.CONSTRUCTION_OPTION
        self.yes = decision

    def get_decision(self):
        assert self.move_result_type == MoveResultType.BUY_LAND_OPTION or \
               self.move_result_type == MoveResultType.CONSTRUCTION_OPTION
        return self.yes

    def is_option(self):
        return self.move_result_type == MoveResultType.BUY_LAND_OPTION or \
               self.move_result_type == MoveResultType.CONSTRUCTION_OPTION

    def __str__(self):
        saying = self.msg if self.msg else ""
        saying += MoveResultType.get_description(self.move_result_type)
        ret = saying + " value:{0}, land: {1}".format(
            self.value, self.land)
        if self.yes is not None:
            ret += " decision: {0}".format(self.yes)
        return ret

    def beautify(self):
        saying = self.msg if self.msg else ""
        saying += " " + MoveResultType.get_description(self.move_result_type)
        if self.move_result_type == MoveResultType.BUY_LAND_OPTION:
            saying += "The price is " + str(self.value)
        elif self.move_result_type == MoveResultType.PAYMENT:
            saying += "The payment amount is " + str(self.value)
        elif self.move_result_type == MoveResultType.REWARD:
            saying += "The award amount is " + str(self.value)
        elif self.move_result_type == MoveResultType.STOP_ROUND:
            pass
        elif self.move_result_type == MoveResultType.CONSTRUCTION_OPTION:
            saying += "The cost for the building is " + str(self.value)
        else:
            pass

        return saying
