
// Associa o formulário à class c_formulario
const f_Login = new c_formulario("frmLogin");

// Adição das validações ao formulário:
f_Login.Adiciona_Validacoes(["txtUtilizador","«txtUtilizador» == ''", "* Obrigatório"]);
f_Login.Adiciona_Validacoes(["txtUtilizador","«txtUtilizador.indexof(',')» > -1", "* O nome do utilizador não pode conter o carater ,!"]);
f_Login.Adiciona_Validacoes(["txtPalavraPasse","«txtPalavraPasse» < 6", "* A palavra-passe tem de ter pelo menos 10 digitos"]);
f_Login.Adiciona_Validacoes(["txtPalavraPasse","«txtPalavraPasse.includes(';')»", "* A palavra-passe contém carateres inválidos!"]);
f_Login.Adiciona_Validacoes(["chkPolitica","!«chkPolitica.checeked»", "* É obrigatório concordar com as políticas para entrar!"]);

// Teste das validações ao submeter o formulário

$(document).ready(function() {
    $("#frmLogin").on("submit", function() {
        if (!f_Login.Testa_Validacoes())
            alert('O formulário será enviado!');
    });
});