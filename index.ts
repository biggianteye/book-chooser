import { GoogleSpreadsheet } from 'google-spreadsheet';
import { Authorize } from './authorisation';
import 'dotenv/config';
import { Book } from './types';
import { Chooser } from './chooser';

async function main() {
    // Initialize the OAuth2Client with your app's oauth credentials
    const oauthClient = await Authorize();

    const doc = new GoogleSpreadsheet(process.env.SHEET_ID, oauthClient);

    // loads document properties and worksheets
    await doc.loadInfo();

    // Just grab the first available book title for now.
    const booksSheet = doc.sheetsByTitle['Books'];
    const rows = await booksSheet.getRows();
    const books: Book[] = [];
    rows.forEach((row) => {
        books.push(
            new Book(
                row.get('Title'),
                row.get('Author'),
                row.get('Year published'),
                row.get('Goodreads link'),
                row.get('Goodreads rating')
            )
        );
    });

    const chooser = new Chooser();
    const randomBook = chooser.choose(books);
    console.log(`'${randomBook.title}' by ${randomBook.author}.`);
}

main();
