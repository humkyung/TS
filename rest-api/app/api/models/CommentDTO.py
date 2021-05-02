import datetime
from flask_restx import Namespace, fields

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Index, Integer, String, Table, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import Date, NullType
from ..models.Database import db
from ..models.UserDTO import UserDTO

api = Namespace('comment', description='comment related operations')


class CommentDTO(db.Model):
    __tablename__ = 'Comments'

    UID = db.Column(Integer, primary_key=True)
    Tasks_UID = db.Column(String(100), ForeignKey('Tasks.UID'))
    Users_UID = db.Column(String(100), ForeignKey('Users.UID'))
    Content = db.Column(Text)
    CreatedAt = db.Column(DateTime, default=datetime.datetime.utcnow)

    resource_fields = api.model('comment', {
        'uid': fields.String(required=True, description='comment uid'),
        'content': fields.String(description='comment content'),
        'user': fields.Nested(UserDTO.resource_fields),
        'createdAt': fields.DateTime(description='created date')
     })

    def __init__(self):
        self.UID = None
        self.Title = None
        self.Content = None
        self.Tasks_UID = None
        self.Users_UID = None
        self.CreatedAt = datetime.datetime.now()

    def as_dict(self):
        obj_d = {
            'uid': self.UID,
            'content': self.Content,
            'user': self.user if hasattr(self, 'user') else None,
            'createdAt': self.CreatedAt.strftime('%Y-%m-%d %H:%M:%S')
        }

        return obj_d
