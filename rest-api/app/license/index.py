# file name : index.py
# pwd : /project_name/app/license/index.py

from flask import Blueprint, request, render_template, flash, redirect, url_for
from flask_wtf import FlaskForm
from wtforms import *
from wtforms.validators import *
from flask import current_app as app

license_service = Blueprint('license', __name__, url_prefix='/license')


class LicenseForm(FlaskForm):
    csrf_token = 'id2 web service'
    authorization = PasswordField('Authorization :')
    computer_name = StringField('Computer Name :')
    submit = SubmitField('Submit')

    @staticmethod
    def generate_license_key(pw: str, clear: str) -> str:
        import base64

        key = 'Image Drawing to Intelligent Drawing'

        if pw != 'admin':
            return 'Invalid Authorization'

        enc = []
        for i in range(len(clear)):
            key_c = key[i % len(key)]
            enc_c = (ord(clear[i]) + ord(key_c)) % 256
            enc.append(enc_c)

        new_key = base64.urlsafe_b64encode(bytes(enc))

        return new_key.decode('utf-8')


@license_service.route('/', methods=['GET', 'POST'])
def index():
    authorization = None
    computer_name = None
    code = None

    form = LicenseForm()
    if form.validate_on_submit():
        authorization = form.authorization.data
        computer_name = form.computer_name.data
        code = LicenseForm.generate_license_key(authorization, computer_name)
        form.authorization.data = ''
        form.computer_name.data = ''

    return render_template("/license/index.html", form=form, authorization=authorization, computer_name=computer_name,
                           code=code)

