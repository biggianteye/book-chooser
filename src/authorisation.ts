// Adapted from https://developers.google.com/sheets/api/quickstart/nodejs

import * as fs from 'fs/promises';
import * as path from 'path';
import { authenticate } from '@google-cloud/local-auth';
import { OAuth2Client } from 'google-auth-library';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorisation flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorised credentials from the save file.
 */
async function loadSavedCredentialsIfExist(): Promise<OAuth2Client | null> {
    try {
        const [credentialsContent, tokenContent] = await Promise.all([
            fs.readFile(CREDENTIALS_PATH, 'utf8'),
            fs.readFile(TOKEN_PATH, 'utf8'),
        ]);

        const credentials = JSON.parse(credentialsContent)
        const token = JSON.parse(tokenContent);

        const credentialsKey = credentials.installed || credentials.web;

        const client = new OAuth2Client(
            credentialsKey.client_id,
            credentialsKey.client_secret,
            credentialsKey.redirect_uris[0],
        );

        client.setCredentials(token);
        return client;
    } catch (_err) {
        return null;
    }
}

/**
 * Load or request or authorisation to call APIs.
 */
async function Authorize(): Promise<OAuth2Client> {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await fs.writeFile(TOKEN_PATH, JSON.stringify(client.credentials, null, 2));
    }
    return client;
}

export { Authorize };
