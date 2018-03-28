from django.conf.urls import url

from monopoly.views.login_view import LoginView
from monopoly.views.profile_view import ProfileView
from monopoly.views.join_view import JoinView

urlpatterns = [
    url(r'^login', LoginView.as_view(), name='login'),
    url(r'^profile', ProfileView.as_view(), name='profile'),
    url(r'^join', JoinView.as_view(), name="join")
]
