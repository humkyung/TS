from app.api.models.RoleDTO import RoleDTO
import os
from flask import request, Blueprint, make_response
from flask_restx import Namespace, Resource
from flask_restx.cors import crossdomain

from ..models.UserDTO import UserDTO
from ..models.ResponseDTO import ResponseDTO

from .AppDatabase import AppDatabase, DBType

# define name space
api = Namespace('SignUp', description='user related operations')

signup_service = Blueprint('api', __name__, url_prefix='')


@api.route('', methods=['GET', 'POST'])
class SignUpController(Resource):
    @api.doc('register a new user')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def post(self):
        import bcrypt
        from ..models.UserDTO import UserDTO, db

        res = ResponseDTO()
        try:
            id = request.form['id']
            password = request.form['password']
            # 비밀번호 암호화
            password = bcrypt.hashpw(password.encode('UTF-8'), bcrypt.gensalt())
            name = request.form['name']

            users = db.session.query(UserDTO).all()
            if users:
                # 일반 사용자로 등록
                user = UserDTO(id, name, password, Roles_UID=2)
                user.ImageUrl = request.form['imageUrl'] if 'imageUrl' in request.form else None
                db.session.add(user)
                db.session.commit()
            else:
                # 시스템 관리자로 등록
                user = UserDTO(id, name, password, Roles_UID=1)
                user.ImageUrl = request.form['imageUrl'] if 'imageUrl' in request.form else None
                db.session.add(user)
                db.session.commit()

            res.success = True
            res.code = 200
            res.msg = 'success'
            res.data = user.as_dict()
        except Exception as ex:
            res.success = False
            res.code = 202
            res.msg = repr(ex)
            res.data = None

        return res