import fs from 'fs/promises';

const main = async () => {
  try {
    const fileContent = await fs.readFile('instrukce.txt');
    const number = Number(fileContent.toString());

    if (isNaN(number)) throw new Error('File content is not a number');

    const dir = 'vystupy';
    await fs.mkdir(dir, { recursive: true });

    const promises = [];
    for (let i = 0; i <= number; i++) {
      promises.push(
        fs.writeFile(`${dir}/${i}.txt`, `Soubor ${i}`).then(() => {
          console.log(`Soubor ${i} vytvořen`);
        }),
      );
    }
    await Promise.all(promises);

    console.log(`Úspěšně vytvořeno ${number + 1} souborů.`);
  } catch (err) {
    console.error('Chyba', err);
  }
};

main();
