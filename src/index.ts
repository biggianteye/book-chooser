import 'dotenv/config';
import { Chooser } from './chooser';
import { Spreadsheet } from './spreadsheet';
import { parse } from 'ts-command-line-args';
import { CliOptions, usageGuideInfo } from './cli-config';

async function main() {
    if (!process.env.SHEET_ID) {
        console.error('Missing SHEET_ID environment variable. Please set it to the ID of the Google Sheet to read from.');
        process.exit(1);
    }

    const args: CliOptions = parse(usageGuideInfo.arguments, usageGuideInfo.parseOptions);

    const spreadsheet = await Spreadsheet.create(process.env.SHEET_ID);
    const books = await spreadsheet.parse();

    const chooser = new Chooser({
        excludeTags: args.exclude,
        includeTags: args.include,
    });

    const limit = args.limit ?? 1;
    const choices = chooser.choose(books, limit);

    if (choices.length === 0) {
        console.log('No suitable book found.');
    } else {
        choices.forEach((choice, index) => {
            if (index > 0) {
                console.log(''); // Empty line between books
            }
            console.log(`${choice}`);
        });
    }
}

main();
