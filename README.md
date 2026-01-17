<details>
<Summary>Sobre</summary>

Esse projeto tem como objetivo coletar dados quanto às disciplinas ofertadas pelo SIGAA da Universidade de Brasília a cada semestre, através do site https://sigaa.unb.br/sigaa/public/turmas/listar.jsf. Desse modo, o scraper coleta informações como:

* **Código da disciplina**
* **Turmas**
* **Professor**
* **Horários**
* **Vagas ofertadas** e
* **Vagas ocupadas.**

As disciplinas são postas em arquivos CSV, divididas por departamento. Além disso, há possibilidade de selecionar o **Ano, Período e Nível de Ensino**, conforme necessidade. 
Com o projeto, há a possibilidade de análise e arquivamento de todas as disciplinas ofertadas a cada semestre - tarefas atualmente não triviais quando se utiliza o site do SIGAA diretamente.
</details>

<details><Summary>Dependências</summary>

Para rodar o projeto, foram necessárias:
* **puppeteer**
* **puppeteer-extra**
* **puppeteer-table-parser**
* **node.js**
</details>

<details>

<Summary>Como Rodar</summary>
A aplicação vem com CLI para maior facilidade de uso.
Escreva os argumentos na seguinte ordem: 

``` ./index.js Nivel_Ensino Ano Periodo ```

Por exemplo, para ver todas disciplinas ofertadas no semestre de verão de 2025:
``` ./index.js T 2025 V ```

No final você pode adicionar ```HD``` para opcionalmente ver o browser instanciado enquanto o programa realiza o scraping. 

## Argumentos 
### Nível de Ensino
Para o nível de ensino, as opções estão listadas abaixo:
  * 'T' - Todos os níveis de ensino
  * 'FC' - Formação Complementar
  * 'G' - Graduação
  * 'E' - Especialização
  * 'R' - Residência
  * 'S' - Strico Sensu
  * 'M' - Mestrado
  * 'D' - Doutorado

### Ano
Ano de referencia para o scrape de disciplinas.

### Periodo
São aceitos os períodos:
  * '1' - Primeiro período
  * '2' - Segundo período
  * 'V' - Semestre de verão

### Misc
No final, é possivel adionar argumento opcional para o scraper:
* 'HD' - desabilita modo Headless 

</details>

<details><Summary>Problemas conhecidos</summary>
 Caso o programa no modo Headless pareça não estar funcionando, desabilite o modo headless com `HD` para diagnosticar o problema. 
 A partir daí, caso apareça o Alert dizendo 

> *Não foi possÍvel finalizar a operação, pois a página que se está tentando acessar não está mais ativa. Por favor, reinicie os procedimentos.

Volte à página anterior e funcionará como esperado.
</details>

<Summary>Todo</summary>
  
- [x] criar um CLI para maior facilidade de uso.

</details>
