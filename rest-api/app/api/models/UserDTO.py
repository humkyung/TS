from flask_restx import Namespace, fields
from flask_restx.fields import DateTime

from .Database import db
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Index, Integer, String, Table, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import NullType
from ..models.RoleDTO import RoleDTO

api = Namespace('user', description='user related operations')


class UserDTO(db.Model):
    __tablename__ = 'Users'

    UID = db.Column(String(100), primary_key=True)
    Name = db.Column(String(100), nullable=False)
    Password = db.Column(String(100), nullable=False)
    ImageUrl = db.Column(Text)
    Desc = db.Column(String(256))
    CreatedAt = db.Column(DateTime)
    ModifiedAt = db.Column(DateTime)
    Roles_UID = db.Column(Integer, ForeignKey('Roles.UID'), nullable=False)

    resource_fields = api.model('user', {
        'uid': fields.String(required=True, description='user uid'),
        'name': fields.String(required=True, description='user name'),
        'imageurl': fields.String(description='user profile image url'),
        'createdAt': fields.DateTime(),
        'modifiedAt': fields.DateTime(),
        'role': fields.Nested(RoleDTO.resource_fields,description="user role")
     })

    def __init__(self, uid:str, name:str, password:str):
        import datetime

        self.UID = uid 
        self.Name = name 
        self.Password = password 
        self.ImageUrl = None
        self.CreatedAt = datetime.datetime.now()
        self.Roles_UID = 2

    def __repr__(self):
        return f"<{__tablename__}({self.UID}, {self.Name}, {self.Password})>"

    # def as_dict(self):
    #     return {x.name: getattr(self, x.name) for x in self.__table__.columns}

    def as_dict(self):
        obj_d = {
            'uid': self.UID,
            'name': self.Name,
            'imageUrl': self.ImageUrl,
            'createdAt': self.CreatedAt.strftime('%Y-%m-%d %H:%M:%S'),
            'modifiedAt': self.ModifiedAt.strftime('%Y-%m-%d %H:%M:%S') if self.ModifiedAt else None,
            'role': self.role if hasattr(self, 'role') else None
        }

        return obj_d
