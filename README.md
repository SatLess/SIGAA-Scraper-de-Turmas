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

-Dependências

Para rodar o projeto, foram necessárias:
* **puppeteer**
* **puppeteer-extra**
* **puppeteer-table-parser**
* **node.js**

-Problemas conhecidos.
Caso apareça o Alerta dizendo *"Não foi possÍvel finalizar a operação, pois a página que se está tentando acessar não está mais ativa. Por favor, reinicie os procedimentos."*, pressione para voltar à página anterior e funcionará como esperado.

-Todo
[] criar um CL para maior facilidade de uso.

