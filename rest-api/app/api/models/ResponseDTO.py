from flask_restx import Namespace, fields

api = Namespace('response', description='response related operations')


class ResponseDTO:
    resource_fields = api.model('response', {
        'success': fields.Boolean(required=True, description='True or False'),
        'code': fields.Integer(required=True, description='response code'),
        'msg': fields.String(required=True, description='response message'),
        'data': fields.Raw(description='data')
     })

    def __init__(self, success=False):
        self.success = success
        self.code = None
        self.msg = None
        self.data = None

    def as_dict(self):
        obj_d = {
            'success': self.success,
            'code': self.code,
            'msg': self.msg,
            'data': self.data
        }

        return obj_d
