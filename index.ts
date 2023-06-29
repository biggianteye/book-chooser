import { GoogleSpreadsheet } from 'google-spreadsheet';
import { Authorize } from './authorisation.js';
import 'dotenv/config';

async function main() {
    // Initialize the OAuth2Client with your app's oauth credentials
    const oauthClient = await Authorize();

    const doc = new GoogleSpreadsheet(process.env.SHEET_ID, oauthClient);

    // loads document properties and worksheets
    await doc.loadInfo();

    // Just grab the first available book title for now.
    const booksSheet = doc.sheetsByTitle["Books"];
    const rows = await booksSheet.getRows({ limit: 1 });
    const title = rows[0].get('Title');
    const author = rows[0].get('Author');
    console.log(`'${title}' by ${author}.`);
}

main();
