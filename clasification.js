import fs from 'fs';
import readline from 'readline';

const main = async function() {
  let HCategory = {};
  let BCategory = {};
  let CCategory = {};
  let ECategory = {};

  //file reading H
  const fileStream = fs.createReadStream('./aprendizaje/aprendizajeH.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  for await (const line of rl) {
    if (line[0] !== 'P') continue;
    const data = line.split('\t');
    const word = data[0].substr(data[0].indexOf(':') + 1);
    const prob = data[2].substr(data[2].indexOf(':') + 1);
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
    const data = line.split(' ');
    const word = data[0].substr(data[0].indexOf(':') + 1);
    const prob = data[2].substr(data[2].indexOf(':') + 1);
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
    const data = line.split(' ');
    const word = data[0].substr(data[0].indexOf(':') + 1);
    const prob = data[2].substr(data[2].indexOf(':') + 1);
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
    const data = line.split(' ');
    const word = data[0].substr(data[0].indexOf(':') + 1);
    const prob = data[2].substr(data[2].indexOf(':') + 1);
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
  }
}

main();