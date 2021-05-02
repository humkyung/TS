from flask_restx import Namespace, fields

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Index, Integer, String, Table, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import Date, NullType
from ..models.Database import db
from ..models.UserDTO import UserDTO

api = Namespace('task', description='task related operations')


class TaskDTO(db.Model):
    __tablename__ = 'Tasks'

    UID = db.Column(String(100), primary_key=True)
    Title = db.Column(String(256), nullable=False)
    Author = db.Column(String(100), nullable=False)
    Content = db.Column(Text)
    CreatedAt = db.Column(DateTime)
    ModifiedAt = db.Column(DateTime)
    Boards_UID = db.Column(String(100), ForeignKey('Boards.UID'))
    Users_UID = db.Column(String(100), ForeignKey('Users.UID'), nullable=False)
    Status = db.Column(String(100))
    StartDate = db.Column(DateTime)
    DueDate = db.Column(DateTime)
    Priority = db.Column(Integer, default=1)

    resource_fields = api.model('post', {
        'uid': fields.String(required=True, description='post uid'),
        'title': fields.String(required=True, description='post title'),
        'author': fields.String(required=True),
        'content': fields.String(description='post content'),
        'createdAt': fields.DateTime(),
        'modifiedAt': fields.DateTime(),
        'user': fields.Nested(UserDTO.resource_fields),
        'status': fields.String(required=True),
        'startDate': fields.DateTime(),
        'dueDate': fields.DateTime(),
        'priority': fields.Integer(description='task priority')
     })

    def __init__(self):
        import datetime

        self.UID = None
        self.Title = None
        self.Author = None
        self.Content = None
        self.CreatedAt = datetime.datetime.now()
        self.ModifiedAt = None
        self.Users_UID = None
        self.Status = None
        self.StartDate = None
        self.DueDate = None
        self.Priority = 1

    def as_dict(self):
        obj_d = {
            'uid': self.UID,
            'title': self.Title,
            'author': self.Author,
            'content': self.Content,
            'createdAt': self.CreatedAt.strftime('%Y-%m-%d %H:%M:%S'),
            'modifiedAt': self.ModifiedAt.strftime('%Y-%m-%d %H:%M:%S') if self.ModifiedAt else None,
            'user': self.user,
            'status': self.Status,
            'startDate': self.StartDate.strftime('%Y-%m-%d %H:%M:%S') if self.StartDate else None,
            'dueDate': self.DueDate.strftime('%Y-%m-%d %H:%M:%S') if self.DueDate else None,
            'priority': self.Priority
        }

        return obj_d
