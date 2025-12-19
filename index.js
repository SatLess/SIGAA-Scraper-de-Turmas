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
        'Código': 'Código',
        'Ano-Período': 'Ano-Período',
        'Docente': 'Docente',
        'Qtde Vagas Ofertadas': 'Qtde Vagas Ofertadas',
        'Qtde Vagas Ocupadas': 'Qtde Vagas Ocupadas',
        'Local': 'Local'
      },
      csvSeparator: ','
    });
    file_saver.writeFile("tabelas_csv/" + nome_unidade.replace(/[$&+,:;=?@#|'<>.^*()%!-]/i, ""), data, err => {if (err) {console.log(err)}})
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

for (i = 1; i < qtd_unidades; i++ ){
    await scrape_disciplinas(i, page)
}
}

run()
