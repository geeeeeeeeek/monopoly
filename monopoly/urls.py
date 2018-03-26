from django.conf.urls import url
from django.contrib import admin
from socialnetwork import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    url(r'^register$', views.register, name='register'),
]