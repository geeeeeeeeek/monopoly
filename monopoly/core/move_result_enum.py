class MoveResultType(object):
    BUY_LAND_OPTION = 0
    PAYMENT = 1
    REWARD = 2
    STOP_ROUND = 3
    CONSTRUCTION_OPTION = 4
    NOTHING = 5

    @staticmethod
    def get_description(val):
        ret = ["Choosing to buy or not", \
               "The player should make a payment", \
               "The player is rewarded a fortune", \
               "The player is stopped for one round",
               "Chossing to build a new buildingor not", \
               "Nothing actually happened"]
        return ret[val]
