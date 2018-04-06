from land import Land


class Board(object):
    lands = []

    def __init__(self, board_json = None):
        self.generate_lands()

    def get_lands(self):
        return self.lands

    def get_land(self, index):
        return self.lands[index]

    def generate_lands(self, num=40):
        for i in xrange(num):
            self.lands.append(Land(i, "tile" + str(i), i + 100))


def test():
    b = Board()
    assert b.get_land(1).get_pos() == 1


if __name__ == "__main__":
    test()
