from card import Card


class CardDeck(object):
    # _cards = []
    # _index = 0

    # property
    def __init__(self):
        self._index = 0
        self._cards = []
        self._cards.append(Card("Get One More Grace day ", 100, 0))
        self._cards.append(Card("Overspeed ", 200, 0))
        # self._cards.append(Card("Autolab rank awarding ", 300, 0))
        self._cards.append(Card("Illegal Parking ", 150, 0))
        # self._cards.append(Card("Stop one round", 0, 1))
        # self._cards.append(Card("first one", 100, 0))

    def insert(self, card):
        self._cards.append(card)

    def shuffle(self):
        pass

    def draw(self):
        self._index = (self._index + 1) % len(self._cards)
        if self._index == 0:
            self.shuffle()
        return self._cards[self._index]
