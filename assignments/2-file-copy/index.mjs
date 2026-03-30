import { readFile, writeFile } from 'fs/promises';

async function getInstructions(instructionsFileName) {
  try {
    const instructionsFileContent = (
      await readFile(instructionsFileName)
    ).toString();

    const [inputFileName, outputFileName] = instructionsFileContent.split(',');

    return { inputFileName, outputFileName };
  } catch (error) {
    throw new Error('Nepodařilo se získat instrukce.', error);
  }
}

async function getInput(inputFileName) {
  try {
    const inputFileContent = (await readFile(inputFileName)).toString();
    return inputFileContent;
  } catch (error) {
    throw new Error('Nepodařilo se získat vstup.', error);
  }
}

async function writeOutput(outputFileName, dataToWrite) {
  try {
    await writeFile(outputFileName, dataToWrite);
  } catch (error) {
    throw new Error('Nepodařilo se zapsat výstup.', error);
  }
}

async function main() {
  const { inputFileName, outputFileName } =
    await getInstructions('instrukce.txt');
  console.log(
    'Získány instrukce\n',
    `Vstupní soubor: ${inputFileName}\n`,
    `Výstupní soubor: ${outputFileName}`,
  );

  const inputToCopy = await getInput(inputFileName);
  console.log(`Obsah vstupního souboru: ${inputToCopy}`);

  await writeOutput(outputFileName, inputToCopy);
  console.log('Výstupní soubor s obsahem úspěšně vytvořen.');
}

main();
