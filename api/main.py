from flask import Flask
app = Flask(__name__)

@app.route("/")
def home():
    return "HELLO Word"

@app.route("/about")
def home():
    return "HELLO about"