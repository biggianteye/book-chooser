import 'dotenv/config';
import { Chooser } from './chooser';
import { Spreadsheet } from './spreadsheet';

async function main() {
    const spreadsheet = await Spreadsheet.create(process.env.SHEET_ID);
    const books = await spreadsheet.parse();

    const chooser = new Chooser();
    const choice = chooser.choose(books);

    console.log(`${choice}`);
}

main();
