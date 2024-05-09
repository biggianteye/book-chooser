import { ArgumentConfig, ParseOptions, UsageGuideConfig } from 'ts-command-line-args';

export interface CliOptions {
    include?: string[];
    exclude?: string[];
    help?: boolean;
}

const argumentConfig: ArgumentConfig<CliOptions> = {
    include: { type: String, optional: true, multiple: true, alias: 'i', description: 'Tag to include' },
    exclude: { type: String, optional: true, multiple: true, alias: 'e', description: 'Tag to exclude' },
    help: { type: Boolean, optional: true, alias: 'h', description: 'Prints this usage guide' },
};

const parseOptions: ParseOptions<CliOptions> = {
    helpArg: 'help',
    headerContentSections: [
        { header: 'Book Chooser', content: 'A Google Sheets-driven tool for choosing the next book to read.' },
    ],
};

export const usageGuideInfo: UsageGuideConfig<CliOptions> = {
    arguments: argumentConfig,
    parseOptions,
};
