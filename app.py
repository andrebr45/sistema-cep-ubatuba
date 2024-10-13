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

class users(db.Model):
    _id = db.Column("id", db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    telefone = db.Column(db.String(100))
    email = db.Column(db.String(100))
    senha = db.Column(db.String(100))  # Armazena o hash da senha
    data = db.Column(db.String(10))
    hora = db.Column(db.String(8))
    situacao = db.Column(db.String(8))
    nivel_acesso = db.Column(db.String(100))
    genero = db.Column(db.String(100))
    cpf = db.Column(db.String(100))
    data_nascimento = db.Column(db.String(100))
    matricula = db.Column(db.String(100))
    usuario = db.Column(db.String(100))
    lotacao = db.Column(db.String(100))
    cargo = db.Column(db.String(100))
    local_trabalho = db.Column(db.String(100))
    logradouro = db.Column(db.String(100))
    numero = db.Column(db.String(100))
    bairro = db.Column(db.String(100))
    cidade = db.Column(db.String(100))
    estado = db.Column(db.String(100))
    cep = db.Column(db.String(100))

    def __init__(self, name, telefone, email, senha, data, hora, genero, cpf, data_nascimento, matricula, usuario, lotacao, cargo, local_trabalho, situacao, nivel_acesso, logradouro, numero, bairro, cidade, estado, cep):
        self.name = name
        self.telefone = telefone
        self.email = email
        self.senha = self.generate_password_hash(senha)  # Gera e armazena o hash da senhagenerate_password_hash(senha)  # Gera e armazena o hash da senha
        self.data = data
        self.hora = hora
        self.situacao = situacao
        self.nivel_acesso = nivel_acesso
        self.genero = genero
        self.cpf = cpf
        self.data_nascimento = data_nascimento
        self.matricula = matricula
        self.usuario = usuario
        self.lotacao = lotacao
        self.cargo = cargo
        self.local_trabalho = local_trabalho
        self.logradouro = logradouro
        self.numero = numero
        self.bairro = bairro
        self.cidade = cidade
        self.estado = estado
        self.cep = cep

    def generate_password_hash(self, senha):
        return bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_senha(self, senha):
        return bcrypt.checkpw(senha.encode('utf-8'), self.senha.encode('utf-8'))

class LoginHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    login_date = db.Column(db.String(10))  # Data do login
    login_time = db.Column(db.String(8))   # Hora do login

    user = db.relationship('users', backref=db.backref('logins', lazy=True))

class Escola(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100))
    codigo = db.Column(db.String(100))
    categoria = db.Column(db.String(100))
    tipo = db.Column(db.String(100))
    telefone = db.Column(db.String(100))
    qnt_alunos = db.Column(db.Integer)  # Alteração aqui
    qnt_funcionarios = db.Column(db.Integer)  # Alteração aqui
    situacao = db.Column(db.String(100))
    data = db.Column(db.String(10))

    email = db.Column(db.String(100))    
    rua = db.Column(db.String(100))
    numero = db.Column(db.String(100))
    bairro = db.Column(db.String(100))
    cidade = db.Column(db.String(100))
    estado = db.Column(db.String(100))
    cep = db.Column(db.String(100))

    alunos = db.relationship('Aluno', backref='escola', lazy=True)
    
    #TESTE ALUNOS POR ESCOLA
    def count_alunos(self):
        return len(self.alunos)
    

    @staticmethod
    def count_ciclo_escola():
        return Escola.query.filter_by(categoria='CEI').count()
    

class Serie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    escola_id = db.Column(db.Integer, db.ForeignKey('escola.id'), nullable=False)
    escola = db.relationship('Escola', backref=db.backref('series', lazy=True))

class Turma(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    serie_id = db.Column(db.Integer, db.ForeignKey('serie.id'), nullable=False)
    serie = db.relationship('Serie', backref=db.backref('turmas', lazy=True))
    escola_id = db.Column(db.Integer, db.ForeignKey('escola.id'), nullable=False)  # Adicionando a chave estrangeira para a tabela Escola
    escola = db.relationship('Escola', backref=db.backref('turmas', lazy=True))

class Periodo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    escola_id = db.Column(db.Integer, db.ForeignKey('escola.id'), nullable=False)
    escola = db.relationship('Escola', backref=db.backref('periodos', lazy=True))

class Aluno(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100))
    telefone = db.Column(db.String(100))
    genero = db.Column(db.String(100))
    ra = db.Column(db.String(100))
    cpf = db.Column(db.String(100))
    email = db.Column(db.String(100))
    data_nascimento = db.Column(db.String(10))
    responsavel1 = db.Column(db.String(100))
    responsavel2 = db.Column(db.String(100))
    aluno_nee = db.Column(db.String(100))
    auxilio = db.Column(db.String(6))
    remedio_controlado = db.Column(db.String(100))
    aluno_pcd = db.Column(db.String(6))
    aluno_reforco = db.Column(db.String(6))
    rua = db.Column(db.String(100))
    numero = db.Column(db.String(100))
    bairro = db.Column(db.String(100))
    cidade = db.Column(db.String(100))
    estado = db.Column(db.String(100))
    cep = db.Column(db.String(100))
    situacao = db.Column(db.String(100))
    data_cadastro = db.Column(db.String(30))
    hora_cadastro = db.Column(db.String(30))
    escola_id = db.Column(db.Integer, db.ForeignKey('escola.id'), nullable=False)
    turma_id = db.Column(db.Integer, db.ForeignKey('turma.id'), nullable=False)
    turma = db.relationship('Turma', backref=db.backref('alunos', lazy=True))
    serie_id = db.Column(db.Integer, db.ForeignKey('serie.id'), nullable=False)
    serie = db.relationship('Serie', backref=db.backref('alunos', lazy=True))
    periodo_id = db.Column(db.Integer, db.ForeignKey('periodo.id'), nullable=False)
    periodo = db.relationship('Periodo', backref=db.backref('alunos', lazy=True))

    @staticmethod
    def count_nee_students():
        return Aluno.query.filter_by(aluno_nee='Sim').count()
    
    @staticmethod
    def count_pcd_students():
        return Aluno.query.filter_by(aluno_pcd='Sim').count()
    

class Funcionarios(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100))
    telefone = db.Column(db.String(100))
    genero = db.Column(db.String(100))
    cpf = db.Column(db.String(100))
    email = db.Column(db.String(100))
    data_nascimento = db.Column(db.String(10))
    
    data = db.Column(db.String(10))  # Alterado para db.String
    hora = db.Column(db.String(8))  # Coluna para armazenar a hora

    matricula = db.Column(db.String(100))
    lotacao = db.Column(db.String(100))
    local_trabalho = db.Column(db.String(100))
    cargo = db.Column(db.String(100))
    efetivo = db.Column(db.String(100))
    formacao = db.Column(db.String(100))
    add1 = db.Column(db.String(100))
    add2 = db.Column(db.String(100))
    add3 = db.Column(db.String(100))
    periodo = db.Column(db.String(100))
    rua = db.Column(db.String(100))
    numero = db.Column(db.String(100))
    bairro = db.Column(db.String(100))
    cidade = db.Column(db.String(100))
    estado = db.Column(db.String(100))
    cep = db.Column(db.String(100))
    situacao = db.Column(db.String(100))

    @staticmethod
    def count_agentes_funcionarios():
        return Funcionarios.query.filter_by(cargo='Agente Educacional').count()
    
    @staticmethod
    def count_professores_funcionarios():
        return Funcionarios.query.filter_by(cargo='Professor').count()

class AlocacaoFuncionario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    funcionario_id = db.Column(db.Integer, db.ForeignKey('funcionarios.id'), nullable=False)
    funcionario = db.relationship('Funcionarios', backref=db.backref('alocacoes', lazy=True))

    escola_id = db.Column(db.Integer, db.ForeignKey('escola.id'), nullable=True)
    escola = db.relationship('Escola', backref=db.backref('alocacoes_funcionarios', lazy=True))

    serie_id = db.Column(db.Integer, db.ForeignKey('serie.id'), nullable=True)
    serie = db.relationship('Serie', backref=db.backref('alocacoes_funcionarios', lazy=True))

    turma_id = db.Column(db.Integer, db.ForeignKey('turma.id'), nullable=True)
    turma = db.relationship('Turma', backref=db.backref('alocacoes_funcionarios', lazy=True))

    # Adiciona campos para a data e hora de alocação
    data_alocacao = db.Column(db.String(10))
    hora_alocacao = db.Column(db.String(8))


#@app.route("/user/home")
def home():
    if "user_id" in session:
    
        # Consultar o total de escolas, alunos e usuários e etc.
        total_escolas = Escola.query.count()
        total_alunos = Aluno.query.count()
        total_usuarios = users.query.count()
        total_funcionarios = Funcionarios.query.count()
        total_agentes = Funcionarios.count_agentes_funcionarios()
        total_professores = Funcionarios.count_professores_funcionarios()
        total_alunos_nee = Aluno.count_nee_students()
        total_alunos_pcd = Aluno.count_pcd_students()
        total_ciclo_escola = Escola.count_ciclo_escola()

        return render_template("dashboard.html", total_escolas=total_escolas, total_alunos=total_alunos, total_usuarios=total_usuarios, total_funcionarios=total_funcionarios , total_agentes = total_agentes, total_professores = total_professores ,total_alunos_nee=total_alunos_nee, total_alunos_pcd=total_alunos_pcd, total_ciclo_escola=total_ciclo_escola, current_page='home')
    else:
        flash("Você não está logado!")
        return redirect(url_for("login"))


@app.route("/user/funcionarios")
def funcionarios():
    if "user_id" in session:
        # Consulta todos os professores
        funcionarios = Funcionarios.query.all()
        return render_template("funcionarios.html", funcionarios=funcionarios, current_page='funcionarios')
    else:
        flash("Você não está logado!")
        return redirect(url_for("login"))

@app.route('/api/funcionarios', methods=['GET']) 
def get_funcionarios():
    # Consulta todos os funcionários
    funcionarios = Funcionarios.query.all()

    # Converte os funcionários para um formato JSON
    funcionarios_json = []

    for funcionario in funcionarios:
        # Consultar a alocação do funcionário
        alocacao = AlocacaoFuncionario.query.filter_by(funcionario_id=funcionario.id).first()

        # Preparar as informações de alocação
        escola_nome = alocacao.escola.nome if alocacao and alocacao.escola else ""
        serie_nome = alocacao.serie.nome if alocacao and alocacao.serie else ""
        turma_nome = alocacao.turma.nome if alocacao and alocacao.turma else ""

        # Concatenar série e turma se ambos existirem
        serie_turma = f"{serie_nome} {turma_nome}".strip() if serie_nome or turma_nome else "Não alocado"

        # Criar o dicionário com as informações do funcionário
        funcionario_json = {
            'nome': funcionario.nome,
            'matricula': funcionario.matricula,
            'cpf': funcionario.cpf,
            'telefone': funcionario.telefone,
            'cargo': funcionario.cargo,
            'escola': escola_nome if escola_nome else "Não alocado",
            'serie': serie_turma,
            'periodo': funcionario.periodo,
            'status': funcionario.situacao,
            'id': funcionario.id
        }

        funcionarios_json.append(funcionario_json)

    return jsonify(funcionarios_json)


@app.route("/cadastro", methods=["POST", "GET"])
def cadastro():
    if "user_id" in session:
        if request.method == "POST":
            # Seu código de processamento do formulário
            nome = request.form["cd_user_nome"]
            telefone = request.form["cd_user_telefone"]
            genero = request.form["cd_user_genero"]
            cpf = request.form["cd_user_cpf"]
            email = request.form["cd_user_email"]
            data_nasc = request.form["cd_user_nascimento"]
            matricula = request.form["cd_user_matricula"]
            usuario = request.form["cd_user_usuario"]
            trabalho = request.form["cd_user_trabalho"]
            cargo = request.form["cd_user_cargo"]
            nivel_acesso = request.form["cd_user_nivel_acesso"]
            senha = request.form["cd_user_senha"]
            rua = request.form["cd_user_rua"]
            numero = request.form["cd_user_numero"]
            bairro = request.form["cd_user_bairro"]
            cidade = request.form["cd_user_municipio"]
            estado = request.form["cd_user_estado"]
            cep = request.form["cd_user_cep"]

            # Verifica se o email já está em uso
            existing_user = users.query.filter_by(email=email).first()

            if existing_user:
                flash("Email já está em uso. Por favor, escolha outro.")
            else:
                try:
                    # Obtém a data e hora atuais
                    data_atual = datetime.now().strftime('%d/%m/%Y')
                    hora_atual = datetime.now().strftime('%H:%M:%S')

                    # Crie um novo usuário com os dados fornecidos
                    usr = users(name=nome, telefone=telefone, email=email, senha=senha, data=data_atual, hora=hora_atual, genero=genero, cpf=cpf, data_nascimento=data_nasc, matricula=matricula, usuario=usuario, lotacao="Secretaria Municipal de Educação", local_trabalho=trabalho, situacao="Ativo", nivel_acesso=nivel_acesso, cargo=cargo, logradouro=rua, numero=numero, bairro=bairro, cidade=cidade, estado=estado, cep=cep)
                    db.session.add(usr)
                    db.session.commit()
                    flash("Cadastrado com Sucesso!", "success")
                    return redirect(url_for("usuarios"))
                except IntegrityError:
                    # Captura a exceção caso haja um problema de integridade (por exemplo, violação de chave única)
                    db.session.rollback()
                    flash("Erro ao cadastrar. Por favor, tente novamente.")
            # Redireciona para a página de cadastro após a tentativa de cadastro
            return redirect(url_for("cadastro"))
        else:
            # Se o método da requisição não for POST, apenas renderize o template de cadastro
            return render_template("cadastro.html")
    else:
        flash("Você não está conectado.")
        return redirect(url_for("login"))
    



@app.route("/", methods=["POST", "GET"])
def login():
    if "user_id" in session:
        flash("Você já está logado!")
        return redirect(url_for("home"))
    else:
        if request.method == "POST":
            user = request.form["nm"]
            password = request.form["senha"]
            found_user = users.query.filter_by(usuario=user).first()

            if found_user:
                # Verifica se a senha fornecida é igual à senha armazenada
                if bcrypt.checkpw(password.encode('utf-8'), found_user.senha.encode('utf-8')):
                    # Armazena o ID do usuário na sessão
                    session["user_id"] = found_user._id
                    
                    # Captura a data e hora atuais para o histórico de login
                    now = datetime.now()
                    login_entry = LoginHistory(
                        user_id=found_user._id,
                        login_date=now.strftime("%Y-%m-%d"),
                        login_time=now.strftime("%H:%M:%S")
                    )
                    
                    # Salva o login no histórico
                    db.session.add(login_entry)
                    db.session.commit()
                    
                    return redirect(url_for("home"))
                else:
                    flash("Usuário ou senha incorretos. Por favor, verifique suas credenciais.")
                    return redirect(url_for("login"))
            else:
                flash("Usuário não encontrado. Por favor, entre em contato com a TI.")
                return redirect(url_for("login"))
        else:
            return render_template("login.html")
      


# Executando o aplicativo com configuração para o Heroku
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    with app.app_context():
        db.create_all()  # Cria todas as tabelas do banco de dados
    app.run(host="0.0.0.0", port=port)