from django.shortcuts import render
from django.views import View


class LoginView(View):
    initial = {'key': 'value'}
    template_name = 'login_view.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name, {})
