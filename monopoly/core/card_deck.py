from card import Card
from random import shuffle


class CardDeck(object):

    # property
    def __init__(self):
        self._index = 0
        self._cards = []
        self._cards.append(Card("Get One More Grace day ", 100, 0))
        self._cards.append(Card("Overspeed ", 200, 0))
        self._cards.append(Card("Autolab rank reward ", -100, 0))
        self._cards.append(Card("Illegal Parking ", 150, 0))
        self._cards.append(Card("Meet harry potter in Doherty Hall", -150, 0))
        self._cards.append(Card("Host a fantastic Carnival", -200, 0))
        self.shuffle()

    def insert(self, card):
        self._cards.append(card)

    def shuffle(self):
        shuffle(self._cards)

    def draw(self):
        self._index = (self._index + 1) % len(self._cards)
        if self._index == 0:
            self.shuffle()
        return self._cards[self._index]
