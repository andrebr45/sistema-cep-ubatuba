

  var alunos_por_escola = [];
        var currentPage = 1;
        var rowsPerPage = 10;
    
        // Função para carregar os alunos da API
        function carregarAlunos() {
            fetch('/api/alunos')  // Requisição para a API
                .then(response => response.json())  // Converte a resposta para JSON
                .then(data => {
                    alunos_por_escola = data;  // Armazena os dados recebidos
                    mostrarAlunos();  // Chama a função para exibir os alunos
                })
                .catch(error => console.error('Erro ao carregar os alunos:', error));
        }
    
        // Função para exibir os alunos na tabela
        function mostrarAlunos() {
            var corpoTabela = document.getElementById("corpoTabela");
            var filtroOpcao = document.getElementById("filtroOpcao").value;
            var input = document.getElementById("myInput").value.toUpperCase();
    
            // Limpar conteúdo anterior
            corpoTabela.innerHTML = "";
    
            var totalAlunos = 0;
    
            // Exibir os alunos que atendem ao critério de filtro
            var filteredAlunos = alunos_por_escola.filter(function(aluno) {
                var incluirAluno = false;
                if (filtroOpcao === "1") {
                    if (aluno.nome.toUpperCase().indexOf(input) > -1) {
                        incluirAluno = true;
                    }
                } else if (filtroOpcao === "2") {
                    if (aluno.ra.toUpperCase().indexOf(input) > -1) {
                        incluirAluno = true;
                    }
                }
                if (incluirAluno) totalAlunos++;
                return incluirAluno;
            });
    
            // Atualizar links de paginação
            atualizarPaginacao(filteredAlunos.length);
    
            // Exibir alunos na tabela considerando a página atual
            var startIndex = (currentPage - 1) * rowsPerPage;
            var endIndex = startIndex + rowsPerPage;
            for (var i = startIndex; i < endIndex && i < filteredAlunos.length; i++) {
                var aluno = filteredAlunos[i];
                var row = document.createElement("tr");
                row.innerHTML = "<td><input type='checkbox'></td>" +
                    "<td>" + aluno.nome + "</td>" +
                    "<td>" + aluno.ra + "</td>" +
                    "<td>" + aluno.escola + "</td>" +
                    "<td>" + aluno.serie + "</td>" +
                    "<td>" + aluno.periodo + "</td>" +
                    "<td>" + aluno.status + "</td>" +
                    "<td><span class='material-symbols-outlined btn_editar' data-aluno-id='" + aluno.id + "'>edit</span><span data-id='" + aluno.id + "' class='material-symbols-outlined btn_pdf'>picture_as_pdf</span></td>";
                corpoTabela.appendChild(row);
            }
    
            // Atualizar quantidade de alunos
            document.getElementById("quantidadeAlunos").innerText = "Quantidade de Alunos: " + totalAlunos;
    
            gerarAlunoPDF();
            editarAluno();
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
                    mostrarAlunos(); // Chama mostrarAlunos() ao clicar na página
                };
                paginacao.appendChild(link);
            }
        }
    
        // Função para filtrar a tabela
        function filtrarTabela() {
            currentPage = 1; // Define currentPage como 1 antes de exibir os resultados da consulta
            mostrarAlunos(); // Chama mostrarAlunos() após definir currentPage
        }

        function gerarAlunoPDF() {
          document.querySelectorAll('.btn_pdf').forEach(function(btn) {
              btn.addEventListener('click', function(event) {
                  event.preventDefault(); // Evita o comportamento padrão do botão
      
                  const alunoId = btn.getAttribute('data-id'); 
      
                  // Abre uma nova guia com a URL para gerar o PDF
                  window.open(`/user/alunos/gerar_pdf/${alunoId}`, '_blank');
              });
          });
      }
    
        
    
        function editarAluno() {
            document.querySelectorAll('.btn_editar').forEach(function(btn) {
                btn.addEventListener('click', function(event) {
                    event.preventDefault(); // Evita o comportamento padrão do botão
    
                    const alunoId = btn.getAttribute('data-aluno-id'); 
    
                    // Redireciona para a página de edição com o ID do aluno
                    window.location.href = `/user/alunos/aluno/${alunoId}`;
                });
            });
        }
    
        // Chama a função para carregar os alunos da API quando a página for carregada
        window.onload = carregarAlunos;

        (() => {
          HTMLElement.prototype.toggle = function(on) {
            switch(on) {
              case undefined:
                this.classList.toggle('hidden');
                break;
              case true:
                this.classList.remove('hidden');
                break;
              case false:
                this.classList.add('hidden');
                break;
              default:
                break;
            }
          }
        
          HTMLElement.prototype.hide = function() {
            this.toggle(false);
          }
        
          HTMLElement.prototype.show = function() {
            this.toggle(true);
          }
        
          const table = {
            checkboxes: document.querySelectorAll('.checkbox'),
            labelItemsSelected: document.getElementById('labelItemsSelected'),
            numberItemsSelected: 0,
            bulkActions: document.getElementById('bulkActions'),
            title: document.getElementById('title'),
          };
        
          let bulkActionsShown = table.numberItemsSelected > 0;
          console.log(`bulkActionsShown: ${bulkActionsShown}`);
        
          table.checkboxes.forEach((checkbox) => {
            checkbox.addEventListener('change', (event) => {
              table.numberItemsSelected = event.currentTarget.checked
                ? ++table.numberItemsSelected
                : --table.numberItemsSelected;
        
              table.labelItemsSelected.innerHTML = table.numberItemsSelected === 1
                  ? `${table.numberItemsSelected} item selected`
                  : `${table.numberItemsSelected} items selected`;
        
              bulkActionsShown = table.numberItemsSelected > 0;
              console.log(`bulkActionsShown: ${bulkActionsShown}`);
        
              if (bulkActionsShown) {
                table.bulkActions.show();
                table.title.hide();
              }
              else {
                table.bulkActions.hide();
                table.title.show();
              }
            });
          });
        })();