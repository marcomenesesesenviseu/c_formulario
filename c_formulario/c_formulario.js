/***********************************************************/
/* C_FORMULÁRIO - Validador de formulários                 */
/* Desenvolvido por Marco Meneses (EMES3SOFT)              */
/* Versão 1.01                                             */
/***********************************************************/

if (window.jQuery) {  
} else {
    console.error("O jquery ainda não foi carregado.");
}

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
}

class constantes {
    static get classe_esconde() { return "esconde_c_formulario" };
    static get classe_geral_valido() { return "is-valid" };
    static get classe_geral_invalido() { return "is-invalid" };
    static get classe_obj_valido() { return "objeto_valido_c_formulario" };
    static get classe_obj_invalido() { return "objeto_invalido_c_formulario" };
}

class formulario {
    constructor(id) {
        this.erros = [];
        this.mensagens = new mensagens ("c_formulario.json", this.#fich_json_existe(), this.#fich_json_existe() ? this.#ler_ficheiro_c_formulario("tempo_de_espera") : 3500);

        this.id = "#" + id;
        this.nome = id;

        this.formulario = $(this.id);
        this.formulario.encontrarobjetos = "input,textarea,select";
        this.formulario.filtro = "*";
        this.formulario.elementos = [];
        this.formulario.num_elementos = this.formulario.elementos.length;
        this.formulario.objetos = [];
    
        if (this.formulario.is("form")) {
            this.#RecolherElementos();
        }
        else
        {
            this.Adiciona_Erros(["Construtor", "O objeto não é um formulário"]);
            console.log(this.erros[0].funcao + ": " + this.erros[0].mensagem_erro);
        }

        this.validacoes = [];
        this.validacoes.elemento_error = undefined;
    }

    // Verifica se o ficheiro JSON das mensagens existe
    #fich_json_existe() {
        let devolve = $.ajax({
            type: "GET",
            url: this.ficheiro_mensagens + "ddd",
            async: false,
            dataType: "json",
            data: {},
            success: function (data) {
                let info = JSON.stringify(data);
                return info;
            },
            error: function () {
                return -1;
            }
        });

        return devolve.responseJSON !== undefined;
    }
    
    // Ler o ficheiro JSON das mensagens
    #ler_ficheiro_c_formulario(nome_dado, pos = -1) {
        let dado, resp = "-9999";
    
        if (!this.mensagens.existe) {
            console.error("O ficheiro json de mensagens não existe: " + this.mensagens.ficheiro);
            return -2;
        }
    
        dado = $.ajax({
            type: "GET",
            url: this.mensagens.ficheiro,
            async: false,
            dataType: "json",
            data: {},
            success: function (data) {
                let info = JSON.stringify(data);
                return info;
            },
            error: function (xhr, type, exception) {
                console.error('Erro no acesso ao ficheiro de mesnagens: ' + this.messagens.ficheiro);
                return -1;
            },
        });
        
        try {
            resp = dado.responseJSON[nome_dado];
        } catch (e) {
            console.error('A informação ' + nome_dado + ' não se encontra no ficheiro ' + this.mensagens.ficheiro);
            return -1;
        }

        if (pos > -1) resp = dado.responseJSON[nome_dado][pos];
    
        console.log(resp);
    
        return resp;
    }
    
    // Mostra mensagem toast do formulário
    #mostra_mensagem_c_formulario(variavel_mensagem, codigo_mensagem, com_titulo = false) {
        if (typeof b5toast === "undefined") {
            console.error("O objeto b5toast (ficheiro JS) não existe. Efetue o seu download, para as mensagens funcionem!");
            return false;
        }
        
        valor = this.#ler_ficheiro_c_formulario(variavel_mensagem);
    
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
        
            b5toast.show(tipo_mensagem[2],tipo_mensagem[3] + info_msg[2] + ": " + info_msg[3], com_titulo?tipo_mensagem[1]:'', this.mensagens.tempo_de_espera);
        }
        else
            b5toast.show('danger',"Variavel não encontrada: " + variavel_mensagem, 'ERRO', this.mensagens.tempo_de_espera);
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
                // $.each(this.formulario.vetores.id, function(index) { if (this.includes(num_ou_nome_objeto.replace("?",""))) { encontrou_pos = index; return false;}});
                encontrou_pos = this.#Existe_Valor_Vetor(this.formulario.vetores.id.filter(str => str.includes(num_ou_nome_objeto.replace("?","")))[0],this.formulario.vetores.id);
            }
            // alert(this.formulario.vetores.id.filter(str => str.includes(num_ou_nome_objeto.replace("?","")))[0]);
            // alert(`Objeto: ${num_ou_nome_objeto}\nNº de objetos encontrados: ${num_elementos}\nPosição no array: ${encontrou_pos}`)
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

    // #ObterPosicaoCarater(texto = nothing, texto_a_procurar = nothing, posicao_inicial = 0) {
    //     if (texto == nothing) {
    //         this.#mostra_mensagem_c_formulario("formularios",20);
    //         return -2;
    //     }
    //     else if (texto_a_procurar == nothing) {
    //         mostra_mensagem_toast("formularios",21);
    //         return -2;
    //     }
    //     else if (typeof texto != "string") {
    //         mostra_mensagem_toast("formularios",22);
    //         return -3;
    //     }
    //     else if (typeof texto_a_procurar != "string") {
    //         mostra_mensagem_toast("formularios",23);
    //         return -3;
    //     }
    //     else if (typeof posicao_inicial != "int") {
    //         mostra_mensagem_toast("formularios",24);
    //         return -3;
    //     }
    //     else
    //         return texto.indexOf(texto_a_procurar,posicao_inicial);
    // }

    #Devolve_texto_entre_limitadores(texto, limitador_inicial, limitador_final)
    {
        if (!texto.includes(limitador_inicial) || !texto.includes(limitador_final)) {
            console.error(`DEVOLVE_TEXTO_ENTRE_LIMITADORES: O objeto ${num_ou_nome_objeto} não contém os limitadores « ou »!`);
            return -1;
        }
        else {
            let pos_inicio = texto.indexOf(limitador_inicial) + limitador_inicial.length;
            let pos_final = texto.indexOf(limitador_final, pos_inicio);

            return texto.substring(pos_inicio, pos_final)
        }
    }

    // Elabora o texto final de comparação com a substituição dos objetos pelos seus valores
    #Texto_Final(texto_comparacao) {
        let txtstr = texto_comparacao;
        let compara_objeto = [];
        let inicio=0;
        
        while (txtstr.indexOf(limitadores.inicial, inicio) != -1) {
            let posicoes = [0,0];

            posicoes[0] = txtstr.indexOf(limitadores.inicial, inicio);
            posicoes[1] = txtstr.indexOf(limitadores.final, inicio) + 1;
            inicio = posicoes[1];

            let str_objeto = txtstr.substr(posicoes[0], posicoes[1]);

            let str_objeto_partes = [];
            if (str_objeto.includes(limitadores.separador)) {
                str_objeto_partes.push(str_objeto.split(limitadores.separador)[0].replace(limitadores.inicial,"").replace(limitadores.final,""));
                str_objeto_partes.push(str_objeto.split(limitadores.separador)[1].replace(limitadores.inicial,"").replace(limitadores.final,""))
            }
            else
                str_objeto_partes.push(str_objeto.replace(limitadores.inicial,"").replace(limitadores.final,""));

            //alert("texto: " + txtstr + " -- strobjetos: " + JSON.stringify(str_objeto_partes));
            let str_objeto_valor = undefined;

            str_objeto_partes[1] = str_objeto_partes[1].toLowerCase();

            if (str_objeto_partes.length == 1 || str_objeto_partes[1] == "val" || str_objeto_partes[1] == "value")
                str_objeto_valor = $("#" + str_objeto_partes[0]).val();
            else if (str_objeto_partes[1] == "length" || str_objeto_partes[1] == "len")
                if (str_objeto_partes[0].includes("?")) {
                    str_objeto_partes[0] = str_objeto_partes[0].replace("?","")
                    str_objeto_valor = $("input[name*='" + str_objeto_partes[0] + "']:checked").length;
                }
                else
                    str_objeto_valor = $("#" + str_objeto_partes[0]).val().length;
            else if (str_objeto_partes[1].toLowerCase().includes("isnumeric"))
                str_objeto_valor = !$.isNumeric($("#" + str_objeto_partes[0]).val());
            else if (str_objeto_partes[1].toLowerCase().includes("includes")) {
                if (str_objeto_partes[1].includes(limitadores.includes_inicial) && str_objeto_partes[1].includes(limitadores.includes_final)){
                    str_objeto_valor = this.#Devolve_texto_entre_limitadores(str_objeto_partes[1],limitadores.includes_inicial,limitadores.includes_final);
                    str_objeto_valor =  $("#" + str_objeto_partes[0]).val().includes(str_objeto_valor);
                }
                else 
                    str_objeto_valor = "ERRO AO AVALIAR A PROPRIEDADE INCLUDES"
            }
            else if (str_objeto_partes[1].toLowerCase().includes("indexof")) {
                if (str_objeto_partes[1].includes(limitadores.includes_inicial) && str_objeto_partes[1].includes(limitadores.includes_final)){
                    str_objeto_valor = this.#Devolve_texto_entre_limitadores(str_objeto_partes[1],limitadores.includes_inicial,limitadores.includes_final);
                    str_objeto_valor =  $("#" + str_objeto_partes[0]).val().indexOf(str_objeto_valor);
                    //alert(`#Texto_Final\nObjecto: ${str_objeto_partes[0]}\nValor a devolver: ${str_objeto_valor}`);
                }
                else 
                    str_objeto_valor = "ERRO AO AVALIAR A PROPRIEDADE INDEXOF"
            }
            else
                str_objeto_valor = "ERRO DE PROPRIEDADE"


            // str_objeto_valor = (str_objeto_partes.length == 1) ? $("#" + str_objeto_partes[0]).val() : ((str_objeto_partes[1] == "length") ? $("#" + str_objeto_partes[0]).val().length : "ERRO DE PROPRIEDADE");

            if ((typeof str_objeto_valor).toLowerCase() === 'string')
                str_objeto_valor = "'" + str_objeto_valor + "'"

            compara_objeto.push(new comparacoes(str_objeto, str_objeto_partes[0], str_objeto_partes[1], str_objeto_valor));
        }

        for (let i = 0; i < compara_objeto.length; i++) {
            txtstr = txtstr.replace(compara_objeto[i].expressao, compara_objeto[i].valor);
        }

        return txtstr;
    };

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
        // let id_objeto =  this.validacoes[pos_validacao_com_erro].id.includes("?") ? this.formulario.vetores.id.filter(str => str.includes(this.validacoes[pos_validacao_com_erro].id.replace("?","")))[0] : this.validacoes[pos_validacao_com_erro].id;
        let id_objeto =  this.validacoes[pos_validacao_com_erro].id.includes("?") ? this.validacoes[pos_validacao_com_erro].id.replace("?","") : this.validacoes[pos_validacao_com_erro].id;
        let objeto = "#" + id_objeto;
        let objeto_erro = "#erro_" + id_objeto;

        // alert(`Objeto: ${objeto}\nObjeto erro: ${objeto_erro}`);
        let classe_erro = constantes.classe_geral_invalido;
        let classe_valido = constantes.classe_geral_valido;

        if (!$(objeto).is("input")) {
            classe_erro = constantes.classe_obj_invalido;
            classe_valido = constantes.classe_obj_valido;
        }

        if (!valor_erro) {
            $(objeto).removeClass(classe_erro);
            $(objeto).addClass(classe_valido);
            if ($(objeto_erro) !== undefined && !$(objeto_erro).hasClass(constantes.classe_esconde)) 
                $(objeto_erro).addClass(constantes.classe_esconde);
        }
        else {
            $(objeto).removeClass(classe_valido);
            $(objeto).addClass(classe_erro);
            if ($(objeto_erro) !== undefined) {
                $(objeto_erro).removeClass(constantes.classe_esconde);
                $(objeto_erro).html(this.validacoes[pos_validacao_com_erro].texto_erro);
                if (colocar_focus_no_erro) $(objeto).focus();
            }
            else {
                console.log(`VALIDAR_CAIXA_ERRO: O objeto ${objeto} não tem objeto de erro ${objeto_erro}`);
            }
        }
    }

    // Testa todas as validações existentes na lista de validações
    Testa_Validacoes(num_ou_nome_objeto = undefined, coloca_focus_erro = true) {
        if (!this.#Testes_Iniciais(num_ou_nome_objeto)) return false;

        $.each(this.formulario.objetos, function () { this.testado = false });
        // alert(JSON.stringify(this.formulario.objetos));

        this.#RecolherElementos();
        let posicoes_validacoes_testar = this.#Verifica_Elemento_Validacao_Existe(num_ou_nome_objeto);

        let existe_erros = false;

        for (let i = 0; i <= posicoes_validacoes_testar.length -1 ; ++i) {
            //console.log(i);
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

    Limpar_Validacoes(reset_formulario = true) {
        this.elementos.each(function() {
            this.Validar_Caixa_Erro("#" + $(this).id, 0);
        });	
        
        if (reset_formulario)
            this.formulario.trigger('reset');
        else
            this.formulario.limpar_espacos();
    }

    Validar_Caixa_Erro (num_ou_nome_objeto = undefined, valor_erro = undefined, colocar_focus_no_erro = true, evitar_outras_validacoes = false) {
        let num_obj = -1;

        if (this.validacoes.length == 0) {
            console.error("VALIDAR_CAIXA_ERRO: Não existem validações!");
            return false;
        }

        if (!evitar_outras_validacoes) {
            if (num_ou_nome_objeto === undefined) {
                console.error("VALIDAR_CAIXA_ERRO: = O número ou o id do objeto é indefinido!");
                return false;
            }
            else if (typeof num_ou_nome_objeto !== 'int' && typeof num_ou_nome_objeto !== 'string'){
                console.error("VALIDAR_CAIXA_ERRO: O número ou o id do objeto do tipo errado!");
                return false;
            }

            num_obj = this.#Verifica_Elemento_Existe(num_ou_nome_objeto);
            if (num_obj == -1){
                console.error(`VALIDAR_CAIXA_ERRO: O objeto ${num_ou_nome_objeto} não existe no formulário!`);
                return false;
            }
        }

        for (let i = 0; i < this.validacoes.length; i++) {
            if (this.validacoes[i].id == this.formulario.objetos[num_obj].id)
            {
                // comparações
                let txtcomparacao = this.#Texto_Final(this.validacoes[i].comparacao);
                if (txtcomparacao == "") continue;
                
                if (typeof valor_erro != "boolean") {
                    console.log("VALIDAR_CAIXA_ERRO: Erro ao executar a expressão: " + txtcomparacao);
                    continue;
                }

                let objeto = "#" + this.validacoes[i].id;
                let objeto_erro = "#erro_" + this.validacoes[i].id;

                if (!valor_erro) {
                    $(objeto).removeClass("is-invalid");
                    $(objeto).addClass("is-valid");
                    if ($(objeto_erro) !== undefined && !$(objeto_erro).hasClass(constantes.classe_esconde)) 
                        $(objeto_erro).addClass(constantes.classe_esconde);
                }
                else {
                    $(objeto).removeClass("is-valid");
                    $(objeto).addClass("is-invalid");
                    if ($(objeto_erro) !== undefined) {
                        $(objeto_erro).removeClass(constantes.classe_esconde);
                        $(objeto_erro).html(this.validacoes[i].texto_erro);
                        if (colocar_focus_no_erro) $(objeto).focus();
                    }
                    else {
                        console.log(`VALIDAR_CAIXA_ERRO: O objeto ${objeto} não tem objeto de erro ${objeto_erro}`);
                    }
                }
            }
        }
    }
    
    Limpar_Caixa_Erro(num_ou_nome_objeto = undefined, valor_erro = undefined) {    
        if (num_ou_nome_objeto === undefined)
            for (let i = 0; i < this.formulario.objetos.length; ++i) {
                let objeto = $("#" + this.formulario.objetos[i].id);
                let objeto_erro = $("#erro_" + this.formulario.objetos[i].id);

                if (objeto === undefined) {
                    if (objeto.hasClass("is-valid")) objeto.removeClass("is-valid");
                    if (objeto.hasClass("is-invalid")) objeto.removeClass("is-invalid");
                }

                if (objeto_erro === undefined) {
                    if (!objeto_erro.hasClass(constantes.classe_esconde)) objeto_erro.addClass(constantes.classe_esconde);
                }
            }
        else
        {
            let objeto = $("#" + num_ou_nome_objeto);
            let objeto_erro = $("#erro_" + num_ou_nome_objeto);

            if (objeto === undefined) {
                if (objeto.hasClass("is-valid")) objeto.removeClass("is-valid");
                if (objeto.hasClass("is-invalid")) objeto.removeClass("is-invalid");
            }

            if (objeto_erro === undefined) {
                if (!objeto_erro.hasClass(constantes.classe_esconde)) objeto_erro.addClass(constantes.classe_esconde);
            }
        }
    }    
}