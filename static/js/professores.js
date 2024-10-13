var professores = [];
var currentPage = 1;
var rowsPerPage = 10;

// Função para carregar os alunos da API
function carregarProfessores() {
    fetch('/api/professores')  // Requisição para a API
        .then(response => response.json())  // Converte a resposta para JSON
        .then(data => {
            professores = data;  // Armazena os dados recebidos
            mostrarProfessores();  // Chama a função para exibir os alunos
        })
        .catch(error => console.error('Erro ao carregar os professores:', error));
}

// Função para exibir os alunos na tabela
function mostrarProfessores() {
    var corpoTabela = document.getElementById("corpoTabela");
    var filtroOpcao = document.getElementById("filtroOpcao").value;
    var input = document.getElementById("myInput").value.toUpperCase();

    // Limpar conteúdo anterior
    corpoTabela.innerHTML = "";

    var totalProfessores = 0;

    // Exibir os alunos que atendem ao critério de filtro
    var filteredProfessores = professores.filter(function(professor) {
        var incluirProfessor = false;
        if (filtroOpcao === "1") {
            if (professor.nome.toUpperCase().indexOf(input) > -1) {
                incluirProfessor = true;
            }
        } 
        if (filtroOpcao === "2") {
            if (professor.matricula.toUpperCase().indexOf(input) > -1) {
                incluirProfessor = true;
            }
        }
        else if (filtroOpcao === "3") {
            if (professor.cpf.toUpperCase().indexOf(input) > -1) {
                incluirProfessor = true;
            }
        }
        if (incluirProfessor) totalProfessores++;
        return incluirProfessor;
    });

    // Atualizar links de paginação
    atualizarPaginacao(filteredProfessores.length);

    // Exibir alunos na tabela considerando a página atual
    var startIndex = (currentPage - 1) * rowsPerPage;
    var endIndex = startIndex + rowsPerPage;
    for (var i = startIndex; i < endIndex && i < filteredProfessores.length; i++) {
        var professor = filteredProfessores[i];
        var row = document.createElement("tr");
        row.innerHTML = "<td><input type='checkbox'></td>" +
            "<td>" + professor.nome + "</td>" +
            "<td>" + professor.matricula + "</td>" +
            "<td>" + professor.cpf + "</td>" +
            "<td>" + professor.escola + "</td>" +
            "<td>" + professor.serie + "</td>" +
            "<td>" + professor.periodo + "</td>" +
            "<td>" + professor.status + "</td>" +
            "<td><span class='material-symbols-outlined btn_editar' data-professor-id='" + professor.id + "'>edit</span><span data-id='" + professor.id + "' class='material-symbols-outlined btn_pdf'>picture_as_pdf</span></td>";
        corpoTabela.appendChild(row);
    }

    // Atualizar quantidade de alunos
    document.getElementById("quantidadeProfessores").innerText = "Quantidade de Professores: " + totalProfessores;

    mostrarProfessor();
}

// Função para atualizar a exibição da paginação
function atualizarPaginacao(totalRows) {
    var paginacao = document.getElementById("paginacao");
    var totalPages = Math.ceil(totalRows / rowsPerPage);
    paginacao.innerHTML = "";
    for (var i = 1; i <= totalPages; i++) {
        var link = document.createElement("a");
        link.href = "#";
        link.innerText = i;
        if (i === currentPage) {
            link.className = "active";
        }
        link.onclick = function() {
            currentPage = parseInt(this.innerText);
            mostrarProfessores(); // Chama mostrarAlunos() ao clicar na página
        };
        paginacao.appendChild(link);
    }
}
function mostrarProfessor() {
    document.querySelectorAll('.btn_editar').forEach(function(btn) {
        btn.addEventListener('click', function(event) {
            event.preventDefault(); // Evita o comportamento padrão do botão

            const professorId = btn.getAttribute('data-professor-id'); 

            // Redireciona para a página de edição com o ID do aluno
            window.location.href = `/user/professores/professor/${professorId}`;
        });
    });
}

// Função para limpar o campo de pesquisa ao trocar o filtro
document.getElementById('filtroOpcao').addEventListener('change', function() {
    var inputPesquisa = document.getElementById('myInput');
    
    // Limpar o campo de pesquisa ao trocar o filtro
    inputPesquisa.value = '';

    // Atualizar o placeholder conforme o filtro selecionado
    if (this.value == "1") {
        inputPesquisa.placeholder = "Pesquisar por nome...";
    } 
    if (this.value == "2") {
        inputPesquisa.placeholder = "Pesquisar por Matrícula...";
    } 
    else if (this.value == "3") {
        inputPesquisa.placeholder = "Pesquisar por CPF...";
    }
    
    // Atualizar a tabela após mudar o filtro
    //filtrarTabela();
});

// Função para filtrar a tabela
function filtrarTabela() {
    currentPage = 1; // Define currentPage como 1 antes de exibir os resultados da consulta
    mostrarProfessores(); // Chama mostrarAlunos() após definir currentPage
}

// Chamar mostrarAlunos pela primeira vez para exibir a primeira página
carregarProfessores();