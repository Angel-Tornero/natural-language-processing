/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Inteligencia Artificial Avanzada
 * 
 * @author Ángel Tornero Hernández
 * @date 21 Abr 2021
 * @brief Vocabulary creation
 * @link https://campusingenieriaytecnologia.ull.es/mod/resource/view.php?id=287381
 *
 */

import fs from 'fs';
import readline from 'readline';

const FILE_PATH = './ecom-train.csv';
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

const extractWords = async function() {
  let fileWords = [];
  const fileStream = fs.createReadStream(FILE_PATH);
  const rl = readline.createInterface({
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
    fileWords.push.apply(fileWords, filteredArray);
  }
  fileWords.sort();
  let count = {};
  let lastWord = "";
  const nonRepeatedWords = [];
  for (let i = 0; i < fileWords.length; i++) {
    if (fileWords[i] === lastWord) {
      count[fileWords[i]]++;
      continue;
    }
    nonRepeatedWords.push(fileWords[i]);
    count[fileWords[i]] = 1;
    lastWord = fileWords[i];
  }
  console.log(`Numero de palabras: ${nonRepeatedWords.length}`);
  for (let i = 0; i < nonRepeatedWords.length; i++) {
    console.log(nonRepeatedWords[i]);
  }
}

extractWords();
