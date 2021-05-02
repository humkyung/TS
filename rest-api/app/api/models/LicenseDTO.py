# coding: utf-8
"""This is license module"""

from sqlalchemy.util.langhelpers import decode_slice
from .Database import db
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Index, Integer, String, Table, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import NullType
from flask_restx import Namespace, fields


api = Namespace('license', description='license related operations')

class LicenseDTO(db.Model):
    __tablename__ = 'Licenses'

    UID = db.Column(Integer, primary_key=True)
    Mac = db.Column(String(100), nullable=False)
    Email = db.Column(String(256), nullable=False)
    App = db.Column(String(100))
    Count = db.Column(Integer)
    Code = db.Column(Text)

    license = api.model('license', {
        'uid': fields.Integer(requried=True, description='UID'),
        'Mac': fields.String(required=True, description='mac address'),
        'Email': fields.String(required=True, description='email'),
        'App': fields.String(description='application name'),
        'Count': fields.Integer(description='running count'),
        'Code': fields.String(description='license code')
    })

    def __init__(self):
        self.Mac = None 
        self.Email = None
        self.App = None
        self.Count = None
        self.Code = None

    def __repr__(self):
        return f"<{__tablename__}({self.UID})>"

    def as_dict(self):
        obj_d = {
            'uid': self.UID,
            'mac': self.Mac,
            'email': self.Email,
            'app': self.App,
            'count': self.Count,
            'code': self.Code
        }

        return obj_d

