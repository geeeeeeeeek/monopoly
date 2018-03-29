# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.views import View
from django.shortcuts import render

from monopoly.models.session import Session


# @csrf_protect
class RegisterView(View):
    initial = {'active_page': 'register'}
    template_name = 'login_view.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name, self.initial)

    def post(self, request, *args, **kwargs):
        conf = {
            "request": request,
            "username": request.POST.get("username", None),
            "firstname": request.POST.get("firstname", None),
            "lastname": request.POST.get("lastname", None),
            "password": request.POST.get("password", None),
            "email": request.POST.get("email", None)
        }
        successful, auth_or_error = Session().register(conf)

        if successful:
            res = {'active_page': 'register',
                   "error": "Confirmation sent to your email."}
            return render(request, self.template_name, res)
        else:
            res = {'active_page': 'register',
                   "error": auth_or_error}
            return render(request, self.template_name, res)
