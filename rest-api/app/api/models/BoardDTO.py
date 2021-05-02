import datetime

from flask_restx import Namespace, fields
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Index, Integer, String, Table, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import BLOB, LargeBinary, NullType
from ..models.Database import db
from ..models.UserDTO import UserDTO

api = Namespace('board', description='board related operations')


class ProjectUnitDTO:
    resource_fields = api.model('project_unit', {
        'uid': fields.String(required=True, description='project unit uid'),
        'name': fields.String(required=True, description='project unit name')
     })

    def __init__(self):
        self.uid = None
        self.name = None

    def as_dict(self):
        obj_d = {
            'uid': self.uid,
            'name': self.name,
        }

        return obj_d


class ProjectStatusDTO:
    resource_fields = api.model('status', {
        'uid': fields.String(required=True, description='project uid'),
        'name': fields.String(required=True, description='project status name')
     })

    def __init__(self):
        self.uid = None
        self.name = None

    def as_dict(self):
        obj_d = {
            'uid': self.uid,
            'name': self.name,
        }

        return obj_d

# Project Model
class BoardDTO(db.Model):
    __tablename__ = 'Boards'

    UID = db.Column(String(100), primary_key=True)
    Title = db.Column(String(256), nullable=False)
    Description = db.Column(Text, default=0)
    Picture = db.Column(LargeBinary)
    Progress = db.Column(Integer)
    CreatedAt = db.Column(DateTime, default=datetime.datetime.utcnow)
    Users_UID = db.Column(String(100))

    resource_fields = api.model('project', {
        'uid': fields.String(required=True, description='project uid'),
        'title': fields.String(required=True, description='project name'),
        'description': fields.String(description='project description'),
        'picture': fields.String(description='project thumbnail'),
        'progress': fields.Integer(description='project priority'),
        'createdAt':fields.DateTime(description='project creation time'),
        'user': fields.Nested(UserDTO.resource_fields),
    })

    def __init__(self):
        self.UID = None
        self.Title = None
        self.Description = None
        self.Picture = None
        self.Progress = 0
        self.CreatedAt = None
        self.Users_UID = None
        self.user = None

    def as_dict(self):
        obj_d = {
            'uid': self.UID,
            'title': self.Title,
            'description': self.Description,
            'picture': self.Picture.decode('utf-8') if self.Picture else None,
            'progress': self.Progress,
            'createdAt': self.CreatedAt.strftime('%Y-%m-%d %H:%M:%S'),
            'user': self.user if hasattr(self, 'user') else None
        }

        return obj_d
