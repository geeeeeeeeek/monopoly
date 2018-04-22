from land import *


class Board(object):

    def __init__(self):
        self._lands = []
        self.generate_lands()

    def get_lands(self):
        return self._lands

    def get_land(self, index):
        return self._lands[index]

    def generate_lands(self):
        self._lands.append(Land(0, "Start", StartLand(START_REWARD)))
        self._lands.append(Land(1, "Warner Hall", ConstructionLand(60)))
        self._lands.append(Land(2, "Chance", ChanceLand()))
        self._lands.append(Land(3, "UC", ConstructionLand(60)))
        self._lands.append(Land(4, "Union Grill", Infra(150)))
        self._lands.append(Land(5, "AB route", Infra(200)))
        self._lands.append(Land(6, "College of Fine Art", ConstructionLand(
            100)))
        self._lands.append(Land(7, "Chance", ChanceLand()))
        self._lands.append(Land(8, "Posner Hall", ConstructionLand(100)))
        self._lands.append(Land(9, "Hunt Library", ConstructionLand(120)))
        self._lands.append(Land(10, "AIV Jail", JailLand(1)))
        self._lands.append(Land(11, "Doherty Hall", ConstructionLand(140)))
        self._lands.append(Land(12, "Entropy+", Infra(150)))
        self._lands.append(Land(13, "Gasling Stadium", ConstructionLand(140)))
        self._lands.append(Land(14, "Margaret Morrison Carnegie Hall",
                                ConstructionLand(160)))
        self._lands.append(Land(15, "Escort", Infra(200)))
        self._lands.append(Land(16, "Hamerschlag Hall", ConstructionLand(180)))
        self._lands.append(Land(17, "Chance", ChanceLand()))
        self._lands.append(Land(18, "Roberts Engineering Hall",
                                ConstructionLand(180)))
        self._lands.append(Land(19, "Porter Hall", ConstructionLand(200)))
        self._lands.append(Land(20, "Parking", ParkingLand()))
        self._lands.append(Land(21, "Gates Center", ConstructionLand(220)))
        self._lands.append(Land(22, "Chance", ChanceLand()))
        self._lands.append(Land(23, "Newell-Simon Hall", ConstructionLand(220)))
        self._lands.append(Land(24, "Wean Hall", ConstructionLand(240)))
        self._lands.append(Land(25, "PTC", Infra(200)))
        self._lands.append(Land(26, "Baker Hall", ConstructionLand(260)))
        self._lands.append(Land(27, "Fence", ConstructionLand(260)))
        self._lands.append(Land(28, "iNoodle", Infra(150)))
        self._lands.append(Land(29, "Purnell Center", ConstructionLand(280)))
        self._lands.append(Land(30, "AIV Jail", JailLand(1)))
        self._lands.append(Land(31, "Hamburg Hall", ConstructionLand(300)))
        self._lands.append(Land(32, "Collaborative Innovation Center",
                                ConstructionLand(300)))
        self._lands.append(Land(33, "Chance", ChanceLand()))
        self._lands.append(Land(34, "Cyert Hall", ConstructionLand(320)))
        self._lands.append(Land(35, "Monorail", Infra(200)))
        self._lands.append(Land(36, "Chance", ChanceLand()))
        self._lands.append(Land(37, "Information Networking Institute",
                                ConstructionLand(350)))
        self._lands.append(Land(38, "Pasta Vilaggio", Infra(150)))
        self._lands.append(Land(39, "Mellon Institute", ConstructionLand(
            400)))

    def get_grid_num(self):
        return len(self._lands)


def test():
    b = Board()
    assert b.get_land(1).get_position() == 1
    assert b.get_land(10).get_content().get_type() == LandType.JAIL


if __name__ == "__main__":
    test()
