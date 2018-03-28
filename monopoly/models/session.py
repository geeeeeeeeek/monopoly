from django.contrib.auth import login, authenticate
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.core.urlresolvers import reverse

# Used to send mail from within Django
from django.core.mail import send_mail

class Session:
    def __init__(self):
        pass

    def register(self, conf):
        error_message = "Error: "
        for (key, value) in conf.items():
            if key == "request": continue
            if not value or len(value) == 0:
                error_message += key + " can't be empty."
                return False, error_message

        if len(User.objects.filter(username=conf["username"])):
            error_message += "the username isn't available. Please try another."
            return False, error_message

        request = conf["request"]

        user = User.objects.create_user(
            username=conf["username"],
            first_name=conf["firstname"],
            last_name=conf["lastname"],
            password=conf["password"],
            email=conf["email"]
        )

        user.is_active = False
        user.save()

        # Generate a one-time use token and an email message body
        token = default_token_generator.make_token(user)

        email_body = """
        Please click the link below to verify your email address and
        complete the registration of your account:
        http://{host}{path}
        """.format(host=request.get_host(),
                path=reverse('confirm', args=(user.username, token)))

        send_mail(subject="Verify your email address",
                message= email_body,
                from_email="ztong@andrew.cmu.edu",
                recipient_list=[user.email])

        return True, None