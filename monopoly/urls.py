from django.conf.urls import url

from monopoly.views.login_view import LoginView
from monopoly.views.register_view import RegisterView
from monopoly.views.profile_view import ProfileView
from monopoly.views.join_view import JoinView
from monopoly.views.game_view import GameView
from monopoly.views.register_confirm_view import ConfirmRegistrationView

urlpatterns = [
    url(r'^$', GameView.as_view(), name='game'),
    url(r'^login', LoginView.as_view(), name='login'),
    url(r'^profile', ProfileView.as_view(), name='profile'),
    url(r'^join', JoinView.as_view(), name="join"),
    url(r'^register', RegisterView.as_view(), name='register'),
    url(r'^confirm-registration/(?P<username>[a-zA-Z0-9]+)/(?P<token>[a-z0-9\-]+)$',
        ConfirmRegistrationView.as_view(), name='confirm'),
]