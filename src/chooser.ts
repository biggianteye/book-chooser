import { Book } from './types';

type Options = {
    excludeTags?: string[];
    includeTags?: string[];
};

export class Chooser {
    private excludeTags: string[] = [];
    private includeTags: string[] = [];

    constructor(options?: Options) {
        if (options !== undefined) {
            this.excludeTags = options.excludeTags ?? [];
            this.includeTags = options.includeTags ?? [];
        }
    }

    choose(books: Book[]): Book {
        // Filter out books that are in progress
        books = books.filter((book: Book) => {
            return book.started ? false : true;
        });

        // Filter out any excluded tags
        this.excludeTags.forEach((tagName: string) => {
            books = books.filter((book: Book) => {
                return !book.hasTag(tagName);
            });
        });

        // Sort in descending order
        books.sort((a, b) => {
            return b.getCalculatedRating() - a.getCalculatedRating();
        });

        return books.length == 0 ? null : books[0];
    }
}
