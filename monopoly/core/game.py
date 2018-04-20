from player import Player
from game_state_type import GameStateType
from card_deck import CardDeck
from board import Board
from move_result import MoveResult
from move_result_enum import MoveResultType
from game_change_listner import GameChangeListner
from land import LandType
from building import *


class Game(object):

    def __init__(self, player_num):
        assert player_num > 0
        self._players = []
        for i in xrange(player_num):
            self._players.append(Player(i))
        self._game_state = GameStateType.WAIT_FOR_ROLL
        self._card_deck = CardDeck()
        self._board = Board()
        self._current_player_index = 0
        self._handlers = []
        self.add_game_change_listner(MonopolyHandler())

    def add_game_change_listner(self, handler):
        self._handlers.append(handler)

    def _move(self, steps):
        cur_player = self.get_current_player()
        new_position = (
                               cur_player.get_position() + steps) % self._board.get_grid_num()
        if new_position < cur_player.get_position():
            self.get_current_player().add_money(START_REWARD)
        land_dest = self._board.get_land(new_position)
        self.get_current_player().set_position(new_position)
        assert (not (land_dest is None))
        print 'debug41: ', land_dest
        return land_dest

    def _get_move_result(self, land):
        land_type = land.get_type()
        if land_type == LandType.CONSTRUCTION_LAND:
            # if land is owned
            construction_land = land.get_content()
            if construction_land.get_owner_index() is None:
                result_type = MoveResultType.BUY_LAND_OPTION
                val = construction_land.get_price()
                return MoveResult(result_type, val, land)
            elif construction_land.get_owner_index() == \
                    self._current_player_index:
                if construction_land.is_constructable() is False:
                    return MoveResult(MoveResultType.NOTHING, 0, land)
                result_type = MoveResultType.CONSTRUCTION_OPTION
                val = construction_land.get_next_construction_price()
                return MoveResult(result_type, val, land)
            else:
                result_type = MoveResultType.PAYMENT
                val = construction_land.get_rent()
                return MoveResult(result_type, val, land)
        elif land_type == LandType.INFRA:
            print "debug63"
            infra_land = land.get_content()
            if infra_land.get_owner_index() is None:
                result_type = MoveResultType.BUY_LAND_OPTION
                val = infra_land.get_price()
                return MoveResult(result_type, val, land)
            else:
                if infra_land.get_owner_index == self._current_player_index:
                    result_type = MoveResultType.NOTHING
                    val = 0
                    return MoveResult(result_type, val, land)
                result_type = MoveResultType.PAYMENT
                val = infra_land.get_payment()
                return MoveResult(result_type, val, land)

        elif land_type == LandType.START:
            print "debug75"
            result_type = MoveResultType.REWARD
            val = START_REWARD
            return MoveResult(result_type, val, land)
        elif land_type == LandType.PARKING:
            print "debug80"
            result_type = MoveResultType.NOTHING
            val = 0
            return MoveResult(result_type, val, land)
        elif land_type == LandType.JAIL:
            print "debug85"
            result_type = MoveResultType.STOP_ROUND
            val = 1
            return MoveResult(result_type, val, land)
        elif land_type == LandType.CHANCE:
            print "debug landtype chance"
            card = self._card_deck.draw()
            if card.get_money_deduction() > 0:
                result_type = MoveResultType.PAYMENT
                val = card.get_money_deduction()
            else:
                result_type = MoveResultType.REWARD
                val = card.get_money_deduction() * -1
            ret = MoveResult(result_type, val, land)
            ret.set_msg(" Chance Card: " + str(card))
            return ret
        else:
            print "Error, the land is", land_type
            assert False
            return None

    def _apply_result(self, move_result):
        print 'debug95, move result is', move_result
        move_result_type = move_result.get_move_result_type()
        val = move_result.get_value()
        if move_result_type == MoveResultType.BUY_LAND_OPTION:
            print 'debug99'
            construction_land = move_result.get_land().get_content()
            if move_result.yes is True:
                construction_land.set_owner(self._current_player_index)
                self.get_current_player().add_properties(construction_land)
                self.get_current_player().deduct_money(
                    construction_land.get_price())
            else:
                return
        elif move_result_type == MoveResultType.CONSTRUCTION_OPTION:
            construction_land = move_result.get_land().get_content()
            assert construction_land.get_owner_index() \
                   == self._current_player_index
            if move_result.yes is True:
                self.get_current_player().deduct_money(
                    construction_land.get_next_construction_price())
                construction_land.add_properties()
        else:
            if move_result_type == MoveResultType.PAYMENT:
                print 'debug129'
                self.get_current_player().deduct_money(val)
                land = move_result.get_land().get_content()
                if land.get_type() == LandType.CONSTRUCTION_LAND or \
                        land.get_type() == LandType.INFRA:
                    # this is the payment to the player
                    print 'debug133'
                    assert land.get_owner_index() is not None
                    print 'owner index is: ', land.get_owner_index()
                    rewarded_player = self.get_player(land.get_owner_index())
                    rewarded_player.add_money(val)

            elif move_result_type == MoveResultType.REWARD:
                self.get_current_player().add_money(val)

            elif move_result_type == MoveResultType.STOP_ROUND:
                self.get_current_player().add_one_stop()
            else:
                # move result option
                # should never reach here
                return
            self.notify_result_applied()

    def _change_player(self):
        self._current_player_index = self._change_player_on(
            self._current_player_index)

    def _change_player_on(self, cur):
        new_user_index = (cur + 1) % (len(
            self._players))
        print 'debug157', new_user_index
        new_user = self._players[new_user_index]
        if new_user.get_stop_num() > 0:

            new_user.deduct_stop_num()
            return self._change_player_on(new_user_index)
        else:
            return new_user_index

    def _roll_to_next_game_state(self):
        self._game_state = 1 - self._game_state

    def roll(self, steps=None):
        assert self.get_game_status() == GameStateType.WAIT_FOR_ROLL
        if steps is None:
            import random
            steps1 = random.randint(1, 6)
            steps2 = random.randint(1, 6)
            steps = steps1 + steps2
        land_dest = self._move(steps)
        print "debug116", land_dest
        self._roll_to_next_game_state()
        move_result = self._get_move_result(land_dest)
        return steps, move_result

    # if the result type is option, you must set the decision before calling
    # this
    def make_decision(self, decision):
        assert self.get_game_status() == GameStateType.WAIT_FOR_DECISION
        ret = decision
        if decision.move_result_type != MoveResultType.BUY_LAND_OPTION and \
                decision.move_result_type != MoveResultType.CONSTRUCTION_OPTION:
            self._apply_result(decision)
        else:
            print 'debug188'
            assert decision.yes is not None
            self._apply_result(decision)
            ret = MoveResult(decision.get_move_result_type(),
                             decision.get_value(), decision.get_land())
        self._change_player()
        self._roll_to_next_game_state()
        return ret

    # getters
    def get_player(self, index):
        return self._players[index]

    def get_current_player(self):
        return self._players[self._current_player_index]

    def get_land(self, index):
        return self._board.get_land(index)

    def get_players(self):
        return self._players

    def get_game_status(self):
        return self._game_state

    # get the total status of the current game
    # return: return a 4 element tuple:
    # (players, board, current_player_index,game_state)
    def get_status(self):
        return (self.get_players(), self._board,
                self._current_player_index, self.get_game_status())

    # notifications
    def notify_new_game(self):
        for handler in self._handlers:
            handler.on_new_game()

    def notify_game_ended(self):
        for handler in self._handlers:
            handler.on_game_ended()

    def notify_rolled(self):
        for handler in self._handlers:
            handler.on_rolled()

    def notify_player_changed(self):
        for handler in self._handlers:
            handler.on_player_changed()

    def notify_decision_made(self):
        for handler in self._handlers:
            handler.on_decision_made()

    def notify_result_applied(self):
        for handler in self._handlers:
            handler.on_result_applied()

    def notify_error(self, err_msg):
        for handler in self._handlers:
            handler.on_error(err_msg)


class MonopolyHandler(object):
    def on_error(self, err_msg):
        pass

    def on_new_game(self):
        pass

    def on_game_ended(self):
        pass

    def on_rolled(self):
        pass

    def on_player_changed(self):
        pass

    def on_decdision_made(self):
        pass

    def on_result_applied(self):
        pass
