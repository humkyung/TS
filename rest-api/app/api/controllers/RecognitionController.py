import os
import zipfile
from flask import request, Blueprint, redirect, url_for, render_template, make_response, jsonify
from flask_restx import Namespace, Resource, reqparse
from werkzeug.datastructures import FileStorage

api = Namespace('recognition', description='recognition related operations')
recognition_parser = api.parser()
recognition_parser.add_argument('project_no', type=str, required=True)
recognition_parser.add_argument('model_name', type=str, required=True)
recognition_parser.add_argument('img_file', location='files', type=FileStorage, required=True)

text_recognition_parser = api.parser()
text_recognition_parser.add_argument('img_file', location='files', type=FileStorage, required=True)


def allowed_file(filename):
    return os.path.splitext(filename)[1].upper() == '.PNG'


@api.route('/symbol_box')
@api.expect(recognition_parser)
class SymbolRecognition(Resource):
    def post(self):
        args = recognition_parser.parse_args()
        project_no = args['project_no']
        model_name = args['model_name']
        img_file = request.files['img_file']


@api.route('/text_box')
@api.expect(text_recognition_parser)
class TextRecognition(Resource):
    def post(self):
        args = text_recognition_parser.parse_args()
        img_file = request.files['img_file']


@api.route('/stream_text_box')
@api.expect(text_recognition_parser)
class StreamTextBoxRecognition(Resource):
    def post(self):
        args = text_recognition_parser.parse_args()
        img_file = request.files['img_file']

