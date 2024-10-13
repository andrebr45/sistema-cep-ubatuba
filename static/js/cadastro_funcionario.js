function getSeries() {
    var escola_id = document.getElementById("inputEscolaForm").value;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/series/" + escola_id, true);
    
    // Adiciona o cabeçalho X-Requested-With à solicitação
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var series = JSON.parse(xhr.responseText);
            var select = document.getElementById("inputSerieForm");
            // Limpar as opções existentes
            select.innerHTML = '<option value="" selected>Selecione a série</option>';
            // Adicionar as novas opções
            for (var i = 0; i < series.length; i++) {
                var option = document.createElement("option");
                option.value = series[i].id;
                option.text = series[i].nome;
                select.appendChild(option);
            }
            // Chamar getPeriodos() após obter as séries
            getPeriodos();
        }
    };
    xhr.send();
}



// Adiciona um evento de mudança à escolha do período
document.getElementById("inputSerieForm").addEventListener("change", function() {
    verificarSerieSelecionado();
});

function verificarSerieSelecionado() {
    // Obter o valor da série selecionada
    var serieSelecionado = document.getElementById("inputSerieForm").value;

    // Aqui você pode realizar a lógica com base na série selecionada
    // Neste exemplo, estou apenas imprimindo o valor da série selecionada no console
    console.log("Serie selecionado:", serieSelecionado);

    // Chamar a função getTurmas() para carregar as turmas correspondentes à série selecionada
    getTurmas(serieSelecionado);
}

function getTurmas(serie_id) {
    
    // Verificar se o valor da série é válido
    if (!serie_id) {
        console.error("Série não selecionada.");
        return; // Sai da função se a série não estiver selecionada
    }
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/turmas/" + serie_id, true);
    
    // Adiciona o cabeçalho X-Requested-With à solicitação
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var turmas = JSON.parse(xhr.responseText);
                console.log("Turmas recebidas:", turmas); // Adicionando um log para verificar as turmas recebidas
                var select = document.getElementById("inputTurmaForm");
                // Limpar as opções existentes
                select.innerHTML = '<option value="" selected>Selecione a turma</option>';
                // Adicionar as novas opções
                for (var i = 0; i < turmas.length; i++) {
                    var option = document.createElement("option");
                    option.value = turmas[i].id;
                    option.text = turmas[i].nome;
                    select.appendChild(option);
                }
            } else {
                console.error("Erro ao obter as turmas. Status: " + xhr.status);
            }
        }
    };
    xhr.send();
}

// Função para habilitar ou desabilitar os campos com base na escolha de "Escola Sede"
function toggleFields(visible) {
    var fields = document.querySelectorAll(".escola"); // Usando o seletor de classe para pegar os elementos
    fields.forEach(function(field) {
        var inputs = field.querySelectorAll("input, select, textarea"); // Seleciona todos os inputs, selects e textareas
        if (visible) {
            inputs.forEach(function(input) {
                input.disabled = false; // Habilita os campos
            });
            
        } else {
            inputs.forEach(function(input) {
                input.disabled = true; // Desabilita os campos
                if (input.tagName === "SELECT") {
                    input.selectedIndex = 0; // Limpa a seleção dos selects
                }
            });
           
        }
    });
}

// Verificar a seleção do botão de rádio "Escola Sede"
document.getElementById("tem_escola_sim").addEventListener("change", function() {
    toggleFields(true); // Mostrar os campos quando "Sim" for selecionado
});

document.getElementById("tem_escola_nao").addEventListener("change", function() {
    toggleFields(false); // Esconder os campos quando "Não" for selecionado
});


// Função para carregar cargos com base no local de trabalho selecionado
function carregarCargoPorLocal() {
    var func_local = document.getElementById('cd_func_local_trabalho').value;
    var cargoSelect = document.getElementById('cd_func_cargo');

    // Limpa as opções anteriores
    cargoSelect.innerHTML = '<option value="Não Alocado">Selecionar Cargo</option>';

    var cargosEscola = ['Serviços Gerais', 'Monitor de Alunos', 'Agente Educacional', 'Coordenador', 'Diretor', 'Empresa Tercerizada', 'Outros'];
    var cargosSecretaria = ['Serviços Gerais', 'Chefe', 'Assessor', 'Diretor', 'Supervisor', 'Secretário', 'Empresa Tercerizada', 'Outros'];

    // Verifica o local de trabalho e define os cargos disponíveis
    if (func_local === 'Escola') {
        cargosEscola.forEach(function(cargo) {
            var option = document.createElement('option');
            option.value = cargo; // Define o value para ser enviado no formulário
            option.text = cargo;
            cargoSelect.add(option);
        });
    } else if (func_local === 'Secretaria de Educação') {
        cargosSecretaria.forEach(function(cargo) {
            var option = document.createElement('option');
            option.value = cargo; // Define o value para ser enviado no formulário
            option.text = cargo;
            cargoSelect.add(option);
        });
    }
}

// Chama a função ao selecionar o local de trabalho
document.getElementById('cd_func_local_trabalho').addEventListener('change', carregarCargoPorLocal);

// Função de inicialização ao carregar a página
window.onload = function() {
    // Verificar se "Sim" está selecionado para "Escola Sede" ao carregar a página
    var isEscolaSedeSim = document.getElementById("tem_escola_sim").checked;
    toggleFields(isEscolaSedeSim); // Ajusta a visibilidade dos campos ao carregar a página

    // Inicializa o carregamento das séries e turmas
    getSeries();
    getTurmas();

    // Adicionar um evento de mudança à escolha da escola para atualizar as séries e turmas
    document.getElementById("inputEscolaForm").addEventListener("change", getSeries);

    // Inicializa os cargos com base no local de trabalho selecionado
    carregarCargoPorLocal();
};