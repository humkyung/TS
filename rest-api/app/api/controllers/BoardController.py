import re
from flask import request, Blueprint
from flask_restx import Namespace, Resource

from ..models.Database import db
from sqlalchemy import and_

from ..models.TaskDTO import TaskDTO
from ..models.ResponseDTO import ResponseDTO
from ..models.UserDTO import UserDTO

# define name space
api = Namespace('Board', description='board related operations')

resource_fields = TaskDTO.resource_fields
board_service = Blueprint('api', __name__, url_prefix='/board')

@api.route('/<board_uid>/posts')
class BoardList(Resource):
    @api.doc('list_of_registered_post')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def get(self, board_uid: str):
        """List all registered post"""
        import uuid

        try:
            res = ResponseDTO()
            res.success = True
            res.code = 200
            res.msg = 'Success' 
            res.data = []

            # 생성 날짜로 소팅
            posts = db.session.query(TaskDTO, UserDTO).filter(and_(TaskDTO.Boards_UID==board_uid, TaskDTO.Users_UID==UserDTO.UID)).order_by(TaskDTO.CreatedAt.desc())
            for post, user in posts:
                post.Content = None
                post.user = user.as_dict()
                res.data.append(post.as_dict())
        except Exception as ex:
            res = ResponseDTO()
            res.success = False
            res.code = 202
            res.msg = repr(ex)
            res.data = None

        return res

@api.route('/<board_uid>/post')
class Board(Resource):
    @api.response(201, 'post successfully created.')
    @api.doc('create a new post')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def post(self, board_uid: str):
        """Creates a new post"""
        import uuid

        res = ResponseDTO()
        try:
            post = TaskDTO()
            post.UID = str(uuid.uuid4())
            post.Author = request.form['author']
            post.Title = request.form['title']
            post.Content = request.form['content']
            post.StartDate = request.form['startDate']
            post.DueDate = request.form['dueDate']
            post.Status = request.form['status']
            post.Priority = request.form['priority']
            post.Boards_UID = board_uid
            user = db.session.query(UserDTO).filter_by(UID=post.Author).first()
            post.Users_UID = user.UID if user else None

            db.session.add(post)
            db.session.commit()

            res.success = True
            res.code = 200
            res.msg = 'success'
            post.user = user.as_dict()
            res.data = post.as_dict()
        except Exception as ex:
            res.success = False
            res.code = 202
            res.msg = repr(ex)
            res.data = None

        return res