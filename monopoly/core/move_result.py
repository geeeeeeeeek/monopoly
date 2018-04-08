class MoveResult(object):
    move_result_type = None
    value = None

    def __init__(self, move_result_type, value):
        self.move_result_type = move_result_type
        self.value = value #testing