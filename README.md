# c_formulario
Módulo JavaScript para criar formulários com validação dinâmica.
Última versão: 1.01

3 ficheiros necessários
- c_formulario.css
- c_formulario.json
- c_formulario.js

Desenvolvido para ser código aberto, de forma a poderem acresentar mais funcionalidades.
Neste momento estou a trabalhar para melhorar o seu código.
Esta ainda é uma versão de teste, com algumas funcionalidades limitadas.

# Outros módulos necessários

JQuery     https://jquery.com/download/
toast      https://github.com/AucT/b5toast
bootstrap  https://getbootstrap.com/docs/5.3/getting-started/download/

# Limitações desta versão

(UPDATE)
Consegue fazer testes:
  - ao conteúdo (val, value)
  - ao tamanho (length. len)
  - à inclusão de texto (includes(texto)), devolvendo true ou false
  - à inclusão de texto (indexof(texto)), devolvendo a posição do texto a procurar no value da tag

~~Só permite ter uma verificação por validação.~~ (FIXED)

# Associar formulário

Linha para criar a associação do formulário:
- const <variável_para_o_formulário> = new formulario(<id_do_formulário>);

# Associar validações

Linha para associar validações ao formulário:
- Função Adiciona_Validacoes() funciona com a entrada de um vetor de 3 elementos
  - id do objeto html
  - condição (comparação)
    - caso se queira referir a um objeto html, deve colocar o seu id entre « e »
    - deve ter um operador condicional (<, >, ==, <=, >=, !=, !==, ===, !)
    - pode inserir valores para a comparação, colocando-os diretamente como faz numa qualquer comparação em javascript
    - a sua totalidade deve ficar entre aspas
      - Exemplo: "«txtUtilizador» == ''"
    - caso necessite de testar o comprimento do valor de um objeto
      - Exemplo: "«txtPalavraPasse.length» < 10"
  - texto de erro a apresentar
    - para que o texto do erro apareça a condição tem de se verificar, ou seja, ser verdadeira
    - deve criar um div no formulário por cada objeto html de entrada de dados, para que o erro possa a aparecer (passo a eliminar ma próxima versão)
      - id deve começar por erro_<nome_do_objeto>
      - devem ser-lhe atribuídas as classes
        - esconde_c_formulario (esconde o objeto) (UPDATE)
        - erro_c_formulario (formatação onde aparece o erro) (UPDATE)
      - Exemplo:
        <input id="txtUtilizador" type="text" />
        <div class="esconde_c_formulario erro_c_formulario" id="erro_txtUtilizador"></div>

# Exemplo completo
Formulário no ficheiro html:
  <form id="frmLogin">
    <input id="txtUtilizador" type="text" />
    <div class="esconde erro_formulario" id="erro_txtUtilizador"></div>
    <input id="txtPalavraPasse" type="password" />
    <div class="esconde erro_formulario" id="erro_txtPalavraPasse"></div>
    <button id="butValidar" type="button">Validar</button>
  </form>

Associação do formulário html ao módulo c_formulário no ficheiro javascript:
  const f_Login = new formulario("frmLogin");
  f_Login.Adiciona_Validacoes(["txtUtilizador","«txtUtilizador» == ''", "* Obrigatório"]);
  f_Login.Adiciona_Validacoes(["txtPalavraPasse","«txtPalavraPasse» < 6", "* A palavra-passe tem de ter pelo menos 10 digitos"]);
