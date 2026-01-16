
const { tableParser } = require('puppeteer-table-parser')
const file_saver = require('node:fs');

const SELECTOR_UNIDADE = "select[id='formTurma:inputDepto']";
const SELECTOR_BUSCAR = "input[name='formTurma:j_id_jsp_1370969402_11']";
const SELECTOR_TABELA = "table[class='listagem']"

module.exports = {
 scrape_disciplinas: async function (unidade_idx, page, ano_escolhido, periodo_escolhido) {
    await page.waitForSelector(SELECTOR_BUSCAR)
    await page.waitForSelector(SELECTOR_UNIDADE)
    const nome_unidade = await page.evaluate((selector_unidade, selector_buscar, idx) => {
        let unidade = document.querySelector(selector_unidade)
        unidade.selectedIndex = idx
        let nome = unidade.options[idx].text
        document.querySelector(selector_buscar).click(); 
        return nome
}, SELECTOR_UNIDADE,SELECTOR_BUSCAR, unidade_idx)
    await page.waitForNavigation()
    
    //Checa se o departamento possui ao menos uma matéria conforme os filtros escolhidos.
    const allowed = await page.evaluate((selector) => document.querySelector(selector) != null, SELECTOR_TABELA)
    if (allowed === false) {return}

    const data = await tableParser(page, {
      selector: SELECTOR_TABELA,
      allowedColNames: {
        'Código': 'Indice da Turma',
        'Ano-Período': 'Ano-Período',
        'Docente': 'Docente',
        'Horário': 'Horário',
        'Qtde Vagas Ofertadas': 'Qtde Vagas Ofertadas',
        'Qtde Vagas Ocupadas': 'Qtde Vagas Ocupadas',
        'Local': 'Local' //TODO local nao funciona no momento
      },
        extraCols: [
        {
        colName: 'Código da Disciplina',
        data: '',
        position: 0,
        },
        {
            colName: 'Nome Disciplina',
            data: '',
            position: 1
        },
    ],
      rowTransform: (row, getColumnIndex) => {
        // Remove o nome e o código da disciplina do número da turma e os colocam em suas respectivas colunas.
        if (isNaN(row[getColumnIndex('Indice da Turma')])){
            let string = row[getColumnIndex('Indice da Turma')]
            row[getColumnIndex('Código da Disciplina')] = string.slice(0, string.indexOf(" "))
            row[getColumnIndex('Nome Disciplina')] = string.slice(string.search(/- ./i) + 2, string.length)
            delete row[getColumnIndex('Indice da Turma')]
        }
        if (row[getColumnIndex('Qtde Vagas Ofertadas')] === ""){
            row[getColumnIndex('Qtde Vagas Ofertadas')] = row[getColumnIndex('Qtde Vagas Ofertadas') + 1]
        }
      },
      newLine: ";", //Resolve Bug quando há mais um '\n' dentro de uma coluna.
      asArray: true,
      rowValuesAsArray: true,
      csvSeparator: ',',
    });
    for (let i = 0; i < data.length; i++){
        if (data[i][0] === ''){
            data[i][0] = data[i-1][0]
        }
        if (data[i][1] === ''){
            data[i][1] = data[i-1][1]
        }
        if ( i > 1 && data[i-1].length == 2){
               delete data[i-1]
        }
    }

let result = data.join(";").replaceAll("\n", " & ").replaceAll(";","\n").replaceAll("\n\n","\n")
let folderName = `tabelas_csv/${ano_escolhido}-${periodo_escolhido+1}/`

try {
  if (!file_saver.existsSync(folderName)) {
    file_saver.mkdirSync(folderName);
  }
} catch (err) {
  console.error(err);
}
    file_saver.writeFile(folderName + nome_unidade.replace(/[\//$&+,:;=?@#|'<>.^*()%!-]/g, "").concat(".csv"), result, err => {if (err) {console.log(err)}})
    }

}