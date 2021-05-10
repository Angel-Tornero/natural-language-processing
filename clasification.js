/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Inteligencia Artificial Avanzada
 * 
 * @author Ángel Tornero Hernández
 * @date 10 May 2021
 * @brief Clasification
 * @link https://campusingenieriaytecnologia.ull.es/mod/resource/view.php?id=287381
 *
 */

import fs from 'fs';
import readline from 'readline';

const REGEX_ALPHA = /[^a-zá-ú]/gi;
const REGEX_LINKS = /^((?!\.com)(?!\.net)(?!\.org)(?!\.io)(?!<\/)(?!\.in)(?!\.co)(?!\.eu).)*$/gm;

const STOP_WORDS = {
  'able': '',
  'about': '',
  'across': '',
  'after': '',
  'all': '',
  'almost': '',
  'also': '',
  'am': '',
  'among': '',
  'an': '',
  'and': '',
  'any': '',
  'are': '',
  'as': '',
  'at': '',
  'be': '',
  'because': '',
  'been': '',
  'but': '',
  'by': '',
  'can': '',
  'cannot': '',
  'could': '',
  'dear': '',
  'did': '',
  'do': '',
  'does': '',
  'either': '',
  'else': '',
  'ever': '',
  'every': '',
  'for': '',
  'from': '',
  'get': '',
  'got': '',
  'had': '',
  'has': '',
  'have': '',
  'he': '',
  'her': '',
  'hers': '',
  'him': '',
  'his': '',
  'how': '',
  'however': '',
  'if': '',
  'in': '',
  'into': '',
  'is': '',
  'it': '',
  'its': '',
  'just': '',
  'least': '',
  'let': '',
  'like': '',
  'likely': '',
  'may': '',
  'me': '',
  'might': '',
  'most': '',
  'must': '',
  'my': '',
  'neither': '',
  'no': '',
  'nor': '',
  'not': '',
  'of': '',
  'off': '',
  'often': '',
  'on': '',
  'only': '',
  'or': '',
  'other': '',
  'our': '',
  'own': '',
  'rather': '',
  'said': '',
  'say': '',
  'says': '',
  'she': '',
  'should': '',
  'since': '',
  'so': '',
  'some': '',
  'than': '',
  'that': '',
  'the': '',
  'their': '',
  'them': '',
  'then': '',
  'there': '',
  'these': '',
  'they': '',
  'this': '',
  'tis': '',
  'to': '',
  'too': '',
  'twas': '',
  'us': '',
  'wants': '',
  'was': '',
  'we': '',
  'were': '',
  'what': '',
  'when': '',
  'where': '',
  'which': '',
  'while': '',
  'who': '',
  'whom': '',
  'why': '',
  'will': '',
  'with': '',
  'would': '',
  'yet': '',
  'you': '',
  'your': ''
}

const main = async function() {
  let HCategory = {};
  let BCategory = {};
  let CCategory = {};
  let ECategory = {};

  //file reading H
  let fileStream = fs.createReadStream('./aprendizaje/aprendizajeH.txt');
  let rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  for await (const line of rl) {
    if (line[0] !== 'P') continue;
    const data = line.split('\t');
    const word = data[0].substr(data[0].indexOf(':') + 1);
    const prob = Number(data[2].substr(data[2].indexOf(':') + 1));
    HCategory[word] = prob;
  }

  //file reading B
  fileStream = fs.createReadStream('./aprendizaje/aprendizajeB.txt');
  rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  for await (const line of rl) {
    if (line[0] !== 'P') continue;
    const data = line.split('\t');
    const word = data[0].substr(data[0].indexOf(':') + 1);
    const prob = Number(data[2].substr(data[2].indexOf(':') + 1));
    BCategory[word] = prob;
  }

  //file reading C
  fileStream = fs.createReadStream('./aprendizaje/aprendizajeC.txt');
  rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  for await (const line of rl) {
    if (line[0] !== 'P') continue;
    const data = line.split('\t');
    const word = data[0].substr(data[0].indexOf(':') + 1);
    const prob = Number(data[2].substr(data[2].indexOf(':') + 1));
    CCategory[word] = prob;
  }

  //file reading E
  fileStream = fs.createReadStream('./aprendizaje/aprendizajeE.txt');
  rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  for await (const line of rl) {
    if (line[0] !== 'P') continue;
    const data = line.split('\t');
    const word = data[0].substr(data[0].indexOf(':') + 1);
    const prob = Number(data[2].substr(data[2].indexOf(':') + 1));
    ECategory[word] = prob;
  }
  
  let output = '';
  fileStream = fs.createReadStream(process.argv[2]);
  rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  for await (const line of rl) {
    let wordsArray = [];
    const description = line.substr(line.indexOf(',') + 1);
    let filterLinks = description.split(' ');
    for (let i = 0; i < filterLinks.length; i++) {
      if (!filterLinks[i].match(REGEX_LINKS)) {
        filterLinks.slice(i, 1);
      } else {
        wordsArray.push.apply(wordsArray, filterLinks[i].split(REGEX_ALPHA).filter(Boolean).filter(word => word.length > 1));
      }
    }
    let filteredArray = [];
    for (let i = 0; i < wordsArray.length; i++) {
      const cleanWord = wordsArray[i].toLowerCase().replace(REGEX_ALPHA, '');
      if (STOP_WORDS[cleanWord] !== undefined) continue;
      filteredArray.push(cleanWord);
    }
    //clasificacion
    let probabilities = {
      'H': 0,
      'B': 0,
      'C': 0,
      'E': 0
    }
    for (let i = 0; i < filteredArray.length; i++) {
      if (!HCategory[filteredArray[i]]) {
        probabilities['H'] += HCategory['UNK'];
      } else {
        probabilities['H'] += HCategory[filteredArray[i]];
      }
    }
    for (let i = 0; i < filteredArray.length; i++) {
      if (!BCategory[filteredArray[i]]) {
        probabilities['B'] += BCategory['UNK'];
      } else {
        probabilities['B'] += BCategory[filteredArray[i]];
      }
    }
    for (let i = 0; i < filteredArray.length; i++) {
      if (!CCategory[filteredArray[i]]) {
        probabilities['C'] += CCategory['UNK'];
      } else {
        probabilities['C'] += CCategory[filteredArray[i]];
      }
    }
    for (let i = 0; i < filteredArray.length; i++) {
      if (!ECategory[filteredArray[i]]) {
        probabilities['E'] += ECategory['UNK'];
      } else {
        probabilities['E'] += ECategory[filteredArray[i]];
      }
    }

    const probabilitiesArray = Object.entries(probabilities);
    let greater = probabilitiesArray[0];
    for (let i = 1; i < probabilitiesArray.length; i++) {
      if (probabilitiesArray[i][1] > greater[1]) {
        greater = probabilitiesArray[i];
      }
    }
    console.log(greater);
  }
}

main();