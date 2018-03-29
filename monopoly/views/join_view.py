from django.shortcuts import render
from django.views import View

from monopoly.models import Profile


class JoinView(View):
    template_name = 'join_view.html'

    def get(self, request, *args, **kwargs):
        print request.path
        user = request.user
        host_name = kwargs.get('host_name', user.username)

        try:
            profile = Profile.objects.get(user=user)
        except Exception:
            profile = None

        return render(request, self.template_name, {
            "user": {
                "name": user.username,
                "avatar": profile.avatar.url if profile else ""
            },
            "host_name": host_name if len(host_name) else user.username
        })
