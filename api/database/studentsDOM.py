from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/sfja"
mongo = PyMongo(app)

# Given all info, make new student
# Given student id and form id, add form to student
# Give id, string, value, update student info
# Get forms from student

def putInfo(id, key, update):
    writeR = dict(mongo.db.students.update({'student_id': id}, {'$set': {'basic_info.' + str(key): update}}))
    if writeR['nModified'] > 0:
        return True
    return False

def getInfo(id, key):
    contents = list(mongo.db.students.find({'student_id': id}))
    for content in contents:
        return content['basic_info'][key]

def getStudentForm(id, formNum):
    content = mongo.db.students.find({'id': str(id)})
    forms = dict(content['form'])
    return forms[formNum]