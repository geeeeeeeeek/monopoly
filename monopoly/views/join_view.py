from django.shortcuts import render
from django.views import View


class JoinView(View):
    initial = {
        "invitation_url": "http://monopo.ly/room/ztong",
        "waiting": True,
        "is_host": True
    }
    template_name = 'join_view.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name, self.initial)
