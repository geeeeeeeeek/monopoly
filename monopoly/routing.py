from channels.routing import route
from monopoly.room_joining import ws_add, ws_disconnect

channel_routing = [
    route("websocket.connect", ws_add),
    #   route("websocket.receive", ws_message),
    route("websocket.disconnect", ws_disconnect),
]
