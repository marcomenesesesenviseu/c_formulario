# c_formulario
Módulo JavaScript para criar formulários com validação dinâmica. <br>
Última versão: 1.6 <br>
Atualizada em **17/04/2024**

5 ficheiros contituem o módulo
- atributos.js (não é mais necessário) **(UPDATE)**
- b5toast.js
- c_formulario.css
- c_formulario.json
- c_formulario.js

Desenvolvido para ser código aberto por forma a qualquer pessoa poder acresentar ou alterar funcionalidades. <br>
Ainda estou a trabalhar para melhorar o código. <br>
Esta já é uma versão terminada, mas com várias funcionalidades a serem incremendadas. <br> **(UPDATE)**
Caso detetem algum problema, enviem email para emes3soft@gmail.com com a descrição o mais detalhada possível. <br>

# Outros módulos necessários

JQuery     https://jquery.com/download/ <br>
toast      https://github.com/AucT/b5toast <br>
bootstrap  https://getbootstrap.com/docs/5.3/getting-started/download/ <br>

# Validações desta última versão

Consegue fazer testes:
  - ao conteúdo (val, value)
  - ao tamanho (length, len)
  - à complexidade do texto (passe, complexaty), muito útil para as palavras-passe ** NEW **
  - se um ip é válido (ip, valip) ** NEW **
  - se um url é válido (url, valurl) ** NEW **
  - se um caixa de verificação está ou não marcada (checked, check), devolvendo true se estiver marcada ou false caso não esteja marcada
  - à inclusão de texto (includes(texto)), devolvendo true caso exista o texto ou false caso não exista
  - à inclusão de texto (indexof(texto)), devolvendo a posição do texto a procurar no value da tag, caso não encontre devolve -1
  - teste a um grupo de objetos (só funciona o len e só avalia checkboxs) < _ainda em teste_ >
  - se é ou não um email válido (email, valemail)
  - pode utilizar o operador **||** (ou) ou **&&** (e) para testar mais do que um elemento do formulário na mesma validação
  - pode efetuar pedidos de dados a uma base de dados através de liguagens de programação de servidor (PHP, Python, ...) através da definição do link e da passagem dos dados (data_address)
    - Estrutura: data_address((<ligação ao ficheiro>;;<dados enviados para a ligação com a configuração de dicionário>))
    - Dicionário em javascript do tipo JSON é {"<nome da variável 1>": "<valor da variável 1>", "<nome da variável 2>": "<valor da variável 2>", ...}
  - pode efetuar pedidos de dados a uma base de dados através de liguagens de programação de servidor (PHP, Python, ...) através da definição do link e do id do formulário (form_address)
    - Estrutura: form_address((<ligação ao ficheiro>;;<id do formulário>))

# Associar formulário

Linha para criar a associação do formulário:
- const <variável_para_o_formulário> = new c_formulario(<id_do_formulário>, *<ligação para o ficheiro json de erros personalizado>);
  - * não obrigatório
  - Ainda não funcional (possivelmente disponível na próxima versão)

# Associar validações

Linha para associar validações ao formulário:
- Função Adiciona_Validacoes(<id_do_objeto onde colocar o erro>, <condição ou condições a testar>, <texto a escrever caso a condição se verifique>) funciona com a entrada de um vetor de 3 elementos **UPDATE**
  - id do objeto html
    - ao referir-se a um grupo de elementos deve colocar na tag o carater _?_, para saber que a tag engloba um conjunto de outras tags
  - condição (comparação)
    - caso se queira referir a um objeto html, deve colocar o seu id entre « e »
      - ao referir-se a um grupo de elementos deve colocar na tag o carater _?_, para saber que a tag engloba um conjunto de outras tags
    - deve ter um operador condicional (<, >, ==, <=, >=, !=, !==, ===, !)
      - se usar o _includes_ ou o _email_ não necessita de comparação, pois sairá um valor _true_ ou _false_ **(UPDATE)**
    - pode inserir valores para a comparação, colocando-os diretamente como faz numa qualquer comparação em javascript
    - a sua totalidade deve ficar entre aspas
      - Exemplo: "«txtUtilizador.val» == ''" ou "«txtUtilizador.value» == ''"
    - caso necessite de testar o comprimento do valor de um objeto
      - Exemplo: "«txtPalavraPasse.length» < 10" ou "«txtPalavraPasse.len» < 10"
    - caso necessite testar a marcação de uma caixa de verificação **
      - Exemplo: "«txtUtilizador.checked»" ou "«txtUtilizador.checked» == true" ou "!«txtUtilizador.checked»" ou "«txtUtilizador.checked == false»"
    - caso necessite testar a inclusão de texto (includes(texto))
      - Exemplo: "«txtUtilizador.includes('abc')»" ou "!«txtUtilizador.includes('abc')»"
    - caso necessite testar a inclusão de texto (indexof(texto))
      - Exemplo: "«txtUtilizador.indexof('abc') > -1»"
    - caso necessite testar um grupo de objetos
      - Exemplo: f_Login.Adiciona_Validacoes(["chkTipo_?", "«chkTipo_?.length» == 0", "* Tem de assinalar pelo menos uma das opções!"]); **(UPDATE)**
    - caso necessite de validar um campo de email ou correio eletrónico
      - Exemplo: "!«txtUtillizador.email»" ou "!«txtUtilizador.valEmail»"
    - caso necessite de pedido de valores a uma base de dados através da passagem de valores  **(NEW)**
      - Exemplo: f_Login.Adiciona_Validacoes(["txtPasse",`«data_address((**/pedidos/dados.php**;;**{"txtUtil": «txtUtil.val», "txtPasse": «txtPasse.val»}**))» != 1`, "* Utilizador ou palavra-passe inválidos"]);  **(NEW)**
      - **NOTA:** Deve utilizar a acentuação grave (`) ou as plicas (') para delimitar a(s) condição(ões), pois os valores a passar para o data_address necessitam de estar dentro de aspas (") e não de plicas (') (recomendo a acentuação grave) **(NEW)**
    - caso necessite de pedido de valores a uma base de dados através da passagem de todos os dados de um formulário **(NEW)**
      - Exemplo: f_Login.Adiciona_Validacoes(["txtPasse",`«form_address((**/pedidos/dados.php**;;**frmEntrada**))» != 1`, "* Utilizador ou palavra-passe inválidos"]); **(NEW)**
      - **NOTA:** Aqui pode utilizar a acentuação grave (`) ou as plicas (') ou as aspas (") para delimitar a(s) condição(ões), pois não existem valores a passar para o form_address (recomendo a acentuação grave) **(NEW)**
  - texto de erro a apresentar
    - para que o texto do erro apareça a condição tem de se verificar, ou seja, ser verdadeira
    - não existe a necessidade de criar <div> para o erro, pois é criada automaticamente caso a(s) condição(ões) do erro se verifiquem (condição verdadeira) **(UPDATE)**
    - contudo, pode criar um div no formulário por cada objeto html de entrada de dados, para que o erro possa a aparecer
      - id deve começar por erro_<nome_do_objeto> 
      - devem ser-lhe atribuídas as classes
        - esconde_c_formulario (esconde o objeto)
        - erro_c_formulario (formatação onde aparece o erro)
      - Exemplo:
        <input id="txtUtilizador" type="text" />
        <div id="erro_txtUtilizador" class="esconde_c_formulario erro_c_formulario"></div>

# Lógica das validações

Quando existe mais de que uma validação de um mesmo objeto (referenciado pelo seu id), estas são validadas pela ordem inserida. <br>
Imagine-se 3 validações para um objeto:
  - se a primeira der erro, as outras duas seguintes são ignoradas (não as valida), aparecendo o texto do erro da primeira validação;
  - só a segunda dá erro, a terceira é ignorada, aparecendo o texto do erro da segunda validação;
  - se as três não derem erro, o objeto é validado e desaparece a tag de erro.

# Exemplo completo

Ficheiros disponíveis na pasta **exemplo**.
