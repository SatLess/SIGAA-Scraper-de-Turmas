const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { tableParser } = require('puppeteer-table-parser')
const file_saver = require('node:fs');
puppeteer.use(StealthPlugin());

const SELECTOR_GRADUACAO = "select[id='formTurma:inputNivel']";
const SELECTOR_UNIDADE = "select[id='formTurma:inputDepto']";
const SELECTOR_PERIODO = "select[id='formTurma:inputPeriodo']";
const SELECTOR_BUSCAR = "input[name='formTurma:j_id_jsp_1370969402_11']";
const SELECTOR_TABELA = "table[class='listagem']"
let qtd_unidades = 0

async function scrape_disciplinas(unidade_idx, page) {
    
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
        }
    ],
      rowTransform: (row, getColumnIndex) => {
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
      newLine: ";",
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
    let result = data.join(";").replaceAll("\n", " & ").replaceAll(";","\n").replaceAll("\n\n","\n") //Pra professores 
    file_saver.writeFile("tabelas_csv/" + nome_unidade.replace(/[$&+,:;=?@#|'<>.^*()%!-]/i, "").concat(".txt"), result, err => {if (err) {console.log(err)}})
}

async function run() {

const browser = await puppeteer.launch({headless:false});
const page = await browser.newPage();
await page.goto('https://sigaa.unb.br/sigaa/public/turmas/listar.jsf');


await page.waitForSelector(SELECTOR_GRADUACAO);
await page.evaluate((selector) => {
    document.querySelector(selector).selectedIndex = 2; //ID da graduacao
}, SELECTOR_GRADUACAO)

await page.waitForSelector(SELECTOR_UNIDADE)
qtd_unidades = await page.evaluate((selector) => {
    let botao_unidade = document.querySelector(selector)
    return botao_unidade.options.length
}, SELECTOR_UNIDADE)

await page.waitForSelector(SELECTOR_PERIODO)
await page.evaluate((selector) => {
    document.querySelector(selector).selectedIndex = 3; //ID semestre de verão
}, SELECTOR_PERIODO)

for (let i = 1; i < qtd_unidades; i++ ){
    await scrape_disciplinas(i, page)
}
}

run()
