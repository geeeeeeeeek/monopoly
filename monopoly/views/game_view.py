from django.shortcuts import render
from django.views import View


class GameView(View):
    template_name = 'game_view.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name, {
            "username": request.user.username,
            "hostname": kwargs.get("host_name")
        })
