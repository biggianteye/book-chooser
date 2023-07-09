import { GoogleSpreadsheet } from 'google-spreadsheet';
import { Authorize } from './authorisation';
import 'dotenv/config';
import { Book, Tag } from './types';
import { Chooser } from './chooser';

async function main() {
    // Initialize the OAuth2Client with your app's oauth credentials
    const oauthClient = await Authorize();

    const doc = new GoogleSpreadsheet(process.env.SHEET_ID, oauthClient);

    // loads document properties and worksheets
    await doc.loadInfo();

    const booksSheet = doc.sheetsByTitle['Books'];
    const bookRows = await booksSheet.getRows();
    const books: Book[] = [];
    bookRows.forEach((row) => {
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

    const tagsSheet = doc.sheetsByTitle['Tags'];
    const tagRows = await tagsSheet.getRows();
    const tags: Tag[] = [];
    tagRows.forEach((row) => {
        tags.push(new Tag(row.get('Name'), row.get('Modifier')));
    });

    const chooser = new Chooser();
    const choice = chooser.choose(books);
    console.log(`'${choice.title}' by ${choice.author}.`);
}

main();
