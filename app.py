import json
from flask import Flask, render_template, request, redirect, jsonify
from api.calc import somar


app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
app.config['SECRET_KEY'] = 'teste123'

tasks = [{
    'id': '1'
}]

@app.route("/")
def index():
    return render_template('index.html')


@app.route('/calc', methods=['POST'])
def get_tasks():
    query = request.get_json()
    numeros = query['numeros']
    tempo = query['tempo']
    for i, numero in enumerate(numeros):
        numeros[i] = float(numero)
    tempo = float(tempo)
    soma = somar(numeros, tempo)
    print(soma)
    return jsonify(soma)

if __name__ == '__main__':
    app.run(debug=True)