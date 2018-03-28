from django.shortcuts import render
from django.views import View


class GameView(View):
    initial = {'key': 'value'}
    template_name = 'game_view.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name, {})
