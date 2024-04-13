from flask import Flask, render_template
import numpy as np

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/about")
def home():
    return f"HELLO about 1 + 1 = {np.abs(1+1)}"

if __name__ == '__main__':
    app.run(debug=True)