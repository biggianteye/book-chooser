import { Book } from './types';

export class Chooser {
    choose(books: Book[]): Book {
        // Sort in descending order
        books.sort((a, b) => {
            const ratingA = a.getCalculatedRating();
            const ratingB = b.getCalculatedRating();

            if (ratingA < ratingB) {
                return 1;
            }
            if (ratingA > ratingB) {
                return -1;
            }
            return 0;
        });
        return books[0];
    }
}
