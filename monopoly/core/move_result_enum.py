class MoveResultType(object):
    BUY_LAND_OPTION = 0
    PAYMENT = 1
    REWARD = 2
    STOP_ROUND = 3
    CONSTRUCTION_OPTION = 4
    NOTHING = 5

    @staticmethod
    def get_description(val):
        ret = ["is choosing to buy or not. ",
               "should make a payment. ",
               "is rewarded a fortune. ",
               "is stopped for one round. ",
               "is choosing to build a new building or not. ",
               "Nothing actually happened. "]
        return ret[val]
