# file name : index.py
# pwd : /project_name/app/license/index.py

from flask import Blueprint, request, render_template, flash, redirect, url_for, jsonify
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import *
from werkzeug.utils import secure_filename
from wtforms.validators import *

import json, base64
import cv2
import sys, os
import numpy as np

# training
sys.path.insert(0, os.path.dirname(os.path.realpath(__file__)) + '\\..\\..\\symbol_training')

training_service = Blueprint('training', __name__, url_prefix='/training')

import train


class TrainingForm(FlaskForm):
    csrf_token = 'id2 web service'
    project_name = StringField('Project Name', required=True)
    class_file = FileField('Class File', validators=[FileRequired()])
    training_file = FileField('Training File', validators=[FileRequired()])


@training_service.route('/add', methods=['GET', 'POST'])
def add_training():
    form = TrainingForm()
    if request.method == 'POST':
        if form.validate_on_submit():
            f = request.files[form.training_file.name]
            f.save(f.filename)
        else:
            file_url = None

    return render_template("/training/index.html", form=form)


@training_service.route('/upload_training_data', methods=['POST'])
def upload_training_data():
    if request.method == 'POST':
        r = request
        datas = json.loads(r.data)
        
        data_path = os.path.join(os.path.dirname(os.path.realpath(__file__)) + '\\..\\..\\symbol_training\\Data\\', datas['name'])

        if not os.path.isdir(data_path):
            os.mkdir(data_path)
            os.mkdir(os.path.join(data_path, 'training'))
            os.mkdir(os.path.join(data_path, 'training', 'xml'))
            os.mkdir(os.path.join(data_path, 'training', 'img'))
            os.mkdir(os.path.join(data_path, 'test'))
            os.mkdir(os.path.join(data_path, 'test', 'xml'))
            os.mkdir(os.path.join(data_path, 'test', 'img'))

        count = 0

        for name, str_img in datas['tiles']:
            str_img = base64.b64decode(str_img)
            nparr = np.fromstring(str_img, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            cv2.imwrite(os.path.join(data_path, name), img)
            count += 1

        for name, xml in datas['xmls']:
            #rect = base64.b64decode(str_img)
            with open(os.path.join(data_path, name), 'w') as stream:
                stream.write(xml)
            count += 1

        return jsonify({'count': count})

@training_service.route('/training_model', methods=['POST'])
def training_model():
    if request.method == 'POST':
        r = request
        datas = json.loads(r.data)
        
        data_path = os.path.join(os.path.dirname(os.path.realpath(__file__)) + '\\..\\..\\symbol_training\\Data\\', datas['name'])

        if os.path.isdir(data_path):
            train.train(name=datas['name'], classes=datas['classes'], bigs=datas['bigs'], root_path=data_path, pre_trained_model_path=os.path.dirname(os.path.realpath(
                                                       __file__)) + '\\..\\..\\symbol_training\\pre_trained_model\\only_params_trained_yolo_voc')
            
        return jsonify({'count': 1})
