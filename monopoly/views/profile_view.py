from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied
from django.http import Http404
from django.shortcuts import render
from django.template import Template, RequestContext
from django.views import View

from monopoly.forms.profile_form import ProfileForm
from monopoly.models import Profile


class ProfileView(View):
    initial = {'key': 'value'}
    template_name = 'profile_view.html'

    def get(self, request, *args, **kwargs):
        try:
            self.profile_user = User.objects.get(username=kwargs.get("profile_user"))
        except Exception:
            self.error = "User {id} not existed.".format(id=kwargs.get("profile_user"))
            self.profile_user = None
            return render(request, "404.html", {})


        try:
            self.profile_info = Profile.objects.get(user=self.profile_user)
        except Exception:
            self.profile_info = None

        res = {
            "user": self.profile_user,
            "profile": self.profile_info
        }
        return render(request, self.template_name, res)

    def post(self, request, *args, **kwargs):
        # Unauthorized modification
        try:
            self.profile_user = User.objects.get(username=kwargs.get("profile_user"))
        except Exception:
            self.error = "User {id} not existed.".format(id=kwargs.get("profile_user"))
            self.profile_user = None
            raise render(request, "404.html", {})

        try:
            self.profile_info = Profile.objects.get(user=self.profile_user)
        except Exception:
            self.profile_info = None

        if self.profile_user != request.user:
            raise PermissionDenied

        bio = request.POST.get("bio", None)
        avatar = request.FILES.get("avatar", None)

        if self.profile_info:
            self.profile_info.bio = bio
            if avatar:
                self.profile_info.avatar = avatar
            self.profile_info.save()
        else:
            self.profile_info = Profile(user=request.user, bio=bio, avatar=avatar)
            form = ProfileForm(request.POST, request.FILES, instance=self.profile_info)

            if form.is_valid():
                print "valid"
                self.profile_info.save()
            else:
                print form.errors

        res = {
            "user": self.profile_user,
            "profile": self.profile_info
        }
        return render(request, self.template_name, res)
