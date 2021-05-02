import datetime

from flask_restx import Namespace, fields
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Index, Integer, String, Table, Text, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import BLOB, LargeBinary, NullType
from ..models.Database import db
from ..models.UserDTO import UserDTO

api = Namespace('Node', description='node related operations')


class NodeDTO(db.Model):
    __tablename__ = 'Nodes'

    UID = db.Column(String(100), primary_key=True)
    Type = db.Column(String(100), nullable=False)
    CableWayName = db.Column(String(100), nullable=False)
    Length = db.Column(Float(), default=0)

    resource_fields = api.model('node', {
        'uid': fields.String(required=True, description='node uid'),
        'type': fields.String(required=True, description='node type'),
        'cablewayname': fields.String(description='cable way name'),
        'length': fields.Float(description='length')
    })

    def __init__(self):
        self.UID = None
        self.Type = None
        self.CableWayName = None
        self.Length = 0

    def as_dict(self):
        obj_d = {
            'uid': self.UID,
            'type': self.Type,
            'cablewayname': self.CableWayName,
            'length': self.Length
        }

        return obj_d
