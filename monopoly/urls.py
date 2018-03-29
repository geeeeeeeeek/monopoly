from django.conf.urls import url
from django.contrib.auth.decorators import login_required
from django.contrib.auth import views as auth_views

from monopoly.views.login_view import LoginView
from monopoly.views.register_view import RegisterView
from monopoly.views.profile_view import ProfileView
from monopoly.views.join_view import JoinView
from monopoly.views.game_view import GameView
from monopoly.views.register_confirm_view import ConfirmRegistrationView
from monopoly.views.photo_view import PhotoView

urlpatterns = [
    url(r'^$', login_required(GameView.as_view()), name='game'),
    url(r'^logout$', auth_views.logout_then_login, name='logout'),
    url(r'^login', LoginView.as_view(), name='login'),
    url(r'^profile/(?P<profile_user>[a-zA-Z0-9]+)$', login_required(ProfileView.as_view()), name='profile'),
    url(r'^join', login_required(JoinView.as_view()), name="join"),
    url(r'^register', RegisterView.as_view(), name='register'),
    url(r'^photo/(?P<username>[a-zA-Z0-9]+)$', login_required(PhotoView.as_view()), name='photo'),
    url(r'^confirm-registration/(?P<username>[a-zA-Z0-9]+)/(?P<token>[a-z0-9\-]+)$',
        ConfirmRegistrationView.as_view(), name='confirm'),
]