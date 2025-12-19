const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const SELECTOR_GRADUACAO = "select[id='formTurma:inputNivel']";
const SELECTOR_UNIDADE = "select[id='formTurma:inputDepto']";
const SELECTOR_PERIODO = "select[id='formTurma:inputPeriodo']";
const SELECTOR_BUSCAR = "input[name='formTurma:j_id_jsp_1370969402_11']";
const SELECTOR_TABELA = "table[class='listagem']"
let lista_unidades = [];

async function scrape_disciplinas(unidade_idx, page) {
    await page.waitForSelector(SELECTOR_BUSCAR)
    await page.waitForSelector(SELECTOR_UNIDADE)
    await page.evaluate((selector_unidade, selector_buscar, idx) => {
        document.querySelector(selector_unidade).selectedIndex = idx
        document.querySelector(selector_buscar).click(); 
}, SELECTOR_UNIDADE,SELECTOR_BUSCAR, unidade_idx)
    await page.waitForNavigation()
    await tableToCSV(page)
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
await page.evaluate((selector) => {
    let botao_unidade = document.querySelector(selector)
    lista_unidades = botao_unidade.options
}, SELECTOR_UNIDADE)

await page.waitForSelector(SELECTOR_PERIODO)
await page.evaluate((selector) => {
    document.querySelector(selector).selectedIndex = 3; //ID semestre de verão
}, SELECTOR_PERIODO)

for (i = 1; i <= 1; i++ ){
    await scrape_disciplinas(i, page)
}
}

run()
