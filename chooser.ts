
import { Book } from './types';

export class Chooser {
    choose(books: Book[]): Book {
        return books[Math.floor(Math.random() * books.length)]
    }
}
