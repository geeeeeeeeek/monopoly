from monopoly.ws_handlers.game_handler import *


class ChangeHandler(MonopolyHandler):
    def __init__(self, game, hostname):
        self.game = game
        self.hostname = hostname
        self._is_end = False
        self._bypass_start = False

    def is_end(self):
        return self._is_end

    def bypass_start(self):
        return self._bypass_start

    def set_bypass_start(self):
        self._bypass_start = False

    def on_pass_start(self):
        self._bypass_start = True
        print 'bypass start point'

    def on_error(self, err_msg):

        print "it is an error" + err_msg

    def on_rolled(self):
        print '[Info] the player {0} is rolling'.format(
            self.game.get_current_player().get_index())

    def on_decision_made(self):
        print '[Info] Decision is made, the decision is'

    def on_new_game(self):
        print 'it is the start of the game'

    def on_game_ended(self):
        self._is_end = True
        print 'this is the end of the game'

    def on_player_changed(self):
        pass

    def on_result_applied(self):
        pass
