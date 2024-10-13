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
            select.innerHTML = '<option value="" disabled selected>Selecione a série</option>';
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

function getPeriodos() {
    var escola_id = document.getElementById("inputEscolaForm").value;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/periodos/" + escola_id, true);
    
    // Adiciona o cabeçalho X-Requested-With à solicitação
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var periodos = JSON.parse(xhr.responseText);
            var select = document.getElementById("inputPeriodoForm");
            // Limpar as opções existentes
            select.innerHTML = '<option value="" disabled selected>Selecione o período</option>';
            // Adicionar as novas opções
            for (var i = 0; i < periodos.length; i++) {
                var option = document.createElement("option");
                option.value = periodos[i].id;
                option.text = periodos[i].nome;
                select.appendChild(option);
            }
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
                select.innerHTML = '<option value="" disabled selected>Selecione a turma</option>';
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

    // Adicionar um evento de mudança à escolha da escola
    document.getElementById("inputEscolaForm").addEventListener("change", function() {
        getTurmas();
    });
};