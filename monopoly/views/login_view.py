from django.shortcuts import render
from django.views import View


class LoginView(View):
    initial = {'active_page': 'register'}
    template_name = 'login_view.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name, {
            "active_page": "login",
            "error": None
        })

