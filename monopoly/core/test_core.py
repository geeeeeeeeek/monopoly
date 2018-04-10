from game import Game
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
    print 'success test3'

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
    print 'successful test4'


# only 2 players
# 2 rounds, the player pays
def test5():
    print "new test---test5----"
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
    assert game.get_player(0).get_money() == INIT_PLAYER_MONEY - 200 - 50

    print 'successful test5'


# go to jail and correctly update
def test6():
    print "new test---test6----"
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
    print 'successful test6'


# try construct a house
def test7():
    print "new test---test7----"
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

    print 'successful test7'


# another player go to the construciton land
def test8():
    print "new test---test8----"
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
    print 'money of player2', game.get_player(1).get_money()
    steps, move_result = game.roll(41)
    game.make_decision(move_result)
    print 'money of player2', game.get_player(1).get_money()
    print 'successful test8'


def test_suite():
    # for i in xrange(1, 11):
    #     testing(i)
    test2()
    test3()
    test4()
    test5()
    test6()
    test7()
    test8()
    test4()


if __name__ == "__main__":
    test_suite()
