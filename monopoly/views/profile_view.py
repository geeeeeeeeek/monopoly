from django.shortcuts import render
from django.views import View
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied

from monopoly.models import Profile
from monopoly.forms.profile_form import ProfileForm


class ProfileView(View):
    initial = {'key': 'value'}
    template_name = 'profile_view.html'

    def get(self, request, *args, **kwargs):
        try:
            self.profile_user = User.objects.get(username=kwargs.get("profile_user"))
        except Exception:
            self.error = "User {id} not existed.".format(id=kwargs.get("profile_user"))
            self.profile_user = None

        try:
            self.profile_info = Profile.objects.get(user=self.profile_user)
        except Exception:
            self.profile_info = None

        res = {"profile": {
            "user": self.profile_user,
            "info": self.profile_info
        }}
        return render(request, self.template_name, res)

    def post(self, request, *args, **kwargs):
        # Unauthorized modification
        try:
            self.profile_user = User.objects.get(username=kwargs.get("profile_user"))
        except Exception:
            self.error = "User {id} not existed.".format(id=kwargs.get("profile_user"))
            self.profile_user = None

        try:
            self.profile_info = Profile.objects.get(user=self.profile_user)
        except Exception:
            self.profile_info = None

        if self.profile_user != request.user:
            raise PermissionDenied

        bio = request.POST.get("bio", None)
        avatar = request.FILES.get("avatar", None)

        if self.profile_info:
            if bio: self.profile_info.bio = bio
            if avatar: self.profile_info.avatar = avatar

        else:
            self.profile_info = Profile(user=request.user, bio=bio, avatar=avatar)

        form = ProfileForm(request.POST, request.FILES, instance=self.profile_info)

        if form.is_valid():
            print "valid"
            # form.save()
            self.profile_info.save()
        else:
            print form.errors
            self.errors = str(form.errors)

        res = {"profile": {
            "user": self.profile_user,
            "info": self.profile_info
        }}
        return render(request, self.template_name, res)

        #     return template.render({
        #         "active_page": "profile",
        #         "meta": {
        #             "user": self.request.user,
        #             "info": self.info
        #         },
        #         "profile": {
        #             "user": self.profile_user,
        #             "info": self.profile_info
        #         },
        #         "has_followed": self.has_followed,
        #         "followers": self.followers,
        #         "new_follower": self.profile_user
        #     }, request=self.request)
        # res = {'active_page': 'register',
        #                    "error": "Invalid token."}
        #             return render(request, self.template_name, res)
