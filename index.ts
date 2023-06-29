import { GoogleSpreadsheet } from 'google-spreadsheet';
import { Authorize } from './authorisation.js';
import 'dotenv/config';

async function main() {
    // Initialize the OAuth2Client with your app's oauth credentials
    const oauthClient = await Authorize();
}

main();
