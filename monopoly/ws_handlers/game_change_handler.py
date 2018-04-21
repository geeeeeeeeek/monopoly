from monopoly.ws_handlers.game_handler import *

class ChangeHandler(MonopolyHandler):
    def __init__(self, game, hostname):
        self.game = game
        self.hostname = hostname

    def on_pass_start(self):
        curr_player = self.game.get_current_player().get_index()
        Group(self.hostname).send({
            "text": build_pass_start_msg(curr_player)
        })