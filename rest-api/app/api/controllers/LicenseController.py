# file name : license_controller.py

from flask import Flask, request, Blueprint
from flask_restx import Api, Namespace, fields, marshal_with, Resource, reqparse

from ..models.Database import db
from ..models.ResponseDTO import ResponseDTO
from ..models.LicenseDTO import LicenseDTO

# define namespace
api = Namespace('License', description='license related operations')

@api.route('')
class Licenses(Resource):
    @api.doc('get all licenses')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def get(self):
        """return all license information"""
        from app import app

        res = ResponseDTO()
        res.data = []
        try:
            res.success = True
            res.code = 200
            res.msg = 'Success' 

            licenses = LicenseDTO.query.all()
            for license in licenses:
                res.data.append(license.as_dict())
        except Exception as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)
            res.data = None

        return res

    @api.doc('generate license key')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def post(self):
        """generate a license key"""
        import bcrypt
        import jwt
        import datetime
        from app import app

        res = ResponseDTO()
        try:
            mac = request.form['mac']
            api = request.form['api']
            email = request.form['email']
            dates = int(request.form['expiration date'])
            app_name = request.form['app']

            payload = {
                'mac': mac,
                'api': api,
                'email': email,
                'app': app_name,
                # 만료 기한 설정
                'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=60*60*24*dates)
            }
            token = jwt.encode(payload, app.config['JWT_SECRET_KEY'], 'HS256')

            """insert license to database"""
            license = LicenseDTO()
            license.Mac = mac
            license.Email = email
            license.App = app_name
            license.Code = token.decode('UTF-8')
            db.session.add(license)
            db.session.commit()

            res.success = True
            res.code = 200
            res.msg = str(res.success)
            res.data = license.Code
        except Exception as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)

        return res

@api.route('/<uid>')
class License(Resource):
    @api.doc('delete license')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def delete(self, uid: int):
        """delete license"""
        from app import app
        from sqlalchemy import update

        res = ResponseDTO()
        try:
            license = LicenseDTO.query.filter_by(UID=uid).first()
            if license:
                db.session.delete(license)
                db.session.commit()

                res.success = True
                res.code = 200
                res.msg = 'Success' 
                res.data = None
            else:
                res.success = False
                res.code = 204
                res.msg = 'There is no license'
        except Exception as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)
            res.data = None

        return res

@api.route('/valid', methods=['GET'])
class Available(Resource):
    @api.doc('check license is available')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def get(self):
        """return if license is available"""
        from app import app
        import jwt

        res = ResponseDTO()
        res.data = []
        try:
            if 'x-auth-token' in request.headers:
                access_token = request.headers['x-auth-token']
                payload = jwt.decode(access_token, app.config['JWT_SECRET_KEY'], 'HS256')

                res.success = True
                res.code = 200
                res.msg = 'Success' 
                res.data = None
            else:
                res.success = False
                res.code = 204
                res.msg = 'Fail' 
                res.data = None
        except jwt.InvalidTokenError as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)
            res.data = None
        except jwt.ExpiredSignatureError as ex:
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