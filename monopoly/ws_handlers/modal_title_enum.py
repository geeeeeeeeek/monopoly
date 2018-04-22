class ModalTitleType():
    @staticmethod
    def get_description(val):
        ret = ["Purchase Land",
               "Make a Payment",
               "Get Reward",
               "Stop One Round",
               "Build a House",
               "Nothing actually happened"]
        return ret[val]