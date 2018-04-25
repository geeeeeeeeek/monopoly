from django.forms import ModelForm, ValidationError, FileField

from monopoly.models.profile import Profile

MAX_UPLOAD_SIZE = 2500000

class ProfileForm(ModelForm):
    # avatar = FileField(required=False)

    class Meta:
        model = Profile
        fields = ["bio", "avatar"]

    def clean_avatar(self):
        picture = self.cleaned_data['avatar']

        if not picture:
            return picture
        if not picture or not hasattr(picture, 'content_type'):
            raise ValidationError('You must upload a picture')
        if picture.content_type and not picture.content_type.startswith('image'):
            raise ValidationError('File type is not image')
        if picture.size > MAX_UPLOAD_SIZE:
            raise ValidationError('File too big (max size is {0} bytes)'.format(MAX_UPLOAD_SIZE))
        return picture



