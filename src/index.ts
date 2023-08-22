import 'dotenv/config';
import { Chooser } from './chooser';
import { Spreadsheet } from './spreadsheet';
import { parse } from 'ts-command-line-args';

async function main() {
    interface cliOptions {
        exclude?: string[];
        help?: boolean;
    }
    const args = parse<cliOptions>(
        {
            exclude: { type: String, optional: true, multiple: true, alias: 'e', description: 'Tag to exclude' },
            help: { type: Boolean, optional: true, alias: 'h', description: 'Prints this usage guide' },
        },
        {
            helpArg: 'help',
            headerContentSections: [
                { header: 'Book Chooser', content: 'A Google Sheets-driven tool for choosing the next book to read.' },
            ],
        }
    );

    const spreadsheet = await Spreadsheet.create(process.env.SHEET_ID);
    const books = await spreadsheet.parse();

    const chooser = new Chooser({
        excludeTags: args.exclude,
    });

    const choice = chooser.choose(books);

    console.log(`${choice}`);
}

main();
