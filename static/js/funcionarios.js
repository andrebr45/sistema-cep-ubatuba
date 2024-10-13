var funcionarios = [];
var currentPage = 1;
var rowsPerPage = 10;

// Função para carregar os Funcionarios da API
function carregarFuncionarios() {
    fetch('/api/funcionarios')  // Requisição para a API
        .then(response => response.json())  // Converte a resposta para JSON
        .then(data => {
            funcionarios = data;  // Armazena os dados recebidos
            mostrarFuncionarios();  // Chama a função para exibir os Funcionarios
        })
        .catch(error => console.error('Erro ao carregar os professores:', error));
}
        // Função para exibir os Funcionarios na tabela
        function mostrarFuncionarios() {
            var corpoTabela = document.getElementById("corpoTabela");
            var filtroOpcao = document.getElementById("filtroOpcao").value;
            var input = document.getElementById("myInput").value.toUpperCase();

            // Limpar conteúdo anterior
            corpoTabela.innerHTML = "";

            var totalFuncionarios = 0;

            // Exibir os Funcionarios que atendem ao critério de filtro
            var filteredFuncionarios = funcionarios.filter(function(funcionario) {
                var incluirFuncionario = false;
                if (filtroOpcao === "1") {
                    if (funcionario.nome.toUpperCase().indexOf(input) > -1) {
                        incluirFuncionario = true;
                    }
                }
                if (filtroOpcao === "2") {
                    if (funcionario.matricula.toUpperCase().indexOf(input) > -1) {
                        incluirFuncionario = true;
                    }
                } else if (filtroOpcao === "3") {
                    if (funcionario.cpf.toUpperCase().indexOf(input) > -1) {
                        incluirFuncionario = true;
                    }
                }
                if (incluirFuncionario) totalFuncionarios++;
                return incluirFuncionario;
            });

            // Atualizar links de paginação
            atualizarPaginacao(filteredFuncionarios.length);

            // Exibir Funcionarios na tabela considerando a página atual
            var startIndex = (currentPage - 1) * rowsPerPage;
            var endIndex = startIndex + rowsPerPage;
            for (var i = startIndex; i < endIndex && i < filteredFuncionarios.length; i++) {
                var funcionario = filteredFuncionarios[i];
                var row = document.createElement("tr");
                row.innerHTML = "<td><input type='checkbox'></td>" +
                    "<td>" + funcionario.nome + "</td>" +
                    "<td>" + funcionario.matricula + "</td>" +
                    "<td>" + funcionario.cpf + "</td>" +
                    "<td>" + funcionario.telefone + "</td>" +
                    "<td>" + funcionario.cargo + "</td>" +
                    "<td>" + funcionario.escola + "</td>" +
                    "<td>" + funcionario.status + "</td>" +
                    "<td><span class='material-symbols-outlined btn_editar' data-funcionario-id='" + funcionario.id + "'>edit</span><span data-id='" + funcionario.id + "' class='material-symbols-outlined btn_pdf'>picture_as_pdf</span></td>";
                corpoTabela.appendChild(row);
            }

            // Atualizar quantidade de Funcionarios
            document.getElementById("quantidadeFuncionarios").innerText = "Quantidade de Funcionários: " + totalFuncionarios;

            mostrarFuncionario()
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
                    mostrarFuncionarios(); // Chama mostrarFuncionarios() ao clicar na página
                };
                paginacao.appendChild(link);
            }
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
        function mostrarFuncionario() {
            document.querySelectorAll('.btn_editar').forEach(function(btn) {
                btn.addEventListener('click', function(event) {
                    event.preventDefault(); // Evita o comportamento padrão do botão
        
                    const funcionarioId = btn.getAttribute('data-funcionario-id'); 
        
                    // Redireciona para a página de edição com o ID do aluno
                    window.location.href = `/user/funcionarios/funcionario/${funcionarioId}`;
                });
            });
        }

        // Função para filtrar a tabela
        function filtrarTabela() {
            currentPage = 1; // Define currentPage como 1 antes de exibir os resultados da consulta
            mostrarFuncionarios(); // Chama mostrarFuncionarios() após definir currentPage
        }
// Chamar carregarFuncionarios pela primeira vez para exibir a primeira página
carregarFuncionarios();