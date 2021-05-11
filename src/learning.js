/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Inteligencia Artificial Avanzada
 * 
 * @author Ángel Tornero Hernández
 * @date 4 May 2021
 * @brief Learning program
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
 
 let HCategory = {};
 let BCategory = {};
 let CCategory = {};
 let ECategory = {};
 
 let counterCategories = [0, 0, 0, 0];
 let counterDocuments = {
   'H': 0,
   'B': 0,
   'C': 0,
   'E': 0
 };
 
 const extractWords = async function() {
   let fileWords = [];
   const fileStream = fs.createReadStream(FILE_PATH);
   const rl = readline.createInterface({
     input: fileStream,
     crlfDelay: Infinity
   });
   for await (const line of rl) {
     let wordsArray = [];
     const category = line[0];
     counterDocuments[category]++;
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
       switch (category) {
         case 'H':
           if (HCategory[cleanWord] === undefined) {
             HCategory[cleanWord] = 1;
           } else {
             HCategory[cleanWord]++;
           }
           counterCategories[0]++;
           break;
         case 'B':
           if (BCategory[cleanWord] === undefined) {
             BCategory[cleanWord] = 1;
           } else {
             BCategory[cleanWord]++;
           }
           counterCategories[1]++;
           break;
         case 'C':
           if (CCategory[cleanWord] === undefined) {
             CCategory[cleanWord] = 1;
           } else {
             CCategory[cleanWord]++;
           }
           counterCategories[2]++;
           break;
         case 'E':
           if (ECategory[cleanWord] === undefined) {
             ECategory[cleanWord] = 1;
           } else {
             ECategory[cleanWord]++;
           }
           counterCategories[3]++;
           break;
       }
       
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

   //Categoria H
  let string = `Numero de documentos del corpus: ${counterDocuments['H']}\n`;
  string += `Numero de palabras del corpus: ${counterCategories[0]}\n`;

  HCategory['UNK'] = 0;
  for (let i = 0; i < nonRepeatedWords.length; i++) {
    if (HCategory[nonRepeatedWords[i]] === undefined) {
      HCategory['UNK']++;
      continue;
    }
    string += `Palabra:${nonRepeatedWords[i]}\tFrec:${HCategory[nonRepeatedWords[i]]}\tLogProb:${Math.log((HCategory[nonRepeatedWords[i]] + 1) / (counterCategories[0] + nonRepeatedWords.length + 1))}\n`;
  }
  string += `Palabra:UNK\tFrec:${HCategory['UNK']}\tLogProb:${Math.log(1 / (counterCategories[0] + nonRepeatedWords.length + 1))}\n`;
  fs.writeFileSync('aprendizaje/aprendizajeH.txt', string);

  //Categoria B

  string = `Numero de documentos del corpus: ${counterDocuments['B']}\n`;
  string += `Numero de palabras del corpus: ${counterCategories[1]}\n`;

  BCategory['UNK'] = 0;
  for (let i = 0; i < nonRepeatedWords.length; i++) {
    if (BCategory[nonRepeatedWords[i]] === undefined) {
      BCategory['UNK']++;
      continue;
    }
    string += `Palabra:${nonRepeatedWords[i]}\tFrec:${BCategory[nonRepeatedWords[i]]}\tLogProb:${Math.log((BCategory[nonRepeatedWords[i]] + 1) / (counterCategories[1] + nonRepeatedWords.length + 1))}\n`;
  }
  string += `Palabra:UNK\tFrec:${BCategory['UNK']}\tLogProb:${Math.log(1 / (counterCategories[1] + nonRepeatedWords.length + 1))}\n`;
  fs.writeFileSync('aprendizaje/aprendizajeB.txt', string);

  //Categoria C

  string = `Numero de documentos del corpus: ${counterDocuments['C']}\n`;
  string += `Numero de palabras del corpus: ${counterCategories[2]}\n`;

  CCategory['UNK'] = 0;
  for (let i = 0; i < nonRepeatedWords.length; i++) {
    if (CCategory[nonRepeatedWords[i]] === undefined) {
    CCategory['UNK']++;
      continue;
    }
    string += `Palabra:${nonRepeatedWords[i]}\tFrec:${CCategory[nonRepeatedWords[i]]}\tLogProb:${Math.log((CCategory[nonRepeatedWords[i]] + 1) / (counterCategories[2] + nonRepeatedWords.length + 1))}\n`;
  }
  string += `Palabra:UNK\tFrec:${CCategory['UNK']}\tLogProb:${Math.log(1 / (counterCategories[2] + nonRepeatedWords.length + 1))}\n`;
  fs.writeFileSync('aprendizaje/aprendizajeC.txt', string);

  //Categoria E

  string = `Numero de documentos del corpus: ${counterDocuments['E']}\n`;
  string += `Numero de palabras del corpus: ${counterCategories[3]}\n`;

  ECategory['UNK'] = 0;
  for (let i = 0; i < nonRepeatedWords.length; i++) {
    if (ECategory[nonRepeatedWords[i]] === undefined) {
      ECategory['UNK']++;
      continue;
    }
    string += `Palabra:${nonRepeatedWords[i]}\tFrec:${ECategory[nonRepeatedWords[i]]}\tLogProb:${Math.log((ECategory[nonRepeatedWords[i]] + 1) / (counterCategories[3] + nonRepeatedWords.length + 1))}\n`;
  }
  string += `Palabra:UNK\tFrec:${ECategory['UNK']}\tLogProb:${Math.log(1 / (counterCategories[3] + nonRepeatedWords.length + 1))}\n`;
  fs.writeFileSync('aprendizaje/aprendizajeE.txt', string);
}
 
 extractWords();
 