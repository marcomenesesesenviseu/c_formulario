# c_formulario
Módulo JavaScript para criar formulários com validação dinâmica.
Última versão: 1.01

3 ficheiros necessários
- c_formulario.css
- c_formulario.json
- c_formulario.js

Desenvolvido para ser código aberto por forma a poderem acresentar ou alterar funcionalidades. (UPDATE)
Ainda estou a trabalhar para melhorar o código.
Esta já é uma versão funcional, ainda com funcionalidades a serem preparadas. (UPDATE)
Caso detetem algum problema, enviem email para emes3soft@gmail.com com a descrição o mais detalhada possível.

# Outros módulos necessários

JQuery     https://jquery.com/download/
toast      https://github.com/AucT/b5toast
bootstrap  https://getbootstrap.com/docs/5.3/getting-started/download/

# Limitações desta versão

Consegue fazer testes:
  - ao conteúdo (val, value)
  - ao tamanho (length, len)
  - se um caixa de verificação está ou não marcada (checked, check), devolvendo true se estiver marcada ou false caso não esteja marcada **(NEW)**
  - à inclusão de texto (includes(texto)), devolvendo true caso exista o texto ou false caso não exista **(NEW)**
  - à inclusão de texto (indexof(texto)), devolvendo a posição do texto a procurar no value da tag, caso não encontre devolve -1 **(NEW)**
  - teste a um grupo de objetos (só funciona o len e só avalia checkboxs) < _ainda em teste_ > **(NEW)**

~~Só permite ter uma verificação por validação.~~ **(FIXED)**

# Associar formulário

Linha para criar a associação do formulário:
- const <variável_para_o_formulário> = new formulario(<id_do_formulário>);

# Associar validações

Linha para associar validações ao formulário:
- Função Adiciona_Validacoes() funciona com a entrada de um vetor de 3 elementos
  - id do objeto html
    - ao referir-se a um grupo de elementos deve colocar na tag o carater _?_, para saber que a tag engloba um conjunto de outras tags **(NEW)**
  - condição (comparação)
    - caso se queira referir a um objeto html, deve colocar o seu id entre « e »
      - ao referir-se a um grupo de elementos deve colocar na tag o carater _?_, para saber que a tag engloba um conjunto de outras tags **(NEW)**
    - deve ter um operador condicional (<, >, ==, <=, >=, !=, !==, ===, !)
      - se usar o _includes_ não necessita de comparação, pois sairá um valor _true_ ou _false_ **(NEW)**
    - pode inserir valores para a comparação, colocando-os diretamente como faz numa qualquer comparação em javascript
    - a sua totalidade deve ficar entre aspas
      - Exemplo: "«txtUtilizador» == ''" ou "«txtUtilizador.val» == ''" ou "«txtUtilizador.value» == ''" **(UPDATED)**
    - caso necessite de testar o comprimento do valor de um objeto
      - Exemplo: "«txtPalavraPasse.length» < 10" ou "«txtPalavraPasse.len» < 10" **(UPDATED)**
    - caso necessite testar a marcação de uma caixa de verificação **(NEW)**
      - Exemplo: "«txtUtilizador.checked»" ou "«txtUtilizador.checked» == true" ou "!«txtUtilizador.checked»" ou "«txtUtilizador.checked == false»"
    - caso necessite testar a inclusão de texto (includes(texto)) **(NEW)**
      - Exemplo: "«txtUtilizador.includes('abc')»" ou "!«txtUtilizador.includes('abc')»"
    - caso necessite testar a inclusão de texto (indexof(texto)) **(NEW)**
      - Exemplo: "«txtUtilizador.indexof('abc') > -1»"
    - caso necessite testar um grupo de objetos **(NEW)**
      - Exemplo: "«chkTipo_?.length» == 0"
  - texto de erro a apresentar
    - para que o texto do erro apareça a condição tem de se verificar, ou seja, ser verdadeira
    - deve criar um div no formulário por cada objeto html de entrada de dados, para que o erro possa a aparecer (passo a eliminar ma próximas versões)
      - id deve começar por erro_<nome_do_objeto>
      - devem ser-lhe atribuídas as classes
        - esconde_c_formulario (esconde o objeto) **(UPDATED)**
        - erro_c_formulario (formatação onde aparece o erro) **(UPDATED)**
      - Exemplo:
        <input id="txtUtilizador" type="text" />
        <div class="esconde_c_formulario erro_c_formulario" id="erro_txtUtilizador"></div> **(UPDATED)**

# Lógica das validações (NEW)

Quando existe mais de que uma validação de um mesmo objeto (referenciado pelo seu id), estas são validadas pela ordem inserida.
Imagine-se 3 validações para um objeto:
  - se a primeira der erro, as outras duas seguintes são ignoradas (não as valida), aparecendo o texto do erro da primeira validação;
  - só a segunda dá erro, a terceira é ignorada, aparecendo o texto do erro da segunda validação;
  - se as três não derem erro, o objeto é validado e desaparece a tag de erro.

# Exemplo completo (UPDATED)
Formulário no ficheiro index.html e adição dos ficheiro necessários:

<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <title>Exemplo C_FORMULARIO</title>
  </head>
  
  <body>
    <form id="frmLogin">
      <input id="txtUtilizador" class="form-control" type="text" />
      <div class="esconde_c_formulario erro_c_formulario" id="erro_txtUtilizador"></div>
      <br/>
      <input id="txtPalavraPasse" class="form-control" type="password" />
      <div class="esconde_c_formulario erro_c_formulario" id="erro_txtPalavraPasse"></div>
      <br/>
      <input id="chkPolitica" class="form-check-input" type="checkbox" />
      <label>Concordo com as políticas do site</label>
      <br/>
      <div class="esconde_c_formulario erro_c_formulario" id="erro_chkPolitica"></div>
      <br/>
      <br/>
      <button id="butValidar" type="submit">Validar</button>
    </form>
    
    <script src="https://code.jquery.com/jquery-3.7.1.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    <script src="/js/b5toast.js"></script> <!-- criar a pasta js, efetuar o download, copiar para a pasta js o ficheiro -->
    <script src="/cformulario/c_formulario.js"></script>
    <script src="/js/index.js"></script>
  </body>
</html>

Ficheiro javascript - index.js (pasta js):

// Associa o formulário à class c_formulario
  const f_Login = new c_formulario("frmLogin");

// Adição das validações ao formulário:
  f_Login.Adiciona_Validacoes(["txtUtilizador","«txtUtilizador» == ''", "* Obrigatório"]);
  f_Login.Adiciona_Validacoes(["txtUtilizador","«txtUtilizador.indexof(',')» > -1", "* O nome do utilizador não pode conter o carater ,!"]);
  f_Login.Adiciona_Validacoes(["txtPalavraPasse","«txtPalavraPasse» < 6", "* A palavra-passe tem de ter pelo menos 10 digitos"]);
  f_Login.Adiciona_Validacoes(["txtPalavraPasse","«txtPalavraPasse.includes(';')», "* A palavra-passe contém carateres inválidos!"]);
  f_Login.Adiciona_Validacoes(["chkPolitica","!«chkPolitica.checeked», "* É obrigatório concordar com as políticas para entrar!"]);

// Teste das validações ao submeter o formulário
  $("#frmLogin").on("submit", function() {
    if (!f_Login.Testa_Validacoes())
      alert('O formulário será enviado!);
  })
