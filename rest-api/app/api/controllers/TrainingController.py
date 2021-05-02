import os
import zipfile
from flask import request, Blueprint, redirect, url_for, render_template, make_response, jsonify
from flask_restx import Namespace, Resource, reqparse
from werkzeug.datastructures import FileStorage
from .TaskController import Task

api = Namespace('training', description='file related operations')
upload_parser = api.parser()
upload_parser.add_argument('project_no', type=str, required=True)
upload_parser.add_argument('model_name', type=str, required=True)
upload_parser.add_argument('class_file', location='files', type=FileStorage, required=True)
upload_parser.add_argument('training_file', location='files', type=FileStorage, required=True)

training_parser = api.parser()
training_parser.add_argument('project_no', type=str, required=True)
training_parser.add_argument('model_name', type=str, required=True)
training_parser.add_argument('class_name_file', location='files', type=FileStorage, required=True)


def allowed_file(filename):
    return os.path.splitext(filename)[1].upper() == '.ZIP'


@api.route('/upload_files')
@api.expect(upload_parser)
class FileStorage(Resource):
    def post(self):
        args = upload_parser.parse_args()
        project_no = args['project_no']
        model_name = args['model_name']
        class_file = request.files['class_file']
        training_file = request.files['training_file']

        project_path = os.path.join(os.path.dirname(os.path.realpath(__file__)) + '\\..\\..\\symbol_training\\Data\\',
                                 project_no)

        try:
            if not os.path.isdir(project_path):
                os.mkdir(project_path)
                os.mkdir(os.path.join(project_path, 'training'))
                os.mkdir(os.path.join(project_path, 'training', 'xml'))
                os.mkdir(os.path.join(project_path, 'training', 'img'))
                os.mkdir(os.path.join(project_path, 'test'))
                os.mkdir(os.path.join(project_path, 'test', 'xml'))
                os.mkdir(os.path.join(project_path, 'test', 'img'))
        except FileNotFoundError:
            return make_response('File Not Found', 404)

        if Post.create_new_model_if_need(project_no, model_name):
            if class_file and allowed_file(class_file.filename):
                class_file.save(class_file.filename)
                with zipfile.ZipFile(class_file.filename) as zip_file:
                    zip_file.extractall(path=project_path)
            else:
                return False

            if training_file and allowed_file(training_file.filename):
                training_file.save(training_file.filename)
                with zipfile.ZipFile(training_file.filename) as zip_file:
                    zip_file.extractall(path=project_path)
            else:
                return False

            return True

        return False


@api.route('/training')
@api.expect(training_parser)
class TrainingModel(Resource):
    def post(self):
        args = training_parser.parse_args()
        project_no = args['project_no']
        model_name = args['model_name']
        class_name_file = request.files['class_name_file']

        project_path = os.path.join(os.path.dirname(os.path.realpath(__file__)) + '\\..\\..\\symbol_training\\Data\\',
                                    project_no)

        if Post.exist(project_no, model_name):
            if class_name_file:
                classes = class_name_file.read().decode('utf-8').splitlines()
            else:
                return False

        return jsonify({'count': 1})