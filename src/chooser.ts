import { Book } from './types';

export class Chooser {
    choose(books: Book[]): Book {
        // Sort in descending order
        books.sort((a, b) => {
            return b.getCalculatedRating() - a.getCalculatedRating();
        });
        return books[0];
    }
}
