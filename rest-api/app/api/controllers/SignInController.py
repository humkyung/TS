from datetime import timedelta
from logging import PlaceHolder
import os
from flask import request, Blueprint, make_response
from flask.json import jsonify
from flask_restx import Namespace, Resource
from flask_restx.cors import crossdomain
import jwt

from ..models.RoleDTO import RoleDTO
from ..models.UserDTO import UserDTO, db
from ..models.ResponseDTO import ResponseDTO

# define name space
api = Namespace('SignIn', description='user related operations')

resource_fields = UserDTO.resource_fields
signin_service = Blueprint('api', __name__, url_prefix='')


@api.route('', methods=['GET', 'POST'])
class Users(Resource):
    @api.response(201, 'User confirmed.')
    @api.doc('validate user information')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def post(self):
        """Validate user information"""
        import bcrypt
        from app import app
        import uuid
        import datetime

        try:
            data = request.json
            uid = data['uid']
            password = data['password']

            user, role = db.session.query(UserDTO, RoleDTO).filter(UserDTO.Roles_UID==RoleDTO.UID).filter(UserDTO.UID==uid).first()
            if user and role and bcrypt.checkpw(password.encode('UTF-8'), user.Password.encode('UTF-8')):
                response = ResponseDTO()
                response.success = True
                response.code = 200
                response.msg = 'Success'

                payload = {
                    'uid': uid,
                    # 만료 기한 설정 : 1일
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=60*60*24)
                }
                token = jwt.encode(payload, app.config['JWT_SECRET_KEY'], 'HS256')
                response.data = token.decode('UTF-8')
            else:
                response = ResponseDTO()
                response.success = False
                response.code = 202
                response.msg = 'There is no user'
                response.data = None
        except Exception as ex:
            response = ResponseDTO()
            response.success = False
            response.code = 202
            response.msg = repr(ex)
            response.data = None

        return response