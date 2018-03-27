from django.conf.urls import url

from monopoly.views.login_view import LoginView
from monopoly.views.profile_view import ProfileView

urlpatterns = [
    url(r'^login', LoginView.as_view(), name='login'),
    url(r'^profile', ProfileView.as_view(), name='profile')
]
