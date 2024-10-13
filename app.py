from flask import Flask, redirect, url_for, render_template, request, session, flash, send_file, jsonify
from datetime import timedelta
from flask_sqlalchemy import SQLAlchemy
import os
from sqlalchemy.exc import IntegrityError
from datetime import datetime

import locale
import bcrypt
import json
from io import BytesIO
import requests
app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.secret_key = "hello"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'+ os.path.join(basedir,'db1.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.permanent_session_lifetime=timedelta(minutes=35)


db = SQLAlchemy(app)

# Modelos do Banco de Dados

class UFs(db.Model):
    __tablename__ = 'ufs'
    iduf = db.Column(db.Integer, primary_key=True)
    uf = db.Column(db.String(2), unique=True, nullable=False)

class Localidades(db.Model):
    __tablename__ = 'localidades'
    idlocal = db.Column(db.Integer, primary_key=True)
    localidade = db.Column(db.String(30), unique=True, nullable=False)

class Adicionais(db.Model):
    __tablename__ = 'adicionais'
    idadicional = db.Column(db.Integer, primary_key=True)
    informacao_adicional = db.Column(db.String(30), unique=True, nullable=False)

class Bairros(db.Model):
    __tablename__ = 'bairros'
    idbairro = db.Column(db.Integer, primary_key=True)
    bairro = db.Column(db.String(30), unique=True, nullable=False)

class Tipos(db.Model):
    __tablename__ = 'tipos'
    idtipo = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(20), unique=True, nullable=False)

class TipoSituacao(db.Model):
    __tablename__ = 'tiposituacao'
    idsituacao = db.Column(db.Integer, primary_key=True)
    situacao = db.Column(db.String(20), unique=True, nullable=False)

class Codificacoes(db.Model):
    __tablename__ = 'codificacoes'
    idcodificacao = db.Column(db.Integer, primary_key=True)
    codificacao = db.Column(db.String(20), unique=True, nullable=False)

class Logradouros(db.Model):
    __tablename__ = 'logradouros'
    idlogra = db.Column(db.Integer, primary_key=True)
    id_uf = db.Column(db.Integer, db.ForeignKey('ufs.iduf'), nullable=False)
    id_local = db.Column(db.Integer, db.ForeignKey('localidades.idlocal'), nullable=False)
    logradouro = db.Column(db.String(80), nullable=False)
    id_adicional = db.Column(db.Integer, db.ForeignKey('adicionais.idadicional'), nullable=False)
    cep = db.Column(db.Integer, unique=True, nullable=False)
    id_bairro = db.Column(db.Integer, db.ForeignKey('bairros.idbairro'), nullable=False)
    id_tipo = db.Column(db.Integer, db.ForeignKey('tipos.idtipo'), nullable=False)
    id_situacao = db.Column(db.Integer, db.ForeignKey('tiposituacao.idsituacao'), nullable=False)
    id_codificacao = db.Column(db.Integer, db.ForeignKey('codificacoes.idcodificacao'), nullable=False)



@app.route("/logout")
def logout():
    return render_template("transferir.html", current_page='logout')

@app.route("/rua", methods=["POST", "GET"])
def rua():
    # Consultar logradouros do banco de dados
    logradouros = Logradouros.query.all()  # Buscando todos os logradouros

    return render_template("ruas.html", logradouros=logradouros, current_page='rua')

@app.route("/bairro", methods=["POST", "GET"])
def bairro():
    return render_template("escolas.html", current_page='bairro')

@app.route("/cep", methods=["POST", "GET"])
def cep():
    return render_template("escolas.html", current_page='cep')

@app.route("/", methods=["POST", "GET"])
def home():
    return render_template("transferir.html", current_page='home')
      

def inserir_logradouros():
    logradouros_data = [
        {"idlogra": 1, "id_uf": 1, "id_local": 1, "logradouro": "Rodovia Doutor Manoel Hyppolito Rego", "id_adicional": 1, "cep": "11680001", "id_bairro": 1, "id_tipo": 1, "id_situacao": 1, "id_codificacao": 1},
        {"idlogra": 2, "id_uf": 1, "id_local": 1, "logradouro": "Rua Caraguatá", "id_adicional": 1, "cep": "11680003", "id_bairro": 1, "id_tipo": 1, "id_situacao": 1, "id_codificacao": 2},
        {"idlogra": 3, "id_uf": 1, "id_local": 1, "logradouro": "Rua Nossa Senhora de Fátima", "id_adicional": 1, "cep": "11680005", "id_bairro": 1, "id_tipo": 1, "id_situacao": 1, "id_codificacao": 2},
        {"idlogra": 4, "id_uf": 1, "id_local": 1, "logradouro": "Rua Amador Quintino dos Santos", "id_adicional": 1, "cep": "11680007", "id_bairro": 1, "id_tipo": 1, "id_situacao": 1, "id_codificacao": 2},
        {"idlogra": 5, "id_uf": 1, "id_local": 1, "logradouro": "Rua Projetada 270", "id_adicional": 1, "cep": "11680009", "id_bairro": 1, "id_tipo": 1, "id_situacao": 1, "id_codificacao": 2},
        # Continue adicionando os demais registros...
    ]
    
    try:
        db.session.bulk_insert_mappings(Logradouros, logradouros_data)
        db.session.commit()
        print("Dados inseridos com sucesso!")
    except IntegrityError:
        db.session.rollback()
        print("Erro de integridade, talvez algum dado já exista.")


@app.route("/inserir_dados")
def inserir_dados():
    inserir_logradouros()
    return "Dados inseridos!"
      


# Executando o aplicativo com configuração para o Heroku
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    with app.app_context():
        db.create_all()  # Cria todas as tabelas do banco de dados
    app.run(host="0.0.0.0", port=port)