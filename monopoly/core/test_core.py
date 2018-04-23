from game import Game, MonopolyHandler
from move_result_enum import MoveResultType
from util import *
from land import *


def testing(x):
    print "new test, step num is: ", x
    game = Game(4)
    steps, move_result = game.roll(x)
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
    print "steps: ", steps
    print move_result
    game.make_decision(move_result)


# test the infra bought and payment
def test2():
    print "new test, step num is: ", 5
    game = Game(4)
    steps, move_result = game.roll(5)
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        print 'debu26'
        move_result.set_decision(True)
    print "steps: ", steps
    print move_result
    print game.get_current_player()
    game.make_decision(move_result)
    print 'money', game.get_player(0).get_money()
    assert game.get_player(0).get_money() == INIT_PLAYER_MONEY - 200

    print game.get_current_player()
    print '---------------'
    steps, move_result = game.roll(5)
    print 'move result', move_result
    game.make_decision(move_result)
    print 'money is: ', game.get_player(1).get_money() == INIT_PLAYER_MONEY - 50
    print 'money', game.get_player(0).get_money()
    assert game.get_player(0).get_money() == INIT_PLAYER_MONEY - 200 + 50
    print 'successful'


# test the card
def test3():
    game = Game(4)
    steps, move_result = game.roll(2)
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
    print "steps: ", steps
    print move_result
    print 'success test3\n'


# test the first player did not buy, the second buy
def test4():
    print "new test, step num is: ", 5
    game = Game(4)
    print 'INIT money', INIT_PLAYER_MONEY
    print 'current one: ', game.get_current_player().get_index()
    print 'current position', game.get_current_player().get_position()
    steps, move_result = game.roll(5)
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(False)
    print "steps: ", steps
    print move_result
    print game.get_current_player()
    game.make_decision(move_result)
    print 'money', game.get_player(0).get_money()
    assert game.get_player(0).get_money() == INIT_PLAYER_MONEY

    print game.get_current_player()
    print '---------------'
    steps, move_result = game.roll(5)
    print 'move result', move_result
    move_result.set_decision(True)

    print 'player1 money is: ', game.get_player(1).get_money()
    game.make_decision(move_result)
    print 'player1 money is: ', game.get_player(1).get_money()
    print 'successful test4\n'


# only 2 players
# 2 rounds, the player pays
def test5():
    print "---test5----"
    game = Game(2)
    steps, move_result = game.roll(2)
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(False)
    print "steps: ", steps
    print move_result
    print game.get_current_player()
    game.make_decision(move_result)
    print 'money', game.get_player(0).get_money()

    print game.get_current_player()
    print '---------------'
    steps, move_result = game.roll(5)
    print 'move result', move_result
    move_result.set_decision(True)
    game.make_decision(move_result)
    print 'player1 money is: ', game.get_player(1).get_money()

    # round2
    print '------- round2 -------'
    steps, move_result = game.roll(3)
    print 'move result: ', move_result
    game.make_decision(move_result)
    print 'player 0 money is', game.get_player(0).get_money()
    assert game.get_player(0).get_money() != INIT_PLAYER_MONEY

    print 'successful test5\n'


# go to jail and correctly update
def test6():
    print "---test6----"
    game = Game(2)
    steps, move_result = game.roll(10)
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(False)
    print "steps: ", steps
    print "move result ->", move_result
    print game.get_current_player().get_index() == 0
    game.make_decision(move_result)
    assert game.get_current_player().get_index() == 1
    steps, move_result = game.roll(2)
    game.make_decision(move_result)

    print '-------round2--------'
    assert game.get_current_player().get_index() == 1
    steps, result = game.roll(5)
    print result.get_move_result_type()
    # print game.get_current_player().get_position()
    game.make_decision(result)

    print '-------round3--------'
    assert game.get_current_player().get_index() == 0
    steps, result = game.roll(7)

    print 'player position is', game.get_current_player().get_position()
    game.make_decision(result)
    print 'successful test6\n'


# try construct a house
def test7():
    print "---test7----"
    game = Game(1)
    steps, move_result = game.roll(3)
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
    print "steps: ", steps
    print move_result
    game.make_decision(move_result)
    steps, move_result = game.roll(40)
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
    print 'money', game.get_current_player().get_money()
    money = game.get_current_player().get_money()
    game.make_decision(move_result)
    assert money == game.get_current_player().get_money() + \
           HOUSE_CONSTRUCTION_COST
    print 'money', game.get_current_player().get_money()

    print 'successful test7\n'


# another player go to the construciton land
def test8():
    print "---test8----"
    game = Game(2)
    steps, move_result = game.roll(3)
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
    print "steps: ", steps
    print move_result
    game.make_decision(move_result)

    steps, move_result = game.roll(2)
    game.make_decision(move_result)

    print '---round2---'
    steps, move_result = game.roll(40)
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
    print 'money', game.get_current_player().get_money()
    money = game.get_current_player().get_money()
    game.make_decision(move_result)
    assert money == game.get_player(0).get_money() + \
           HOUSE_CONSTRUCTION_COST
    print 'money', game.get_current_player().get_money()
    money = game.get_player(1).get_money()
    steps, move_result = game.roll(41)
    game.make_decision(move_result)
    print 'money of player2', game.get_player(1).get_money()
    assert money - 40 == game.get_player(1).get_money()
    print 'successful test8\n'


# go to the first grid
def test9():
    print "---test9----"
    game = Game(1)
    steps, move_result = game.roll(20)
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
    print "steps: ", steps
    print move_result
    game.make_decision(move_result)
    money = game.get_current_player().get_money()
    steps, move_result = game.roll(21)
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
    print 'money', game.get_current_player().get_money()
    assert money + 200 == game.get_current_player().get_money()

    print 'successful test9\n'


# just roll a random
def test10():
    print "---test10----"
    game = Game(1)
    steps, move_result = game.roll()
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
    print "steps: ", steps
    print move_result
    game.make_decision(move_result)
    print 'successful test10\n'


# go to the first grid
def test11():
    print "---test11----"
    game = Game(1)
    money = game.get_current_player().get_money()
    print money
    steps, move_result = game.roll(40)
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
    print "steps: ", steps
    print move_result
    game.make_decision(move_result)
    assert money + 200 == game.get_current_player().get_money()

    print 'successful test11\n'


# tsst event handler
def test12(number):
    print "---test{0}----".format(number)
    game = Game(1)
    money = game.get_current_player().get_money()
    print money
    handler = LogHandler(game)
    game.add_game_change_listner(handler)

    steps, move_result = game.roll()
    # result
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
    print "steps: ", steps
    print move_result
    game.make_decision(move_result)

    print 'successful test{0}\n'.format(number)


def test13(number):
    print "---test{0}----".format(number)
    game = Game(1)
    money = game.get_current_player().get_money()
    print money
    handler = LogHandler(game)
    game.add_game_change_listner(handler)

    steps, move_result = game.roll()
    # result
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
    print "steps: ", steps
    print move_result
    game.make_decision(move_result)
    print game.get_status()

    print 'successful test{0}\n'.format(number)


# building hotel
def test14(number):
    print "---test{0}----".format(number)
    game = Game(1)
    money = game.get_current_player().get_money()
    print money
    handler = LogHandler(game)
    game.add_game_change_listner(handler)

    steps, move_result = game.roll(8)
    # result
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
    print "steps: ", steps
    print move_result
    game.make_decision(move_result)
    print 'the construction land property is: ', game.get_status()[1].get_land(
        8).get_content().get_property_num()
    print 'the construction land property, can upgrade?: ', game.get_status()[
        1].get_land(
        8).get_content().is_constructable()

    print 'new round'
    steps, move_result = game.roll(40)
    # result
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
    print "steps: ", steps
    print move_result
    game.make_decision(move_result)
    print 'the construction land property is: ', game.get_status()[1].get_land(
        8).get_content().get_property_num()
    print 'the construction land property, can upgrade?: ', game.get_status()[
        1].get_land(
        8).get_content().is_constructable()
    print 'now has one house '

    print 'round 3'

    steps, move_result = game.roll(40)
    # result
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
    print "steps: ", steps
    print move_result
    game.make_decision(move_result)
    print 'the construction land property is: ', game.get_status()[1].get_land(
        8).get_content().get_property_num()
    print 'the construction land property, can upgrade?: ', game.get_status()[
        1].get_land(
        8).get_content().is_constructable()
    print 'now has 2 house '

    steps, move_result = game.roll(40)
    # result
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
    print "steps: ", steps
    print move_result
    ret = game.make_decision(move_result)
    print 'decision result: ', ret
    print 'the construction land property is: ', game.get_status()[1].get_land(
        8).get_content().get_property_num()
    print 'the construction land property, can upgrade?: ', game.get_status()[
        1].get_land(
        8).get_content().is_constructable()
    print 'now has 3 house '

    steps, move_result = game.roll(40)
    # result
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
        print 'set decision yes'
    else:
        print 'no decision needed'
    print "steps: ", steps
    print move_result
    ret = game.make_decision(move_result)
    print 'the construction land property is: ', game.get_status()[1].get_land(
        8).get_content().get_property_num()
    print 'the construction land property, can upgrade?: ', game.get_status()[
        1].get_land(
        8).get_content().is_constructable()
    print 'decision result: ', ret
    print 'now has 1 hotel'

    steps, move_result = game.roll(40)
    # result
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
        print 'set decision yes'
    else:
        print 'no decision needed'
    print "steps: ", steps
    print move_result
    ret = game.make_decision(move_result)
    print 'the construction land property is: ', game.get_status()[1].get_land(
        8).get_content().get_property_num()
    print 'the construction land property, can upgrade?: ', game.get_status()[
        1].get_land(
        8).get_content().is_constructable()
    print 'decision result: ', ret

    print 'successful test{0}\n'.format(number)


# This is test that there is no enough money to buy the property
def test15(number):
    print "---test{0}----".format(number)
    game = Game(1)
    game.get_current_player().set_money(20)
    money = game.get_current_player().get_money()
    print money
    handler = LogHandler(game)
    game.add_game_change_listner(handler)

    steps, move_result = game.roll(3)
    # result
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
    print move_result.get_move_result_type()
    print move_result.is_option()
    print "steps: ", steps
    print move_result
    game.make_decision(move_result)
    print game.get_status()

    print 'successful test{0}\n'.format(number)


# This is test that there is no enough money to construct a building
def test16(number):
    print "---test{0}----".format(number)
    game = Game(1)
    game.get_current_player().set_money(80)
    money = game.get_current_player().get_money()
    print money
    handler = LogHandler(game)
    game.add_game_change_listner(handler)

    steps, move_result = game.roll(3)
    # result
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
    print 'move result type is', move_result.get_move_result_type()
    print 'whether it is an option: ', move_result.is_option()
    print "steps: ", steps
    print move_result
    game.make_decision(move_result)
    print game.get_status()

    print '-----round2-----'
    game.get_current_player().set_money(20)
    stop, move_result = game.roll(40)
    print 'debug471', move_result
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
    print 'move result type is', move_result.get_move_result_type()
    print 'whether it is an option: ', move_result.is_option()
    print "steps: ", steps
    print move_result
    game.make_decision(move_result)
    print game.get_status()

    print 'successful test{0}\n'.format(number)


# Game end test case
def test17(number):
    print "---test{0}----".format(number)
    game = Game(2)
    game.get_current_player().set_money(80)
    money = game.get_current_player().get_money()
    print money
    handler = LogHandler(game)
    game.add_game_change_listner(handler)

    steps, move_result = game.roll(3)
    # result
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
    print 'move result type is', move_result.get_move_result_type()
    print 'whether it is an option: ', move_result.is_option()
    print "steps: ", steps
    print move_result
    game.make_decision(move_result)
    print game.get_status()

    game.get_current_player().set_money(5)
    stop, move_result = game.roll(3)
    print 'debug471', move_result
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
    print 'move result type is', move_result.get_move_result_type()
    print 'whether it is an option: ', move_result.is_option()
    print "steps: ", steps
    print move_result
    game.make_decision(move_result)
    print game.get_status()

    print 'successful test{0}\n'.format(number)


# get all the land owners
def test18(number):
    print "---test{0}----".format(number)
    game = Game(2)
    game.get_current_player().set_money(80)
    money = game.get_current_player().get_money()
    print money
    handler = LogHandler(game)
    game.add_game_change_listner(handler)

    steps, move_result = game.roll(3)
    # result
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
    print 'move result type is', move_result.get_move_result_type()
    print 'whether it is an option: ', move_result.is_option()
    print "steps: ", steps
    print move_result
    game.make_decision(move_result)
    print game.get_status()

    print game.get_land_owners()
    assert len(game.get_land_owners()) == 40

    print 'successful test{0}\n'.format(number)


# infra the second time arrive
def test19(number):
    print "---test{0}----".format(number)
    game = Game(1)
    money = game.get_current_player().get_money()
    print money
    handler = LogHandler(game)
    game.add_game_change_listner(handler)

    steps, move_result = game.roll(5)
    # result
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
    print 'move result type is', move_result.get_move_result_type()
    print 'whether it is an option: ', move_result.is_option()
    print "steps: ", steps
    print move_result
    game.make_decision(move_result)
    print game.get_status()

    print '---round2---'

    steps, move_result = game.roll(40)
    # result
    if move_result.move_result_type == MoveResultType.CONSTRUCTION_OPTION \
            or move_result.move_result_type == MoveResultType.BUY_LAND_OPTION:
        move_result.set_decision(True)
    print 'move result type is', move_result.get_move_result_type()
    print 'whether it is an option: ', move_result.is_option()
    print "steps: ", steps
    print move_result
    game.make_decision(move_result)
    print game.get_status()

    print 'successful test{0}\n'.format(number)


class LogHandler(MonopolyHandler):

    def __init__(self, g):
        self.game = g

    def on_error(self, err_msg):
        print "it is an error: " + err_msg

    def on_rolled(self):
        print '[Info] the player {0} is rolling'.format(
            self.game.get_current_player().get_index())

    def on_decision_made(self):
        print '[Info] Decision is made, the decision is'

    def on_new_game(self):
        print 'it is the start of the game'

    def on_game_ended(self):
        pass

    def on_player_changed(self):
        pass

    def on_result_applied(self):
        pass

    def on_pass_start(self):
        pass


def test_suite():
    for i in xrange(1, 12):
        testing(i)
    test2()
    test3()
    test4()
    test5()
    test6()
    test7()
    test8()
    test9()
    test10()
    test11()

    # sprint 3 tests
    test12(12)
    test13(13)
    test14(14)
    test15(15)
    test16(16)
    test17(17)
    test18(18)
    test19(19)


if __name__ == "__main__":
    test_suite()
