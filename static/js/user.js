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