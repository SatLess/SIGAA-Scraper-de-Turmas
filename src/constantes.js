module.exports = Object.freeze({
    
    SELECTOR_GRADUACAO : "select[id='formTurma:inputNivel']",
    SELECTOR_UNIDADE : "select[id='formTurma:inputDepto']",
    SELECTOR_ANO : "input[id='formTurma:inputAno']",
    SELECTOR_PERIODO : "select[id='formTurma:inputPeriodo']",
 
    SEMESTRE : {
        '1': 0, // Primeiro Semestre
        '2': 1, // Segundo Semestre
        'V': 3, // Semestre de verão
    }, 

    NIVEL_ENSINO : {
        'T': 0, //Todos os níveis de ensino
        'FC': 1, //Formação Complementar
        'G': 2, //Graduação
        'E': 3, //Especialização
        'R': 4, //Residência
        'S': 5, //Strico Sensu
        'M': 6, //Mestrado
        'D': 7, //Doutorado
},

    MISC : [
    'HD' //Headless
]
})