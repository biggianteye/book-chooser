import 'dotenv/config';
import { Chooser } from './chooser';
import { Spreadsheet } from './spreadsheet';
import { parse } from 'ts-command-line-args';
import { CliOptions, usageGuideInfo } from './cli-config';

async function main() {
    const args: CliOptions = parse(usageGuideInfo.arguments, usageGuideInfo.parseOptions);

    const spreadsheet = await Spreadsheet.create(process.env.SHEET_ID);
    const books = await spreadsheet.parse();

    const chooser = new Chooser({
        excludeTags: args.exclude,
        includeTags: args.include,
    });

    const choice = chooser.choose(books);

    if (choice) {
        console.log(`${choice}`);
    } else {
        console.log('No suitable book found.');
    }
}

main();
