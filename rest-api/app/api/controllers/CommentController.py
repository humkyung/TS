from flask import request, Blueprint
from flask_restx import Namespace, Resource

from ..models.Database import db
from ..models.CommentDTO import CommentDTO
from ..models.ResponseDTO import ResponseDTO
from ..models.UserDTO import UserDTO

# define name space
api = Namespace('Comment', description='comment related operations')

resource_fields = CommentDTO.resource_fields
post_service = Blueprint('api', __name__, url_prefix='/api/comment')

@api.route('/<task_uid>')
class Comments(Resource):
    @api.doc('get comments with given task uid')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def get(self, task_uid: str):
        """get all comments with given task uid"""

        res = ResponseDTO()
        res.data = []
        try:
            res.success = True
            res.code = 200
            res.msg = 'Success' 

            comments = db.session.query(CommentDTO, UserDTO).filter(CommentDTO.Users_UID==UserDTO.UID).filter(CommentDTO.Tasks_UID==task_uid).all()
            for comment, user in comments:
                comment.user = user.as_dict()
                res.data.append(comment.as_dict())
        except Exception as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)

        return res

    @api.response(201, 'Comment successfully created.')
    @api.doc('create a new comment')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def post(self, task_uid: str):
        """Create a new comment"""
        import jwt
        import uuid
        from app import app

        res = ResponseDTO()
        try:
            if 'x-auth-token' in request.headers:
                access_token = request.headers['x-auth-token']
                payload = jwt.decode(access_token, app.config['JWT_SECRET_KEY'], 'HS256')

                user_uid = payload['uid']

                comment = CommentDTO()
                comment.Tasks_UID=task_uid
                comment.Users_UID=user_uid
                comment.Content = request.form['content']

                db.session.add(comment)
                db.session.commit()

                res.success = True
                res.code = 200
                res.msg = 'success'
                user = db.session.query(UserDTO).filter_by(UID=user_uid).first()
                comment.user = user.as_dict()
                res.data = comment.as_dict()
        except Exception as ex:
            res.success = False
            res.code = 202
            res.msg = repr(ex)
            res.data = None

        return res

@api.route('/<uid>')
class Comment(Resource):
    @api.response(201, 'Delete a comment.')
    @api.doc('delete a comment')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def delete(self, uid: int):
        """Delete a comment"""
        import jwt
        import uuid
        from app import app

        res = ResponseDTO()
        try:
            if 'x-auth-token' in request.headers:
                access_token = request.headers['x-auth-token']
                payload = jwt.decode(access_token, app.config['JWT_SECRET_KEY'], 'HS256')

                user_uid = payload['uid']

                comment, user = db.session.query(CommentDTO, UserDTO).filter(CommentDTO.UID==uid).filter(CommentDTO.Users_UID==user_uid).first()
                if comment and user:
                    db.session.delete(comment)
                    db.session.commit()

                    res.success = True
                    res.code = 200
                    res.msg = 'success'
                    res.data = None
                else:
                    res.success = False
                    res.code = 202
                    res.msg = 'There is no comment'
                    res.data = None
        except Exception as ex:
            res.success = False
            res.code = 202
            res.msg = repr(ex)
            res.data = None

        return res