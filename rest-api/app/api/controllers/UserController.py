from app.api.models.RoleDTO import RoleDTO
from datetime import datetime
import os
from os import access
from flask import request, Blueprint, make_response
from flask_restx import Namespace, Resource, marshal
from flask_restx.cors import crossdomain
import jwt

from ..models.Database import db
from ..models.UserDTO import UserDTO
from ..models.ResponseDTO import ResponseDTO

# define name space
api = Namespace('User', description='user related operations')

resource_fields = UserDTO.resource_fields
user_service = Blueprint('api', __name__, url_prefix='/api/user')


@api.route('/all', methods=['GET', 'PUT'])
class Users(Resource):
    @api.doc('get all users')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def get(self):
        """return all users information"""
        from app import app

        res = ResponseDTO()
        res.data = []
        try:
            if 'x-auth-token' in request.headers:
                access_token = request.headers['x-auth-token']
                payload = jwt.decode(access_token, app.config['JWT_SECRET_KEY'], 'HS256')

                res.success = True
                res.code = 200
                res.msg = 'Success' 

                users = db.session.query(UserDTO, RoleDTO).filter(UserDTO.Roles_UID==RoleDTO.UID).all()
                for user, role in users:
                    user.role = role.as_dict()
                    res.data.append(user.as_dict())
            else:
                res.success = True 
                res.code = 204
                res.msg = 'Fail' 
                res.data = None
        except jwt.InvalidTokenError as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)
            res.data = None
        except Exception as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)
            res.data = None

        return res

    @api.doc('upate all user information')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def put(self):
        """update all user information"""
        from app import app
        from sqlalchemy import update

        res = ResponseDTO()
        try:
            if 'x-auth-token' in request.headers:
                access_token = request.headers['x-auth-token']
                payload = jwt.decode(access_token, app.config['JWT_SECRET_KEY'], 'HS256')

                items = self.get_list(('users', 'roles'))

                # add members to board
                for user, role in items:
                    role_ = RoleDTO.query.filter_by(Role=role).first()
                    values = {'Roles_UID': role_.UID}
                    db.session.query(UserDTO).filter(UserDTO.UID==user).update(values)

                db.session.commit()

                res.success = True
                res.code = 200
                res.msg = 'Success' 
                res.data = None
            else:
                res.success = True 
                res.code = 204
                res.msg = 'Fail' 
                res.data = None
        except jwt.InvalidTokenError as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)
            res.data = None
        except Exception as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)
            res.data = None

        return res

    def get_list(self, headers):
        items = []

        values = [request.form.getlist(h) for h in headers]
        for uid, role in zip(values[0][0].split(','), values[1][0].split(',')):
            items.append((uid, role))

        return items

@api.route('', methods=['GET', 'PUT', 'POST', 'DELETE'])
class User(Resource):
    @api.doc('get a user')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def get(self):
        """return user information"""
        from app import app

        res = ResponseDTO()
        try:
            if 'x-auth-token' in request.headers:
                access_token = request.headers['x-auth-token']
                payload = jwt.decode(access_token, app.config['JWT_SECRET_KEY'], 'HS256')

                uid = payload['uid']

                user, role = db.session.query(UserDTO, RoleDTO).filter(UserDTO.Roles_UID==RoleDTO.UID).filter(UserDTO.UID==uid).first()
                if user and role:
                    res.success = True
                    res.code = 200
                    res.msg = 'Success' 
                    user.role = role.as_dict()
                    res.data = user.as_dict()
            else:
                res.success = True 
                res.code = 204
                res.msg = 'Fail' 
                res.data = None
        except jwt.InvalidTokenError as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)
            res.data = None
        except Exception as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)
            res.data = None

        return res

    @api.doc('upate user information')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def put(self):
        """update user information"""
        from app import app
        from sqlalchemy import update

        res = ResponseDTO()
        try:
            if 'x-auth-token' in request.headers:
                access_token = request.headers['x-auth-token']
                payload = jwt.decode(access_token, app.config['JWT_SECRET_KEY'], 'HS256')

                uid = payload['uid']
                affected = db.session.query(UserDTO).filter(UserDTO.UID==uid).update(
                    {
                        'Name': request.form['name'], 'ImageUrl': request.form['imageUrl'],
                        'ModifiedAt': datetime.now()
                    }
                )
                db.session.commit()

                res.success = True
                res.code = 200
                res.msg = 'Success' 
                user = db.session.query(UserDTO).filter_by(UID=uid).first()
                res.data = user.as_dict()
            else:
                res.success = True 
                res.code = 204
                res.msg = 'Fail' 
                res.data = None
        except jwt.InvalidTokenError as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)
            res.data = None
        except Exception as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)
            res.data = None

        return res

    @api.doc('delete user')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def delete(self):
        """delete user"""
        from app import app
        from sqlalchemy import update

        res = ResponseDTO()
        try:
            if 'x-auth-token' in request.headers:
                access_token = request.headers['x-auth-token']
                payload = jwt.decode(access_token, app.config['JWT_SECRET_KEY'], 'HS256')

                uid = payload['uid']
                user = UserDTO.query.filter_by(UID=uid).first()
                if user:
                    db.session.delete(user)
                    db.session.commit()

                    res.success = True
                    res.code = 200
                    res.msg = 'Success' 
                    res.data = None
                else:
                    res.success = False
                    res.code = 204
                    res.msg = 'There is no user'
            else:
                res.success = True 
                res.code = 204
                res.msg = 'Fail' 
                res.data = None
        except jwt.InvalidTokenError as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)
            res.data = None
        except Exception as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)
            res.data = None

        return res

@api.route('/role', methods=['PUT'])
class UserRole(Resource):
    @api.doc('upate user information')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def put(self):
        """update user information"""
        from app import app
        from sqlalchemy import update

        res = ResponseDTO()
        try:
            if 'x-auth-token' in request.headers:
                access_token = request.headers['x-auth-token']
                payload = jwt.decode(access_token, app.config['JWT_SECRET_KEY'], 'HS256')

                uid = request.form['user']
                role = request.form['role']

                role_ = RoleDTO.query.filter_by(Role=role).first()
                values = {'Roles_UID': role_.UID}

                db.session.query(UserDTO).filter(UserDTO.UID==uid).update(values)
                db.session.commit()

                res.success = True
                res.code = 200
                res.msg = 'Success' 
                res.data = None
            else:
                res.success = True 
                res.code = 204
                res.msg = 'Fail' 
                res.data = None
        except jwt.InvalidTokenError as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)
            res.data = None
        except Exception as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)
            res.data = None

        return res