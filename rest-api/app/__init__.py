#################
#### imports ####
#################
from flask import Flask, render_template, Blueprint
from flask_restx import Api, fields, marshal_with, Resource, reqparse
from flask_cors import CORS

from .api.models.Database import db

from app.api.controllers.SignInController import api as signin_ns
from app.api.controllers.SignUpController import api as signup_ns
from app.api.controllers.UserController import api as user_ns
from app.api.controllers.ProjectController import api as project_ns
from app.api.controllers.BoardController import api as board_ns
from app.api.controllers.TaskController import api as post_ns
from app.api.controllers.CommentController import api as comment_ns
from app.api.controllers.MemberController import api as member_ns
from app.api.controllers.LicenseController import api as license_ns
from app.api.controllers.TrainingController import api as training_ns
from app.api.controllers.RecognitionController import api as recognition_ns
from app.api.controllers.NodeController import api as node_ns

from app.api.models.BoardDTO import api as project_model
from app.api.models.UserDTO import api as user_model
from app.api.models.CommentDTO import api as comment_model
from app.api.models.MemberDTO import api as member_model
from app.api.models.ResponseDTO import api as response_ns


################
#### config ####
################
 
app = Flask(__name__)
cors = CORS(app, resources={'*': {'origins': '*'}})
app.config['SQLALCHEMY_DATABASE_URI'] = "board database uri"
app.config['SECRET_KEY'] = 'atools rest api'
app.config['JWT_SECRET_KEY'] = 'your scret key'  # Change this!
db.init_app(app)

api = Api(app,
          title='ATOOLS RESTFUL API',
          version='1.0',
          description='flask restx web service for atools'
          )

api.add_namespace(project_model)
api.add_namespace(user_model)
api.add_namespace(comment_model)
api.add_namespace(member_model)
api.add_namespace(response_ns)

api.add_namespace(signin_ns, path='/signin')
api.add_namespace(signup_ns, path='/signup')
api.add_namespace(user_ns, path='/user')
api.add_namespace(project_ns, path='/projects')
api.add_namespace(board_ns, path='/board')
api.add_namespace(post_ns, path='/board')
api.add_namespace(comment_ns, path='/comment')
api.add_namespace(member_ns, path='/member')
api.add_namespace(license_ns, path='/license')
api.add_namespace(training_ns, path='/training')
api.add_namespace(node_ns, path='/node')
