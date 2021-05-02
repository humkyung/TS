from flask import request, Blueprint
from flask_restx import Namespace, Resource

from ..models.Database import db
from ..models.TaskDTO import TaskDTO
from ..models.ResponseDTO import ResponseDTO
from ..models.UserDTO import UserDTO

# define name space
api = Namespace('Board', description='board related operations')

resource_fields = TaskDTO.resource_fields
post_service = Blueprint('api', __name__, url_prefix='/api/post')

model_parser = api.parser()
model_parser.add_argument('project_no', type=str, required=True)
model_parser.add_argument('name', type=str, required=True)

@api.route('/post/<uid>')
class Task(Resource):
    @api.doc('get post with given uid')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def get(self, uid: str):
        """get a post with given uid"""
        import uuid

        res = ResponseDTO()
        try:
            post, user = db.session.query(TaskDTO, UserDTO).filter(TaskDTO.Users_UID==UserDTO.UID).filter(TaskDTO.UID==uid).first()
            if post and user:
                post.user = user.as_dict()

                res.success = True
                res.code = 200
                res.msg = 'Success' 
                res.data = post.as_dict()
        except Exception as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)

        return res

    @api.response(201, 'Post successfully modified.')
    @api.doc('modify a post')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def put(self, uid: str):
        """modify a post"""
        import datetime

        res = ResponseDTO()
        try:
            values = {
                'Title': request.form['title'], 'Status': request.form['status'], 
                'StartDate': request.form['startDate'], 'DueDate': request.form['dueDate'], 
                'Priority': request.form['priority'], 'ModifiedAt': datetime.datetime.now()
            }
            if 'content' in request.form:
                values['Content'] = request.form['content']

            db.session.query(TaskDTO).filter(TaskDTO.UID==uid).update(values)
            db.session.commit()

            res = self.get(uid)
        except Exception as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)

        return res

    @api.response(201, 'Post successfully is deleted.')
    @api.doc('delete a post')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def delete(self, uid: str):
        """delete a post"""

        res = ResponseDTO()
        try:
            post = TaskDTO.query.filter_by(UID=uid).first()
            if post:
                db.session.delete(post)
                db.session.commit()

                res.success = True
                res.code = 200
                res.msg = 'Success' 
            else:
                res.success = False
                res.code = 204
                res.msg = 'There is no post'
        except Exception as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)

        return res
