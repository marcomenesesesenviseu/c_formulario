// Exemplo da aplicação do C_FORMULÁRIO - Validador de formulários

// Associa o formulário à class c_formulario
const f_Login = new c_formulario("frmLogin");

// Adição das validações ao formulário:
f_Login.Adiciona_Validacoes(["txtUtilizador","«txtUtilizador.val» == ''", "* Obrigatório"]);
f_Login.Adiciona_Validacoes(["txtUtilizador","«txtUtilizador.indexof(',')» > -1", "* O nome do utilizador não pode conter o carater ,!"]);
f_Login.Adiciona_Validacoes(["txtUtilizador","!«txtUtilizador.email»", "* Endereço de correio eletrónico inválido!"]);
f_Login.Adiciona_Validacoes(["txtPalavraPasse","«txtPalavraPasse.len» < 10", "* A palavra-passe tem de ter pelo menos 10 digitos"]);
f_Login.Adiciona_Validacoes(["txtPalavraPasse","«txtPalavraPasse.includes(';')»", "* A palavra-passe contém carateres inválidos!"]);
f_Login.Adiciona_Validacoes(["chkPolitica","!«chkPolitica.checked»", "* É obrigatório concordar com as políticas para entrar!"]);

// Teste das validações ao submeter o formulário

$(document).ready(function() {
    $("body").css("margin-top","50px");

    $("#frmLogin").on("submit", function(e) {
        e.preventDefault();
        if (!f_Login.Testa_Validacoes())
            alert('O formulário será enviado!');

        // Numa situação real o código js seria
        
        // if (f_Login.Testa_Validacoes())
        //     e.preventDefault();
    });

    $("#butLimpar").on("click", function() {
        $("#frmLogin").trigger("reset");
        $("#txtUtilizador").focus();
    });
});
