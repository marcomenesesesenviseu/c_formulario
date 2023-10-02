# c_formulario
Módulo JavaScript para criar formulários com validação dinâmica.

3 ficheiros necessários
- c_formulario.css
- c_formulario.json
- c_formulario.js

Desenvolvido para ser código aberto, de forma a poderem acresentar mais funcionalidades.
Neste momento estou a trabalhar para melhorar o seu código.
Esta ainda é uma versão de teste, com algumas funcionalidades limitadas.

# Outros módulos necessários

JQuery
https://jquery.com/download/

# Limitações desta versão

- Só consegue fazer testes ao conteúdo (val) e ao tamanho (length);
- Só permite ter uma verificação por validação.

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

# Exemplo completo
Formulário:
 «html»
- Para o objeto <input id="txtUtilizador" /> 
- Adiciona_Validacoes([<id_do_objeto_html>,"«» == ''", "* Obrigatório"])
- <variável_para_o_formulário>.Adiciona_Validacoes([<id_do_objeto_html>,"«txtServidor» == ''", "* Obrigatório"]);
