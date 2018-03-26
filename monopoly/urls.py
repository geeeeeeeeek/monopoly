from django.conf.urls import url

from monopoly.views.login_view import LoginView

urlpatterns = [
    url(r'^login', LoginView.as_view(), name='login'),
]
