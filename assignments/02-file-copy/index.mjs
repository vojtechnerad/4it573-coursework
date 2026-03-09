import fs from 'fs';

fs.readFile('instrukce.txt', (err, data) => {
  if (err) {
    console.err(err);
    exit();
  }

  const [inputFileName, outputFileName] = data.toString().split(',');

  fs.readFile(inputFileName, (err, data) => {
    if (err) {
      console.err(err);
      exit();
    }

    console.log(data.toString());

    fs.writeFile(outputFileName, data.toString(), (err) => {
      if (err) return 'aaaa';
      console.log('yay');
    });
  });
});
