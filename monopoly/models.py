# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

# We will use the default User model and this Profile model for user info
class Profile(models.Model):
    picture       = models.FileField(upload_to="images", blank=True)
    nickname      = models.CharField(blank=False, max_length=100)
    country       = models.CharField(blank=True, max_length=50)