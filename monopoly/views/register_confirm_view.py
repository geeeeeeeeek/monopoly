# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import redirect, get_object_or_404
from django.http import HttpResponse
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.views import View
from django.shortcuts import render

# @transaction.atomic
class ConfirmRegistrationView(View):
    initial = {'key': 'value'}
    template_name = 'login_view.html'

    def get(self, request, *args, **kwargs):
        user = get_object_or_404(User, username=kwargs.get('username'))
        # Send 404 error if token is invalid
        if not default_token_generator.check_token(user, kwargs.get('token')):
            res = {'active_page': 'register',
                   "error": "Invalid token."}
            return render(request, self.template_name, res)

        # Otherwise token was valid, activate the user.
        user.is_active = True
        user.save()
        login(request, user)

        return redirect("/monopoly/join")