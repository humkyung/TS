from flask_restx import Namespace, fields
from flask_restx.fields import DateTime

from .Database import db
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Index, Integer, String, Table, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import NullType

api = Namespace('user_role', description='user role related operations')


class RoleDTO(db.Model):
    __tablename__ = 'Roles'

    UID = db.Column(Integer, primary_key=True)
    Role = db.Column(String(100), nullable=False)

    resource_fields = api.model('role', {
        'uid': fields.Integer(required=True, description='role uid'),
        'role': fields.String(required=True, description='role name')
     })

    def __init__(self):
        self.UID = None
        self.Role = None

    def __repr__(self):
        return f"<{__tablename__}({self.UID}, {self.Role}>"

    def as_dict(self):
        obj_d = {
            'role': self.Role
        }

        return obj_d
