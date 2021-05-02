from app.api.controllers.UserController import User
from app.api.models.RoleDTO import RoleDTO
import os
from flask import request, Blueprint, make_response
from flask_restx import Namespace, Resource

from ..models.Database import db
from ..models.ResponseDTO import ResponseDTO
from ..models.BoardDTO import BoardDTO
from ..models.UserDTO import UserDTO

# define namespace
api = Namespace('Project', description='project related operations')

resource_fields = BoardDTO.resource_fields
project_service = Blueprint('api', __name__, url_prefix='/projects')


@api.route('/')
class ProjectList(Resource):
    @api.doc('list_of_registered_project')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def get(self):
        """List all registered projects"""

        res = ResponseDTO()
        try:
            res.success = True
            res.code = 200
            res.msg = 'Success' 
            res.data = []

            # 생성 날짜로 소팅
            projects = db.session.query(BoardDTO, UserDTO, RoleDTO).outerjoin(UserDTO, BoardDTO.Users_UID==UserDTO.UID).outerjoin(RoleDTO, UserDTO.Roles_UID==RoleDTO.UID).order_by(BoardDTO.CreatedAt.desc()).all()
            for project, user, role in projects:
                user.role = role.as_dict() if role else None
                project.user = user.as_dict() if user else None
                res.data.append(project.as_dict())
        except Exception as ex:
            res.success = False
            res.code = 202
            res.msg = repr(ex)
            res.data = None

        return res

    @api.response(201, 'Project successfully created.')
    @api.doc('create a new project')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def post(self):
        """Create a new project"""
        import jwt
        import uuid
        from app import app

        res = ResponseDTO()
        try:
            if 'x-auth-token' in request.headers:
                access_token = request.headers['x-auth-token']
                payload = jwt.decode(access_token, app.config['JWT_SECRET_KEY'], 'HS256')

                user_uid = payload['uid']

                project = BoardDTO()
                project.UID = str(uuid.uuid4())
                project.Title = request.form['title']
                project.Description = request.form['description']
                project.Progress = request.form['progress']
                project.Users_UID = user_uid

                db.session.add(project)
                db.session.commit()

                res.success = True
                res.code = 200
                res.msg = 'success'
                res.data = project.as_dict()
        except Exception as ex:
            res.success = False
            res.code = 202
            res.msg = repr(ex)
            res.data = None

        return res

@api.route('/<uid>')
@api.doc(params={'uid': 'The project identifier'})
class Project(Resource):
    @api.doc('Get a project with given uid')
    @api.marshal_with(ResponseDTO.resource_fields)
    def get(self, uid: str):
        """get a project given its identifier"""

        import uuid

        res = ResponseDTO()
        try:
            project = db.session.query(BoardDTO).filter(BoardDTO.UID==uid).first()
            if project:
                res.success = True
                res.code = 200
                res.msg = 'Success' 
                res.data = project.as_dict()
            else:
                res.success = False
                res.code = 204
                res.msg = 'There is no project' 
                res.data = None
        except Exception as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)

        return res

    @api.doc('Update a project with given uid')
    @api.marshal_with(ResponseDTO.resource_fields)
    def put(self, uid: str):
        """update a project given its identifier"""
        import uuid

        res = ResponseDTO()
        try:
            values = {
                'Title': request.form['title'], 'Description': request.form['description'], 
                'Progress': request.form['progress']
            }
            if 'picture' in request.form:
                values['Picture'] = request.form['picture'].encode('utf-8')

            db.session.query(BoardDTO).filter(BoardDTO.UID==uid).update(values)
            db.session.commit()

            res = self.get(uid)
        except Exception as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)

        return res

    @api.doc('Delete a project with given uid')
    @api.marshal_with(ResponseDTO.resource_fields)
    def delete(self, uid: str):
        """delete a project given its identifier"""

        res = ResponseDTO()
        try:
            project = BoardDTO.query.filter_by(UID=uid).first()
            if project:
                db.session.delete(project)
                db.session.commit()

                res.success = True
                res.code = 200
                res.msg = 'Success' 
                res.data = None
            else:
                res.success = False
                res.code = 204
                res.msg = 'There is no project' 
                res.data = None
        except Exception as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)

        return res