import re
from flask import request, Blueprint
from flask_restx import Namespace, Resource

from ..models.Database import db
from sqlalchemy import and_

from ..models.NodeDTO import NodeDTO
from ..models.ResponseDTO import ResponseDTO
from ..models.UserDTO import UserDTO

# define name space
api = Namespace('Node', description='node related operations')

resource_fields = NodeDTO.resource_fields
node_service = Blueprint('api', __name__, url_prefix='/node')

@api.route('')
class Nodes(Resource):
    @api.doc('list_of_node')
    @api.marshal_list_with(ResponseDTO.resource_fields)
    def get(self):
        """List all node"""
        import uuid

        try:
            res = ResponseDTO()
            res.success = True
            res.code = 200
            res.msg = 'Success' 
            res.data = []

            # 생성 날짜로 소팅
            nodes = db.session.query(NodeDTO).all()
            for node in nodes:
                res.data.append(node.as_dict())
        except Exception as ex:
            res = ResponseDTO()
            res.success = False
            res.code = 202
            res.msg = repr(ex)
            res.data = None

        return res