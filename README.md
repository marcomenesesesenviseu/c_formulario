# c_formulario
Módulo JavaScript para criar formulários com validação dinâmica. <br>
Última versão: 1.01 <br>
Atualizada em **29/10/2023**

4 ficheiros contituem o módulo
- c_formulario.css
- c_formulario.json
- c_formulario.js
- c_formulario.min.js

Desenvolvido para ser código aberto por forma a qualquer pessoa poder acresentar ou alterar funcionalidades. **(UPDATE)** <br>
Ainda estou a trabalhar para melhorar o código. <br>
Esta já é uma versão funcional, ainda com funcionalidades a serem preparadas. **(UPDATE)** <br>
Caso detetem algum problema, enviem email para emes3soft@gmail.com com a descrição o mais detalhada possível. <br>

# Outros módulos necessários

JQuery     https://jquery.com/download/ <br>
toast      https://github.com/AucT/b5toast <br>
bootstrap  https://getbootstrap.com/docs/5.3/getting-started/download/ <br>

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
- const <variável_para_o_formulário> = new c_formulario(<id_do_formulário>);

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

Quando existe mais de que uma validação de um mesmo objeto (referenciado pelo seu id), estas são validadas pela ordem inserida. <br>
Imagine-se 3 validações para um objeto:
  - se a primeira der erro, as outras duas seguintes são ignoradas (não as valida), aparecendo o texto do erro da primeira validação;
  - só a segunda dá erro, a terceira é ignorada, aparecendo o texto do erro da segunda validação;
  - se as três não derem erro, o objeto é validado e desaparece a tag de erro.

# Exemplo completo (UPDATED)

Ficheiros disponíveis na pasta **exemplo**.
