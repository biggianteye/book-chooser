import 'dotenv/config';
import * as fs from 'fs';

import { ExportBook } from './types';
import { Spreadsheet } from './spreadsheet';

async function main() {
    if (!process.env.SHEET_ID) {
        console.error('Missing SHEET_ID environment variable. Please set it to the ID of the Google Sheet to export from.');
        process.exit(1);
    }

    const spreadsheet = await Spreadsheet.create(process.env.SHEET_ID);
    const books = await spreadsheet.parse();

    const exportBooks = [];
    books.forEach((book) => {
        exportBooks.push(new ExportBook(book));
    });

    fs.writeFileSync('./data.json', JSON.stringify(exportBooks, null, 2), 'utf-8');
}

main();
