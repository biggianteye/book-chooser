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

function isNodeErrorWithCode(error: unknown, code: string): boolean {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: string }).code === code
    );
}

function exitWithAuthError(message: string, error?: unknown): never {
    console.error(message);
    if (error instanceof Error) {
        console.error(`Reason: ${error.message}`);
    }
    process.exit(1);
}

/**
 * Reads previously authorised credentials from the save file.
 */
async function loadSavedCredentialsIfExist(): Promise<OAuth2Client | null> {
    let credentialsContent: string;
    let tokenContent: string;

    try {
        credentialsContent = await fs.readFile(CREDENTIALS_PATH, 'utf8');
    } catch (error) {
        exitWithAuthError(
            `Unable to read ${CREDENTIALS_PATH}. Check that credentials.json exists and is readable.`,
            error
        );
    }

    try {
        tokenContent = await fs.readFile(TOKEN_PATH, 'utf8');
    } catch (error) {
        if (isNodeErrorWithCode(error, 'ENOENT')) {
            return null;
        }

        exitWithAuthError(`Unable to read ${TOKEN_PATH}.`, error);
    }

    try {
        const credentials = JSON.parse(credentialsContent);
        const token = JSON.parse(tokenContent);
        const credentialsKey = credentials.installed || credentials.web;

        if (!credentialsKey) {
            exitWithAuthError(
                'credentials.json is missing expected OAuth fields (installed/web).'
            );
        }

        const client = new OAuth2Client(
            credentialsKey.client_id,
            credentialsKey.client_secret,
            credentialsKey.redirect_uris[0]
        );

        client.setCredentials(token);
        return client;
    } catch (error) {
        exitWithAuthError(
            'Unable to parse saved credentials/token JSON. Check credentials.json and token.json formatting.',
            error
        );
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

    try {
        client = await authenticate({
            scopes: SCOPES,
            keyfilePath: CREDENTIALS_PATH,
        });
        if (client.credentials) {
            await fs.writeFile(TOKEN_PATH, JSON.stringify(client.credentials, null, 2));
        }
    } catch (error) {
        exitWithAuthError('Failed to complete Google Sheets authorisation.', error);
    }

    return client;
}

export { Authorize };
