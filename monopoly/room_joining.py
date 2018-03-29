from channels import Group


# Connected to websocket.connect
def ws_add(message):
    # Accept the connection
    print 'ws_add invoked'
    message.reply_channel.send({"accept": True})

    # Add to the chat group
    Group("todolist").add(message.reply_channel)

    # response_text = serializers.serialize('json', Item.objects.all())
    message.reply_channel.send({
        "text": "mock_for_avatar_url",
        "msg": "2333"
    })

    Group('todolist').send({
        'text': "Test for sending to all user",
        "msg": "2333"
    })


# Could be connected to websocket.receive
# def ws_message(message):
#     Group("todolist").send({
#         "text": "blah, blah, blah",
#     })

# Connected to websocket.disconnect
def ws_disconnect(message):
    Group("todolist").discard(message.reply_channel)
