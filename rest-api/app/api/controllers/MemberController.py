from datetime import datetime
import os
from os import access
from flask import request, Blueprint, make_response
from flask_restx import Namespace, Resource, marshal
from flask_restx.cors import crossdomain
import jwt

from ..models.Database import db
from ..models.MemberDTO import MemberDTO
from ..models.BoardDTO import BoardDTO
from ..models.UserDTO import UserDTO
from ..models.RoleDTO import RoleDTO
from ..models.ResponseDTO import ResponseDTO

# define name space
api = Namespace('Member', description='member related operations')

resource_fields = UserDTO.resource_fields
user_service = Blueprint('api', __name__, url_prefix='/api/member')


@api.route('/<board_uid>')
class Members(Resource):
    @api.doc('get all members')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def get(self, board_uid:str):
        """return all member information"""
        from app import app

        res = ResponseDTO()
        res.data = []
        try:
            res.success = True
            res.code = 200
            res.msg = 'Success' 

            members = db.session.query(MemberDTO, BoardDTO, UserDTO, RoleDTO).filter(MemberDTO.Boards_UID==BoardDTO.UID).filter(MemberDTO.Users_UID==UserDTO.UID).filter(MemberDTO.Roles_UID==RoleDTO.UID).filter(MemberDTO.Boards_UID==board_uid).all()
            for member, board, user, role in members:
                member.board = board.UID
                member.user = user.UID
                member.name = user.Name
                member.role = role.as_dict()
                res.data.append(member.as_dict())
        except Exception as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)
            res.data = None

        return res

    @api.doc('new members')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def post(self, board_uid:str):
        """new members for board"""
        from app import app

        res = ResponseDTO()
        try:
            res.success = True
            res.code = 200
            res.msg = 'Success' 
            res.data = None

            items = self.get_list(('users', 'roles'))

            # delete members from board
            MemberDTO.query.filter_by(Boards_UID=board_uid).delete(synchronize_session=False)

            # add members to board
            for user, role in items:
                member = MemberDTO()
                member.Boards_UID = board_uid
                member.Users_UID = user
                role_ = RoleDTO.query.filter_by(Role=role).first()
                member.Roles_UID = role_.UID
                db.session.add(member)

            db.session.commit()
        except Exception as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)
            res.data = None

        return res

    def get_list(self, headers):
        items = []

        values = [request.form.getlist(h) for h in headers]
        for uid, role in zip(values[0][0].split(','), values[1][0].split(',')):
            items.append((uid, role))

        return items

@api.route('/<uid>')
@api.doc(params={'uid': 'The member identifier'})
class Member(Resource):
    @api.doc('update a member with given uid')
    @api.marshal_with(ResponseDTO.resource_fields)
    def put(self, uid: str):
        """update a member given its identifier"""
        import uuid

        res = ResponseDTO()
        try:
            role = request.form['role']

            role_ = RoleDTO.query.filter_by(Role=role).first()
            values = {'Roles_UID': role_.UID}

            db.session.query(MemberDTO).filter(MemberDTO.UID==uid).update(values)
            db.session.commit()

            res.success = True
            res.code = 200
            res.msg = 'Success' 
            res.data = None
        except Exception as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)

        return res

    @api.doc('Delete a member with given uid')
    @api.marshal_with(ResponseDTO.resource_fields)
    def delete(self, uid: int):
        """delete a member given its identifier"""

        res = ResponseDTO()
        try:
            member = MemberDTO.query.filter_by(UID=uid).first()
            if member:
                db.session.delete(member)
                db.session.commit()

                res.success = True
                res.code = 200
                res.msg = 'Success' 
                res.data = None
            else:
                res.success = False
                res.code = 204
                res.msg = 'There is no member' 
                res.data = None
        except Exception as ex:
            res.success = False
            res.code = 204
            res.msg = repr(ex)

        return res