from channels import Group
from django.core import serializers
from django.contrib.auth.decorators import login_required
from channels.auth import http_session_user, channel_session_user, \
    channel_session_user_from_http
from monopoly.models import Profile
from django.contrib.auth.models import User


import json


# Connected to websocket.connect
# @login_required

rooms = {}

def ws_message(message):
    print 'message is: ', message.content


# @login_required
@channel_session_user_from_http
def ws_add(message):
    # Accept the connection
    print 'ws_add invoked'
    message.reply_channel.send({"accept": True})
    mypath = message.content['path']
    print 'path is', mypath
    if 'join' in mypath:
        ws_connect_for_join(message)
    elif 'start' in mypath:
        ws_connect_for_start(message)


@channel_session_user_from_http
def ws_connect_for_join(message):
    print 'now is connecting for join'
    print 'client is', message.user.username
    path = message.content['path']
    # hostname = path[1:-2]
    print 'path is: ', path
    fields = path.split('/')
    hostname =fields[-1]
    print 'hostname is', hostname

    message.reply_channel.send({"accept": "True"})

    # Add to the chat group
    room_name = hostname
    player_name = message.user.username
    print 'user is: ',message.user
    print 'player name: ', player_name
    print 'room name: ', room_name
    add_player(room_name, player_name)
    Group(hostname).add(message.reply_channel)

    # # response_text = serializers.serialize('json', Item.objects.all())
    userlist = []
    Group(hostname).send({
        "text": build_join_reply_msg(room_name)
    })
    print 'join finished'

# def ws_message(message):
#     Group("monopoly_room").send({
#         "text": "blah, blah, blah",
#     })

# @login_required
def ws_disconnect(message):
    Group('5').discard(message.reply_channel)


def ws_connect_for_start(message):
    print 'now is connecting for start'


def build_join_reply_msg(room_name):
    # todo profile
    players = rooms[room_name]
    print 'players: ', players
    data = []
    for player in players:
        print 'player is: ', player
        profile_user = User.objects.get(username=player)
        print 'profile user: ', profile_user.username
        data.append({"id":profile_user.id, "name":player})
        # profiles = Profile.objects.filter(user = profile_user)
        # # username = player
        # avatar = None
        # if len(profiles) == 0:
        #     print 'profile is None'
        #     avatar = None
        # else:
        #     for item in profile:
        #         avatar = profile.avatar

        # print 'profile_user: ', profile_user.username
        # profile = Profile.objects.get(user=profile_user)

        # print profile.user.user_name
        # print profile.user.id
        # print profile.avatar

    ret = {"action": "join",
                "data": data
                }
    print json.dumps(ret)
    return json.dumps(ret)


def add_player(room_name, player_name):
    if room_name not in rooms:
        rooms[room_name] = set()
        rooms[room_name].add(room_name)
    rooms[room_name].add(player_name)


