from django.shortcuts import render, get_object_or_404
from django.views import View
from django.http import HttpResponse, Http404
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied

from monopoly.models import Profile


class PhotoView(View):

    def get(self, request, *args, **kwargs):
        item = get_object_or_404(Profile, user=User.objects.get(username=kwargs.get("username")))

        # Probably don't need this check as form validation requires a picture be uploaded.
        if not item.avatar:
            raise Http404

        return HttpResponse(item.avatar)

