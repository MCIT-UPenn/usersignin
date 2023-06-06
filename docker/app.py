import os
from flask import Flask, request, jsonify
from flask_cors import CORS 
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
import werkzeug
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
cors = CORS(app)

# Get MongoDB credentials from environment variables
mongo_username = os.environ.get('MONGO_USERNAME')
mongo_password = os.environ.get('MONGO_PASSWORD')
# mongo_host = os.environ.get('MONGO_HOST')
# mongo_port = os.environ.get('MONGO_PORT')
mongo_database = os.environ.get('MONGO_DATABASE')

# Set MongoDB URI
mongo_uri = f"mongodb+srv://{mongo_username}:{mongo_password}@quicknote.qoqkmsi.mongodb.net/{mongo_database}?retryWrites=true&w=majority" 
# mongo_uri = f'mongodb://{mongo_username}:{mongo_password}@{mongo_host}:{mongo_port}/{mongo_database}'
app.config["MONGO_URI"] = mongo_uri
mongo = PyMongo(app)

@app.route('/signin', methods=['POST'])
def signin():
    users = mongo.db.users
    login_user = users.find_one({'email' : request.json['email']})

    if login_user:
        if check_password_hash(login_user['password'], request.json['password']):
            return jsonify({"success": True, "message": "Logged in successfully."})
        else:
            return jsonify({"success": False, "message": "Invalid password."})

    return jsonify({"success": False, "message": "User not found."})


@app.route('/signup', methods=['POST'])
def signup():
    users = mongo.db.users
    existing_user = users.find_one({'email' : request.json['email']})
    
    if existing_user is None:
        hashpass = generate_password_hash(request.json['password'], method='sha256')
        users.insert_one({'email' : request.json['email'], 'password' : hashpass})
        return jsonify({"success": True, "message": "User created successfully."})
    else:
        return jsonify({"success": False, "message": "User already exists."})

@app.errorhandler(Exception)
def handle_exception(e):
    if isinstance(e, werkzeug.exceptions.HTTPException):
        return e

    return jsonify({"success": False, "message": "An unexpected error occurred.", "error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
