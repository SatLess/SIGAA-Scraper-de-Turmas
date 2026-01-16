#!/usr/bin/env node

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const scraper = require('./src/scraper')
const constantes = require('./src/constantes')
let { argv } = require('node:process');

let nivel_ensino_escolhido
let periodo_escolhido 
let ano_escolhido 
let is_headless

async function CLI_parser() {

    if (argv.length < 5){
        console.log("Número de argumentos insuficiente.\nInsira, na Seguinte ordem:\nNivel_Ensino Ano Periodo")
        return
    }
    
    try {
        if (constantes.NIVEL_ENSINO[argv[2].toUpperCase()] === undefined){
            throw new Error("Nível De Ensino Inválido. Inserir apenas Níveis aceitos, como:\n\
        'T' - Todos os níveis de ensino\n \
        'FC' - Formação Complementar\n \
        'G' - Graduação\n \
        'E' - Especialização\n \
        'R' - Residência\n \
        'S' - Strico Sensu\n \
        'M' - Mestrado\n \
        'D' - Doutorado)") 
        }
        if (isNaN(argv[3])){
            throw new Error("Ano inválido. Insira apenas números")
        }
        if (constantes.SEMESTRE[argv[4]] === undefined){
            throw new Error("Periodo Invalido Insira valores aceitos como:\n \
                '1' - Primeiro período\n \
                '2' - Segundo período \n \
                'V' - Semestre de verão")
        }
    } catch (error) {
        console.log(error)
        return
    }
    
    nivel_ensino_escolhido = constantes.NIVEL_ENSINO[argv[2].toUpperCase()]
    ano_escolhido = argv[3]
    periodo_escolhido = constantes.SEMESTRE[argv[4].toUpperCase()]
    is_headless = (argv.length > 5 && constantes.MISC.indexOf(argv[5].toUpperCase()) !== -1) ? false : true 

    await execute()
    console.log('Scrape Finalizado')
}

async function execute() {

    const browser = await puppeteer.launch({headless:is_headless});
    const page = await browser.newPage();
    await page.goto('https://sigaa.unb.br/sigaa/public/turmas/listar.jsf');

    //Seleciona Nível de ensino escolhido
    await page.waitForSelector(constantes.SELECTOR_GRADUACAO);
    await page.evaluate((selector, nivel_ensino) => {
        document.querySelector(selector).selectedIndex = nivel_ensino;
    }, constantes.SELECTOR_GRADUACAO, nivel_ensino_escolhido)

    await page.waitForSelector(constantes.SELECTOR_UNIDADE)
    let qtd_departamentos = await page.evaluate((selector) => {
        let botao_unidade = document.querySelector(selector)
        return botao_unidade.options.length
    }, constantes.SELECTOR_UNIDADE)

    //Seleciona Ano Escolhido
    await page.waitForSelector(constantes.SELECTOR_ANO)
    await page.evaluate((selector, ano) => {
        document.querySelector(selector).value = ano;
    }, constantes.SELECTOR_ANO, ano_escolhido)

    //Seleciona Período Escolhido
    await page.waitForSelector(constantes.SELECTOR_PERIODO)
    await page.evaluate((selector, periodo) => {
        document.querySelector(selector).selectedIndex = periodo;
    }, constantes.SELECTOR_PERIODO, periodo_escolhido)

    for (let i = 0; i < qtd_departamentos; i++ ){
        await scraper.scrape_disciplinas(i, page, ano_escolhido, periodo_escolhido)
        console.clear()
        console.log (Math.round(i/qtd_departamentos * 100) + "%")
    }
}

CLI_parser()


