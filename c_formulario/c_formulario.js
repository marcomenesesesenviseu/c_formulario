/***********************************************************/
/* C_FORMULÁRIO - Validador de formulários                 */
/* Desenvolvido por Marco Meneses (EMES3SOFT)              */
/* Versão 1.3                                             */
/***********************************************************/

if (!window.jQuery) {  
    console.error("A libraria jQuery está em falta.");
}

if (typeof bootstrap !== 'object') {  
    console.error("A libraria bootstrap está em falta.");
}

if (typeof b5toast !== 'object') {
    console.error("A libraria b5toast está em falta.");
}

$.fn.atualiza_tooltip_c_formulario = function(texto, elem = this) {
    const bsTooltip_c_formulario = new bootstrap.Tooltip(elem, {containeer: 'form', placement: 'left', title: texto, customClass: 'erro_c_formulario_tooltip', 
    template: '<div class="tooltip c_formulario" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'});
    return bsTooltip_c_formulario;
}

$.fn.hasAttr_c_formulario = function(name) {
    return this.attr(name) !== undefined;
};

class comparacoes {
    constructor(expressao, objeto, propriedade, valor) {
        this.expressao = expressao;
        this.objeto = objeto;
        this.propriedade = propriedade;
        this.valor = valor;
    }
}

class mensagens {
    constructor(ficheiro, existe, tempo_de_espera) {
        this.ficheiro = ficheiro;
        this.existe = existe;
        this.tempo_de_espera = tempo_de_espera;
    }
}

class formulario_validacoes {
    constructor(id, comparacao, texto_erro, mostra_resultado=false) {
        this.num = this.length > 0 ? this[this.length - 1].num++ : 1;
        this.id = id;
        this.comparacao = comparacao;
        this.texto_erro = texto_erro;
        this.mostra_resultado = mostra_resultado;
    }
}

class formulario_erros {
    constructor(funcao, mensagem_erro){
        this.num = this.length > 0 ? this[this.length - 1].num++ : 1;
        this.funcao = funcao;
        this.mensagem_erro = mensagem_erro;
    }
}

class formulario_objetos {
    constructor(num, id, valor, escondido, testado = false){
        this.num = num;
        this.id = id;
        this.valor = valor;
        this.escondido = escondido;
        this.testado = testado
    }
}

class limitadores {
    static get inicial() { return '«' };
    static get final() { return '»' };
    static get separador() { return "." };
    static get includes_inicial() { return "('" };
    static get includes_final() { return "')" };
    static get valores_inicial() { return "((" };
    static get valores_final() { return "))" };
    static get separador_valores() { return ";;" }
}

class tipos_aviso {
    static get aviso_tooltip() { return 'tooltip' };
    static get aviso_texto() { return 'text' };
    static get aviso_toast() { return "toast" };
}

class constantes {
    static get classe_erro_tooltip() { return "erro_c_formulario_tooltip" };
    static get classe_esconde() { return "esconde_c_formulario" };
    static get classe_erro() { return "erro_c_formulario" };
    static get classe_geral_valido() { return "is-valid" };
    static get classe_geral_invalido() { return "is-invalid" };
    static get classe_obj_valido() { return "objeto_valido_c_formulario" };
    static get classe_obj_invalido() { return "objeto_invalido_c_formulario" };
    static get prefixo_obj_erro() { return "erro_" };
    static get tempo_espera() { return 3500 };
    static get email_regex() { return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ };
    static get nome_ficheiro_json() { return "c_formulario.json" };
}

class c_formulario {
    constructor(id, ficheiro_json_mensagens_personalizadas = undefined) {
        this.erros = [];
        this.caminho = this.#Devolve_Diretoria_Local();

        this.msgs = new mensagens (this.ficheiro_mensagens, false, 3500);
        this.msgs.ficheiro = this.caminho + constantes.nome_ficheiro_json;
        this.msgs.existe = this.#fich_json_existe(this.msgs.ficheiro);
        this.msgs.tempo_de_espera =  this.#fich_json_existe() ? this.#ler_ficheiro_c_formulario("tempo_de_espera") : constantes.tempo_espera;

        this.nome = id;
        this.id = this.#Verifica_String_SubString(id,'#') ? id : "#" + id;
        this.tipo_aviso = tipos_aviso.aviso_texto;

        this.formulario = $(this.id);
        this.formulario.encontrarobjetos = "input,textarea,select";
        this.formulario.filtro = "*";
        this.formulario.elementos = [];
        this.formulario.num_elementos = this.formulario.elementos.length;
        this.formulario.objetos = [];
        this.formulario.ficheiro_mensagens = (ficheiro_json_mensagens_personalizadas != undefined && this.#fich_json_existe(ficheiro_json_mensagens_personalizadas)) ? this.ficheiro_mensagens : ficheiro_json_mensagens_personalizadas;

        if (this.formulario.is("form")) {
            this.#RecolherElementos();
        }
        else
        {
            this.#mostra_mensagem_c_formulario("construtor",0);
            this.Adiciona_Erros(["Construtor", "O objeto não é um formulário ABC " + this.id]);
            console.log(this.erros[0].funcao + ": " + this.erros[0].mensagem_erro);
        }

        this.validacoes = [];
        this.validacoes.elemento_error = undefined;
    }

    // Verifica se existe uma substring dentro de uma string
    #Verifica_String_SubString(str = undefined, substr = undefined) {
        if (str === undefined || substr === undefined)
            return false;
        if (typeof str !== "string" || typeof substr !== "string")
            return false;
        
        return str.includes(substr);
    }

    // Devolve a posição de uma substring dentro de uma string, -1 se não existe
    #Devolve_Pos_String_SubString(str = undefined, substr = undefined) {
        if (str === undefined || substr === undefined)
            return false;
        if (typeof str !== "string" || typeof substr !== "string")
            return false;
        
        return str.indexOf(substr);
    }

    // Devolve a diretoria on se encontra o script do c_formulario
    #Devolve_Diretoria_Local() {
        let diretoria = undefined;

        $.each(document.querySelectorAll("script"), function() {
            if ($(this).attr("src").includes("c_formulario")) {
                let lastIndex = $(this).attr("src").lastIndexOf('/');
                diretoria = $(this).attr("src").substring(0, lastIndex + 1);
                return;
            }
        });

        return diretoria;
    }

    // Verifica se o ficheiro JSON das mensagens existe
    #fich_json_existe(ficheiro_json = undefined) {
        let devolve = false
        
        $.ajax({
            type: "GET",
            url: (ficheiro_json == undefined) ? this.msgs.ficheiro : ficheiro_json,
            async: false,
            dataType: "json",
            data: {},
            success: function (data) {
                devolve = true;
            }
        });

        return devolve;
    }
    
    // Ler o ficheiro JSON das mensagens
    #ler_ficheiro_c_formulario(nome_dado, pos = -1, ficheiro_json = undefined) {
        let dado, resp = "-9999";
    
        if (!this.msgs.existe) {
            console.error("O ficheiro json de mensagens não existe: " + this.msgs.ficheiro);
            return -2;
        }

        dado = $.ajax({
            type: "GET",
            url: (ficheiro_json == undefined) ? this.msgs.ficheiro : ficheiro_json,
            async: false,
            dataType: "json",
            data: {},
            success: function (data) {
                let info = JSON.stringify(data);
                return info;
            },
            error: function (xhr, type, exception) {
                console.error('Erro no acesso ao ficheiro de menagens!\n' + xhr);
                return -1;
            },
        });
        
        try {
            resp = dado.responseJSON[nome_dado];
        } catch (e) {
            console.error('A informação ' + nome_dado + ' não se encontra no ficheiro ' + this.msgs.ficheiro);
            return -1;
        }

        if (pos > -1) resp = dado.responseJSON[nome_dado][pos];
    
        return resp;
    }
    
    // Mostra mensagem toast do formulário
    #mostra_mensagem_c_formulario(variavel_mensagem, codigo_mensagem, com_titulo = false) {
        if (typeof b5toast === "undefined") {
            console.error("O objeto b5toast (ficheiro JS) não existe. Efetue o seu download, para as mensagens funcionem!");
            return false;
        }
        
        let valor = this.#ler_ficheiro_c_formulario(variavel_mensagem);
    
        let info_msg = null;
        for (let i=0; i < valor.length; i++) 
            if (valor[i][0] == codigo_mensagem)
            {
                info_msg = valor[i];
                break;
            }
    
        if (info_msg != null)
        {
            let tipo_mensagem = this.#ler_ficheiro_c_formulario("tipos_mensagens",info_msg[1]);
        
            b5toast.show(tipo_mensagem[2],tipo_mensagem[3] + info_msg[2] + ": " + info_msg[3], com_titulo?tipo_mensagem[1]:'', this.msgs.tempo_de_espera);
        }
        else
            b5toast.show('danger',"Variavel não encontrada: " + variavel_mensagem, 'ERRO', this.msgs.tempo_de_espera);
    }

    // Transforma um id em objeto jQUERY
    #Transforma_id_em_objeto(num_ou_nome_objeto = undefined) {
        return $("#" + num_ou_nome_objeto)
    }
    
    // Adiciona erros ao vetor de erros
    Adiciona_Erros(dados = []) {
        if (this.erros.length === 0) {
            if (dados.length != 2) return; 
            this.erros.push(new formulario_erros("Construtor", "O objeto não é um formulário"));    
        }
    }

    // Apagar erros ao vetor de erros
    Apaga_Erros(funcao) {
        for(let i = 0; i < this.erros.length; i++) {
            if (this.erros[i].funcao.toUpperCase() === funcao.toUpperCase()) {
                this.erros[i].splice(i,1);
            }
        }
    }

    // Obtem os elementos relativos ao formulário
    ObterElementos() {
        if (this.erros.length === 0) {
            this.formulario.elementos = this.formulario.find(this.formulario.encontrarobjetos).filter(this.formulario.filtro);
            this.formulario.num_elementos = this.formulario.elementos.length;
        }
    }

    // Nova recolha de dados de formulario
    #RecolherElementos() {
        if (this.erros.length === 0) {
            let valor_id=0;
            this.ObterElementos();
            this.formulario.vetores = new formulario_objetos([],[],[],[]);

            for(let i=0; i < this.formulario.num_elementos; i++) {
                valor_id = $(this.formulario.elementos[i]).hasAttr("formulario-numobj") ? parseInt($(this.formulario.elementos[i]).attr("formulario-numobj")) : i;
                if (this.formulario.elementos[i].id !== "") {
                    let dados=[];
                    if (this.formulario.elementos[i].id.includes("chk"))
                        dados = [valor_id, this.formulario.elementos[i].id, this.formulario.elementos[i].checked ? 1 : 0, $(this.formulario.elementos[i]).hasClass(constantes.classe_esconde)];
                    else
                        dados = [valor_id, this.formulario.elementos[i].id, this.formulario.elementos[i].value, $(this.formulario.elementos[i]).hasClass(constantes.classe_esconde)];
                    this.formulario.objetos.push(new formulario_objetos(...dados));

                    this.formulario.vetores.num.push(dados[0]);
                    this.formulario.vetores.id.push(dados[1]);
                    this.formulario.vetores.valor.push(dados[2]);
                    this.formulario.vetores.escondido.push(dados[3]);
                }
            }
        }
    }

    // validacoes -> teste de validação (true-erro or false-sem erro), mensagem de erro
    #Testa_Entrada_Dados(dados=[]) {
        if (this.erros.length === 0) {
            if (this.#Verifica_Elemento_Existe(dados[0]) == -1) {
                console.log("TESTA_ENTRADA_DADOS: O objeto não existe no formulário: " + dados[0]);
                return false;
            }
            else if (typeof dados[1] !== 'string') {
                console.log("TESTA_ENTRADA_DADOS: O objeto não é texto. " + dados[1]);
                return false;
            }
            else if (typeof dados[2] !== 'string') {
                console.log("TESTA_ENTRADA_DADOS: O objeto não é texto para o erro."  + dados[2]);
                return false;
            }
            else if (dados.length == 4)
                if (typeof dados[3] !== 'boolean') {
                    console.log("TESTA_ENTRADA_DADOS: O objeto não é um valor booleano. " + dados[3]);
                    return false;
            }

            return true;
        }

        console.log("TESTA_ENTRADA_DADOS: Existem erros no formulário");
        return false;
    }

    // Adiciona validações ao vetor de validações
    // id ou num do objeto, comparação, string com a mensagem de erro
    Adiciona_Validacoes(dados = []) {
        if (this.erros.length === 0) {
            if ([3, 4].includes(dados.length)) {
                if (this.#Testa_Entrada_Dados(dados)) {
                    this.validacoes.push(new formulario_validacoes(...dados));
                    return true;
                }
            }
                
            console.log("ADICIONA_VALIDACOES: Deve introduzir 3 ou 4 dados como vetor ([id ou formulario-numobj do objeto, string de comparação, string com a mensagem de erro]): \n" + dados.length + " -- " + JSON.stringify(dados));
            return false;
        }
        else
            console.log('ADICIONA_VALIDACOES: O objeto definido não é um formulário');
    }

    // Devolve o valor do indice no vetor caso existe, caso contrário devolve -1
    #Existe_Valor_Vetor(valor, vetor) {
        return vetor.indexOf(valor);
    }

    // Devolve a valor da posição se o elemento existe, caso contrário devolve -1
    #Posicao_Elemento_Objetos_Formulario(num_ou_nome_objeto = undefined) {
        let encontrou_pos = -1;

        if (num_ou_nome_objeto.includes("?")) {
            encontrou_pos = this.formulario.vetores.id.filter(str => str.includes(num_ou_nome_objeto.replace("?",""))).length - 1;
            if (encontrou_pos > -1) {
                encontrou_pos = this.#Existe_Valor_Vetor(this.formulario.vetores.id.filter(str => str.includes(num_ou_nome_objeto.replace("?","")))[0],this.formulario.vetores.id);
            }
        }
        else {
            encontrou_pos = this.#Existe_Valor_Vetor(num_ou_nome_objeto,this.formulario.vetores.num);
            if (encontrou_pos == -1) encontrou_pos = this.#Existe_Valor_Vetor(num_ou_nome_objeto,this.formulario.vetores.id);
        }
        
        return encontrou_pos;
    }

    // Verifica se o objeto existe no vetor dos objetos do formulário
    #Verifica_Elemento_Existe(num_ou_nome_objeto = undefined) {
        if (num_ou_nome_objeto === undefined) {
            console.error(`VERIFICA_ELEMENTO_EXISTE: = O ID do objeto ${num_ou_nome_objeto} é indefinido!`);
            return -1;
        }
        else if (typeof num_ou_nome_objeto !== 'int' && typeof num_ou_nome_objeto !== 'string'){
            console.error(`VERIFICA_ELEMENTO_EXISTE: O número ou o id do objeto ${num_ou_nome_objeto} do tipo errado!`);
            return -1;
        }

        let devolver = this.#Posicao_Elemento_Objetos_Formulario(num_ou_nome_objeto);

        if (devolver == -1){
            console.error(`VERIFICA_ELEMENTO_EXISTE: O objeto ${num_ou_nome_objeto} não existe no formulário!`);
            return -1;
        }

        return devolver;
    }

    //Verifica se o objeto existe no vetor dos objetos do formulário
    #Verifica_Elemento_Validacao_Existe(num_ou_nome_objeto = undefined) {
        let vetor_encontrou_pos_validacoes = [];
        
        if (this.validacoes.length ==0) {
            console.error(`VERIFICA_ELEMENTO_VALIDACAO_EXISTE: Não existem validações para testar!`);
            return -1;
        }

        for (let i = 0; i < this.validacoes.length; ++i)
            if (num_ou_nome_objeto != undefined)
                if ($(this).id == num_ou_nome_objeto) vetor_encontrou_pos_validacoes.push(i); else {}
            else
                vetor_encontrou_pos_validacoes.push(i);

        if (vetor_encontrou_pos_validacoes.length == 0) {
            console.error(`VERIFICA_ELEMENTO_VALIDACAO_EXISTE: O objeto ${num_ou_nome_objeto} não existe nas validações!`);
            return -1;
        }

        return vetor_encontrou_pos_validacoes;
    }

    // Devolve o texto entre dois limitadores
    #Devolve_texto_entre_limitadores(texto, limitador_inicial, limitador_final, inclui_limitadores = false) {
        if (!texto.includes(limitador_inicial) || !texto.includes(limitador_final)) {
            console.error(`DEVOLVE_TEXTO_ENTRE_LIMITADORES: O objeto ${texto} não contém os limitadores ${limitador_inicial} ou ${limitador_final}!`);
            return -1;
        }
        else {
            let pos_inicio = texto.indexOf(limitador_inicial) + limitador_inicial.length + (inclui_limitadores ? -1 : 0);
            let pos_final = texto.indexOf(limitador_final, pos_inicio) + (inclui_limitadores ? 1 : 0);

            return texto.substring(pos_inicio, pos_final)
        }
    }

    // Devolve verdadeiro ou false, caso seja um dicionário ou não
    #Verifica_Dicionario(valor_a_testar) {
        return Object.prototype.toString.call(valor_a_testar) === '[object Object]'
    }

    // Através de um endereço e de dados que este necessite, efetuar uma devolução de valores
    #Pedido_Valores($ligacao = undefined, $dados = undefined) {
        if ($ligacao == undefined || $dados == undefined)
            return undefined;
        
        let $devolve = undefined;
        
        // Make an AJAX request to the server to add the new category
        $.ajax({
            url: $ligacao,
            type: "POST",
            data: JSON.parse($dados.toString()),
            async: false,
            success: function (data) {
                $devolve = data;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                devolve = xhr.status + " - " + xhr.responseText;
            }
        });

        return $devolve;
    }

    // Através de um endereço e dos dados do formulário, efetuar uma devolução de valores
    #Pedido_Valores_Formulario($ligacao) { //, $nome_formulario = "") {
        let devolve = undefined;

        // Get the form data
        let $formData = $(this.id).serialize();

        // Make an AJAX request to the server to add the new category
        $.ajax({
            url: $ligacao,
            type: "POST",
            data: $formData,
            async: false,
            success: function (data) {
                devolve = data;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                devolve = xhr.status + " - " + xhr.responseText;
            }
        });

        return devolve;
    }

    #Devolve_posicao_limitadores(texto_a_verificar, inicio_em = 0, incluir_limitadores = true) {
        let posicoes_limitadores = [-1,-1];
        let cont_limitadores = [0,0];

        inicio_em = texto_a_verificar.indexOf(limitadores.inicial, inicio_em);

        if (inicio_em == -1) 
            return posicoes_limitadores;

        for (let posicoes = inicio_em; posicoes <= texto_a_verificar.length; ++posicoes) {
            if (texto_a_verificar[posicoes] == limitadores.inicial) {
                cont_limitadores[0]++;
                posicoes_limitadores[0] = posicoes + (incluir_limitadores ? 0 : 1);
            }
            else if (texto_a_verificar[posicoes] == limitadores.final) {
                posicoes_limitadores[1] = posicoes + (incluir_limitadores ? 1 : 0);
                break;
            }
        }

        return posicoes_limitadores;
    }

    // Elabora o texto final de comparação com a substituição dos objetos pelos seus valores
    #Texto_Final(texto_comparacao, inicio = 0) {
        let txtstr = texto_comparacao;
        let conta_repeticoes = 0;

        while (txtstr.indexOf(limitadores.inicial, inicio) != -1) {
            if (++conta_repeticoes > 3) break;

            let posicoes = this.#Devolve_posicao_limitadores(txtstr, inicio);

            let str_objeto = txtstr.substring(posicoes[0], posicoes[1]);

            let str_objeto_partes = [];
            if (str_objeto.includes("val_address") || str_objeto.includes("val_address_form")) {
                str_objeto_partes.push(str_objeto.substr(1, str_objeto.length-2));
            }
            else if (str_objeto.includes(limitadores.separador)) {
                str_objeto_partes.push(str_objeto.split(limitadores.separador)[0].replace(limitadores.inicial,"").replace(limitadores.final,""));
                str_objeto_partes.push(str_objeto.split(limitadores.separador)[1].replace(limitadores.inicial,"").replace(limitadores.final,"").toLowerCase());
            }
            else{
                str_objeto_partes.push(str_objeto.replace(limitadores.inicial,"").replace(limitadores.final,""));
            }

            let str_objeto_valor = undefined;

            if (str_objeto_partes.length == 1) {
                if (str_objeto_partes[0].includes("data_address")) {
                    if (str_objeto_partes[0].indexOf(limitadores.valores_inicial) == -1 || str_objeto_partes[0].indexOf(limitadores.valores_final) == -1) {
                        str_objeto_valor = `ERRO AO AVALIAR A PROPRIEDADE VAL_ADDRESS: Existem um ou os dois limitadores dos dados  - ${limitadores.valores_inicial} ou ${limitadores.valores_final}`;
                    }
                    else {
                        str_objeto_valor = this.#Devolve_texto_entre_limitadores(str_objeto_partes[0],limitadores.valores_inicial,limitadores.valores_final,false);
        
                        try {
                            str_objeto_valor = str_objeto_valor.split(limitadores.separador_valores);

                            if (str_objeto_valor[0] == undefined || typeof str_objeto_valor[0] !== "string") {
                                str_objeto_valor = `ERRO AO AVALIAR A PROPRIEDADE VAL_ADDRESS: Valor de LINK (${str_objeto_valor[0]})`;
                            }
                            else if (str_objeto_valor[1] == undefined || typeof str_objeto_valor[1] !== "string") {
                                str_objeto_valor = `ERRO AO AVALIAR A PROPRIEDADE VAL_ADDRESS: Valor de DATA inválida (${str_objeto_valor[1]})`;
                            }
                            else {
                                str_objeto_valor =  parseInt(this.#Pedido_Valores(str_objeto_valor[0], str_objeto_valor[1]));
                            }
                        }
                        catch (error) {
                            str_objeto_valor = "ERRO AO AVALIAR A PROPRIEDADE VAL_ADDRESS: " + error.toString();
                        }
                    }
                }
                else if (str_objeto_partes[0].includes("form_address")) {
                    str_objeto_valor = this.#Devolve_texto_entre_limitadores(str_objeto_partes[0],limitadores.valores_inicial,limitadores.valores_final,false);

                    try {
                        str_objeto_valor = str_objeto_valor.split(limitadores.separador_valores);

                        if (str_objeto_valor[0] == undefined || typeof str_objeto_valor[0] !== "string") {
                            str_objeto_valor = `ERRO AO AVALIAR A PROPRIEDADE VAL_ADDRESS_FORM: Valor de LINK inválido (${str_objeto_valor[0]})`;
                        }
                        else if (str_objeto_valor[1] == undefined || typeof str_objeto_valor[1] !== "string" || !$("#" + str_objeto_valor[1]).is("form")) {
                            str_objeto_valor = `ERRO AO AVALIAR A PROPRIEDADE VAL_ADDRESS_FORM: Valor de DATA inválida (${str_objeto_valor[1]})`;
                        }
                        else {
                            str_objeto_valor = parseInt(this.#Pedido_Valores_Formulario(str_objeto_valor[0], str_objeto_valor[1]));
                        }
                    }
                    catch (error) {
                        str_objeto_valor = `ERRO AO AVALIAR A PROPRIEDADE VAL_ADDRESS_FORM: ${error.toString()}`;
                    }
                }
            }
            else {
                if (str_objeto_partes[1] == "val" || str_objeto_partes[1] == "value")
                    str_objeto_valor = $("#" + str_objeto_partes[0]).val();
                else if (str_objeto_partes[1] == "valemail" || str_objeto_partes[1] == "email"){
                    str_objeto_valor = constantes.email_regex.test($("#" + str_objeto_partes[0]).val());
                }
                else if (str_objeto_partes[1] == "check" || str_objeto_partes[1] == "checked")
                    str_objeto_valor = $("#" + str_objeto_partes[0]).is(":checked");
                else if (str_objeto_partes[1] == "length" || str_objeto_partes[1] == "len") {
                    if (str_objeto_partes[0].includes("?")) {
                        str_objeto_partes[0] = str_objeto_partes[0].replace("?","")
                        str_objeto_valor = $("input[name*='" + str_objeto_partes[0] + "']:checked").length;
                    }
                    else
                        str_objeto_valor = $("#" + str_objeto_partes[0]).val().length;
                }
                else if (str_objeto_partes[1].includes("isnumeric"))
                    str_objeto_valor = !$.isNumeric($("#" + str_objeto_partes[0]).val());
                else if (str_objeto_partes[1].includes("includes")) {
                    if (str_objeto_partes[1].includes(limitadores.includes_inicial) && str_objeto_partes[1].includes(limitadores.includes_final)){
                        str_objeto_valor = this.#Devolve_texto_entre_limitadores(str_objeto_partes[1],limitadores.includes_inicial,limitadores.includes_final);
                        str_objeto_valor =  $("#" + str_objeto_partes[0]).val().includes(str_objeto_valor);
                    }
                    else 
                        str_objeto_valor = "ERRO AO AVALIAR A PROPRIEDADE INCLUDES"
                }
                else if (str_objeto_partes[1].includes("indexof")) {
                    if (str_objeto_partes[1].includes(limitadores.includes_inicial) && str_objeto_partes[1].includes(limitadores.includes_final)){
                        str_objeto_valor = this.#Devolve_texto_entre_limitadores(str_objeto_partes[1],limitadores.includes_inicial,limitadores.includes_final);
                        str_objeto_valor =  $("#" + str_objeto_partes[0]).val().indexOf(str_objeto_valor);
                    }
                    else 
                        str_objeto_valor = "ERRO AO AVALIAR A PROPRIEDADE INDEXOF"
                }
                else
                    str_objeto_valor = "ERRO DE PROPRIEDADE NÃO IDENTIFICADO"
            }

            if (str_objeto_valor!=undefined && (typeof str_objeto_valor).toLowerCase() === 'string')
                str_objeto_valor = `"${str_objeto_valor}"`

            console.log(`STR_OBJETO: ${str_objeto}\nSTR_OBJECTO_VALOR: ${str_objeto_valor}`)
            txtstr = txtstr.replace(str_objeto, str_objeto_valor);
        }

        return txtstr;
    };

    // Efetua os testes iniciais
    #Testes_Iniciais(num_ou_nome_objeto = undefined) {
        if (this.erros.length !== 0) {
            console.log(`TESTES_INICIAIS: O objeto ${this.formulario} definido não é um formulário!`);    
            return false;
        }

        if (typeof num_ou_nome_objeto === 'int' || typeof num_ou_nome_objeto === 'string') {
            console.log(`TESTES_INICIAIS: O objeto ${num_ou_nome_objeto} definido não é do tipo correcto (int ou string)!`);
            return false;
        }

        if (num_ou_nome_objeto != undefined) {
            if (this.#Verifica_Elemento_Existe(num_ou_nome_objeto) == -1) {
                console.log(`TESTES_INICIAIS: O objeto ${num_ou_nome_objeto} definido não existe no formulário!`);
                return false;
            }

            if (this.#Transforma_id_em_objeto(num_ou_nome_objeto).hasClass("is-invalid")) {
                console.log(`TESTES_INICIAIS: O objeto ${num_ou_nome_objeto} já está validado com erro!`);
                return false;
            }
        }

        return true;
    }

    // Colocar o estado da caixa segundo o valor_erro (verdadeiro ou falso)
    #Colocar_Estado_Caixa (pos_validacao_com_erro = undefined, valor_erro = undefined, colocar_focus_no_erro = true) {
        if (pos_validacao_com_erro == undefined || !Number.isInteger(pos_validacao_com_erro)) {
            console.log(`COLOCAR_ESTADO_CAIXA: Não foi indicado o valor inteiro da posição do objeto, valor: ${pos_validacao_com_erro}`);
            return false;
        }

        if (valor_erro == undefined || typeof valor_erro != 'boolean') {
            console.log(`COLOCAR_ESTADO_CAIXA: Não foi indicado o valor booleano do erro do objeto, valor: ${valor_erro}`);
            return false;
        }

        let id_objeto =  this.validacoes[pos_validacao_com_erro].id.includes("?") ? this.validacoes[pos_validacao_com_erro].id.replace("?","") : this.validacoes[pos_validacao_com_erro].id;
        let objeto = "#" + id_objeto;
        let objeto_erro = "#" + constantes.prefixo_obj_erro + id_objeto;

        let classe_erro = constantes.classe_geral_invalido;
        let classe_valido = constantes.classe_geral_valido;

        if (!$(objeto).is("input,select,textarea")) {
            classe_erro = constantes.classe_obj_invalido;
            classe_valido = constantes.classe_obj_valido;
        }

        switch (this.tipo_aviso) {
            case tipos_aviso.aviso_tooltip:
                $(objeto).attr('data-bs-toggle','tooltip_c_formulario');
                break;
            case tipos_aviso.aviso_texto:
                let ultimo_objeto_div = $(objeto).closest("div");

                if ($(objeto).is(":checkbox") || this.validacoes[pos_validacao_com_erro].id.includes("?")) {
                    let objeto_anterior = ultimo_objeto_div.parent();

                    if (!objeto_anterior.find(objeto_erro).length) {
                        ultimo_objeto_div.after(`<div id="${ objeto_erro.replace("#","") }" class="${constantes.classe_erro} ${constantes.classe_esconde}"></div>`);
                    }
                }
                else {
                    if (!ultimo_objeto_div.find(objeto_erro).length) {
                        ultimo_objeto_div.append(`<div id="${ objeto_erro.replace("#","") }" class="${constantes.classe_erro} ${constantes.classe_esconde}"></div>`);
                    }
                }
                break;
            case tipos_aviso.aviso_toast:
                break;
        }

        if (!valor_erro) {
            $(objeto).removeClass(classe_erro);
            $(objeto).addClass(classe_valido);

            switch (this.tipo_aviso) {
                case tipos_aviso.aviso_tooltip:
                    $(objeto).apaga_tooltip();
                    break;
                case tipos_aviso.aviso_texto:
                    if ($(objeto_erro) !== undefined && !$(objeto_erro).hasClass(constantes.classe_esconde)) 
                        $(objeto_erro).addClass(constantes.classe_esconde).text("");
                    break;
                case tipos_aviso.aviso_toast:
                    break;            
            }            
        }
        else {
            if ($(".toast").length == 0) this.#mostra_mensagem_c_formulario("formulario",0);
            $(objeto).removeClass(classe_valido);
            $(objeto).addClass(classe_erro);

            switch (this.tipo_aviso) {
                case tipos_aviso.aviso_tooltip:
                    $(objeto).atualiza_tooltip_c_formulario(this.validacoes[pos_validacao_com_erro].texto_erro);
                    break;
                case tipos_aviso.aviso_texto:
                    if ($(objeto_erro) !== undefined) {
                        $(objeto_erro).removeClass(constantes.classe_esconde);
                        $(objeto_erro).html(this.validacoes[pos_validacao_com_erro].texto_erro);
                    }
                    break;
                case tipos_aviso.aviso_toast:
                    break;            
            }

            if (colocar_focus_no_erro) $(objeto).focus();
        }
    }

    // Testa todas as validações existentes na lista de validações
    Testa_Validacoes(num_ou_nome_objeto = undefined, coloca_focus_erro = true) {
        if (!this.#Testes_Iniciais(num_ou_nome_objeto)) return false;

        $.each(this.formulario.objetos, function () { this.testado = false });

        this.#RecolherElementos();
        let posicoes_validacoes_testar = this.#Verifica_Elemento_Validacao_Existe(num_ou_nome_objeto);

        let existe_erros = false;

        for (let i = 0; i <= posicoes_validacoes_testar.length -1 ; ++i) {
            let pos_objeto =this.#Posicao_Elemento_Objetos_Formulario(this.validacoes[i].id);

            if (pos_objeto == -1) continue;

            if (this.formulario.objetos[pos_objeto].testado || this.formulario.objetos[pos_objeto].escondido) continue;

            // comparações
            let txtcomparacao = this.#Texto_Final(this.validacoes[i].comparacao);
            if (txtcomparacao == "") {
                console.log("TESTA_VALIDACOES: (" + this.validacoes[i].id + ") - Expressão de comparação vazia: " + txtcomparacao);
                continue;
            }

            let resultado = -1;

            try {
                resultado = eval?.(txtcomparacao);
                if (this.validacoes[i].mostra_resultado)
                    alert(`Comparação: ${txtcomparacao} - Resultado: ${resultado}`);
            } catch (e) {

            }

            if (typeof resultado != "boolean") {
                console.error("TESTA_VALIDACOES: (" + num_ou_nome_objeto + ") - Erro ao executar a expressão: " + txtcomparacao);
                continue;
            }
            
            this.#Colocar_Estado_Caixa(i, resultado, coloca_focus_erro);

            if (resultado) {
                this.formulario.objetos[pos_objeto].testado = true;
                
                if (!existe_erros) {
                    existe_erros = true;
                    coloca_focus_erro = false;
                }
            }
        }

        return existe_erros;
    }

    // Limpar as validações do formulário
    Limpar_Validacoes(reset_formulario = true) {
        this.#Limpar_Caixa_Erro();
        
        if (reset_formulario)
            this.formulario.trigger('reset');
        else
            this.formulario.limpar_espacos();
    }
    
    #Limpar_Caixa_Erro(pos_validacao_com_erro = undefined) {    
        if (pos_validacao_com_erro == undefined || !Number.isInteger(pos_validacao_com_erro)) {
            console.log(`LIMPAR_CAIXA_ERRO: Não foi indicado o valor inteiro da posição do objeto, valor: ${pos_validacao_com_erro}`);
            return false;
        }

        if (num_ou_nome_objeto === undefined)
            for (let i = 0; i < this.validacoes.length; ++i) {
                let id_objeto =  this.validacoes[i].id.includes("?") ? this.validacoes[i].id.replace("?","") : this.validacoes[i].id;
                let objeto = "#" + id_objeto;
                let objeto_erro = "#" + constantes.prefixo_obj_erro + id_objeto;
        
                let classe_erro = constantes.classe_geral_invalido;
                let classe_valido = constantes.classe_geral_valido;
        
                if (!$(objeto).is("input,select,textarea")) {
                    classe_erro = constantes.classe_obj_invalido;
                    classe_valido = constantes.classe_obj_valido;
                }
        
                if (objeto != undefined) {
                    if (objeto.hasClass(classe_valido)) objeto.removeClass(classe_valido);
                    if (objeto.hasClass(classe_erro)) objeto.removeClass(classe_erro);
                }

                if (objeto_erro != undefined) {
                    if (!objeto_erro.hasClass(constantes.classe_esconde)) objeto_erro.addClass(constantes.classe_esconde);
                }
            }
        else
        {
            let id_objeto =  this.validacoes[pos_validacao_com_erro].id.includes("?") ? this.validacoes[pos_validacao_com_erro].id.replace("?","") : this.validacoes[pos_validacao_com_erro].id;
            let objeto = $("#" + id_objeto);
            let objeto_erro = $("#" + constantes.prefixo_obj_erro + id_objeto);

            if (objeto != undefined) {
                if (objeto.hasClass(classe_valido)) objeto.removeClass(classe_valido);
                if (objeto.hasClass(classe_erro)) objeto.removeClass(classe_erro);
            }

            if (objeto_erro != undefined) {
                if (!objeto_erro.hasClass(constantes.classe_esconde)) objeto_erro.addClass(constantes.classe_esconde);
            }
        }
    }    
}