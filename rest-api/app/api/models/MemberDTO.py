from flask_restx import Namespace, fields
from flask_restx.fields import DateTime

from .Database import db
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Index, Integer, String, Table, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import NullType
from ..models.UserDTO import UserDTO
from ..models.RoleDTO import RoleDTO

api = Namespace('member', description='member related operations')


class MemberDTO(db.Model):
    __tablename__ = 'Members'

    UID = db.Column(Integer, primary_key=True)
    Boards_UID = db.Column(String(100), ForeignKey('Boards.UID'), nullable=False)
    Users_UID = db.Column(String(100), ForeignKey('Users.UID'), nullable=False)
    Roles_UID = db.Column(Integer, ForeignKey('Roles.UID'))

    resource_fields = api.model('user', {
        'uid': fields.Integer(required=True, description='member uid'),
        'board': fields.String(required=True, description='board uid'),
        'user': fields.String(required=True, description="user uid"),
        'name': fields.String(required=True, description="user name"),
        'role': fields.Nested(RoleDTO.resource_fields,description="member role")
     })

    def __init__(self):
        self.Boards_UID = None 
        self.Users_UID = None
        self.Roles_UID = None

    def __repr__(self):
        return f"<{__tablename__}({self.UID})>"

    def as_dict(self):
        obj_d = {
            'uid': self.UID,
            'board': self.board if hasattr(self, 'board') else None,
            'user': self.user if hasattr(self, 'user') else None,
            'name': self.name if hasattr(self, 'name') else None,
            'role': self.role if hasattr(self, 'role') else None
        }

        return obj_d
