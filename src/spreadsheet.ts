import { GoogleSpreadsheet } from 'google-spreadsheet';
import { Authorize } from './authorisation';
import { Book, Tag } from './types';

export class Spreadsheet {
    private doc: GoogleSpreadsheet;

    private constructor(doc: GoogleSpreadsheet) {
        this.doc = doc;
    }

    static async create(sheetID: string): Promise<Spreadsheet> {
        const oauthClient = await Authorize();

        const doc = new GoogleSpreadsheet(sheetID, oauthClient);

        // loads document properties and worksheets
        await doc.loadInfo();

        return new Spreadsheet(doc);
    }

    async parse(): Promise<Book[]> {
        // Grab all the tags
        const tagsSheet = this.doc.sheetsByTitle['Tags'];
        const tagRows = await tagsSheet.getRows();
        const tags = new Map<string, Tag>();
        tagRows.forEach((row) => {
            tags.set(row.get('Name'), new Tag(row.get('Name'), row.get('Modifier')));
        });

        // Grab all the book->tag mappings, ready to add to new books in one go
        const bookTagsSheet = this.doc.sheetsByTitle['Book Tags'];
        const bookTagsRows = await bookTagsSheet.getRows();
        const bookTags: Map<string, Tag[]> = new Map();
        bookTagsRows.forEach((row) => {
            const bookName = row.get('Title') as string;
            const tagName = row.get('Tag') as string;

            if (!tags.has(tagName)) {
                console.log(`Skipping unknown tag: ${tagName}`);
                return;
            }

            const tag = tags.get(tagName) as Tag;
            if (bookTags.has(bookName)) {
                bookTags.get(bookName)?.push(tag);
            } else {
                bookTags.set(bookName, [tag]);
            }
        });

        // Grab all the books, including their tags
        const booksSheet = this.doc.sheetsByTitle['Books'];
        const bookRows = await booksSheet.getRows();
        const books: Book[] = [];
        bookRows.forEach((row) => {
            // Ignore any finished books
            if (row.get('Finished')) {
                return;
            }
            // Grab any other book, even if it's in progress
            books.push(
                new Book(
                    row.get('Title'),
                    row.get('Author'),
                    row.get('Year published'),
                    row.get('Goodreads link'),
                    row.get('Goodreads rating'),
                    row.get('Started'),
                    bookTags.get(row.get('Title'))
                )
            );
        });

        return books;
    }
}
