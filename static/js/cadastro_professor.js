document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM completamente carregado e analisado');

    // Obtém os elementos de input
    var inputTelefone = document.getElementById('inputPhoneForm');
    var inputCEP = document.getElementById('inputCEPForm');

    // Formata o número de telefone do banco de dados
    formatarCampo(inputTelefone, '(00) 00000-0000');

    // Formata o CEP do banco de dados
    formatarCampo(inputCEP, '00000-000');

    // Adiciona um listener para o evento 'input' para ambos os campos
    inputTelefone.addEventListener('input', function() {
        // Formata o número de telefone enquanto o usuário digita
        formatarCampo(inputTelefone, '(00) 00000-0000');
    });

    inputCEP.addEventListener('input', function() {
        // Formata o CEP enquanto o usuário digita
        formatarCampo(inputCEP, '00000-000');
    });
});

function formatarCampo(input, formato) {
    // Obtém o valor atual do input
    var valor = input.value;

    // Remove todos os caracteres não numéricos
    valor = valor.replace(/\D/g, '');

    // Inicializa o índice para percorrer o formato
    var indice = 0;
    var valorFormatado = '';

    // Formata o valor de acordo com o formato especificado
    for (var i = 0; i < formato.length; i++) {
        // Verifica se o caractere atual no formato é um dígito
        if (/\d/.test(formato[i])) {
            // Se for, adiciona o próximo dígito do valor
            valorFormatado += valor[indice] || '';
            indice++;
        } else {
            // Se não for, adiciona o caractere do formato
            valorFormatado += formato[i];
        }
    }

    // Define o valor formatado de volta para o input
    input.value = valorFormatado;
}
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM completamente carregado e analisado');

    // Função que carrega as disciplinas de acordo com o tipo selecionado
    function carregarDisciplinasPorTipo() {
        var tipoProfessor = document.getElementById('cd_professor_tipo').value;
        var disciplinaSelect = document.getElementById('cd_professor_disciplina');

        // Limpa todas as opções existentes no select de disciplinas
        disciplinaSelect.innerHTML = '<option value="Não alocado" selected>Selecionar Disciplina</option>'; // Mantém a opção desabilitada e selecionada

        if (tipoProfessor === 'PEB 1') {
            // Adiciona opções específicas para PEB 1
            var disciplinasPEB1 = ['Comum'];
            disciplinasPEB1.forEach(function(disciplina) {
                var option = document.createElement('option');
                option.value = disciplina; // Define o value para ser enviado no formulário
                option.text = disciplina;
                
                disciplinaSelect.add(option);
            });
        } else if (tipoProfessor === 'PEB 2') {
            // Adiciona opções específicas para PEB 2
            var disciplinasPEB2 = ['Língua Portuguesa', 'Matemática', 'Ciências', 'História', 'Geografia', 'Educação Física', 'Artes'];
            disciplinasPEB2.forEach(function(disciplina) {
                var option = document.createElement('option');
                option.value = disciplina; // Define o value para ser enviado no formulário
                option.text = disciplina;

                disciplinaSelect.add(option);
            });
        }
    }

    // Chama a função ao carregar a página para exibir as disciplinas corretas
    carregarDisciplinasPorTipo();

    // Também dispara a função sempre que o tipo de professor é alterado pelo usuário
    document.getElementById('cd_professor_tipo').addEventListener('change', carregarDisciplinasPorTipo);
});

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

// Chamar getSeries() quando a página carregar para obter as séries iniciais
// Chamar getTurmas() quando a página carregar e sempre que a escola for alterada
window.onload = function() {
    getSeries();
    getTurmas();

    // Adicionar um evento de mudança à escolha da escola
    document.getElementById("inputEscolaForm").addEventListener("change", function() {
        getTurmas();
    });
};