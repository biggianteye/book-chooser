import { Chooser } from './chooser';
import { Book, Tag } from './types';

describe('choose method', () => {
    const positiveTag = new Tag('type:positive', 1);
    const neutralTag = new Tag('type:neutral', 0);
    const negativeTag = new Tag('type:negative', -1);

    const someAuthor = 'the author';
    const someYear = 2023;
    const someLink = 'http://...';
    const someRating = 2.5;
    const emptyDate = '';

    test('a choice is made', () => {
        const books = [new Book('the title', someAuthor, someYear, someLink, someRating, emptyDate)];

        const choice = new Chooser().choose(books);

        expect(choice).not.toBeNull();
        expect(choice.title).toEqual('the title');
    });

    test('positive tags have higher priority', () => {
        const books = [
            new Book('Positive Book', someAuthor, someYear, someLink, someRating, emptyDate, [positiveTag]),
            new Book('Neutral Book', someAuthor, someYear, someLink, someRating, emptyDate, [neutralTag]),
        ];

        const choice = new Chooser().choose(books);

        expect(choice).not.toBeNull();
        expect(choice.title).toEqual('Positive Book');
    });

    test('negative tags have lower priority', () => {
        const books = [
            new Book('Negative Book', someAuthor, someYear, someLink, someRating, emptyDate, [negativeTag]),
            new Book('Neutral Book', someAuthor, someYear, someLink, someRating, emptyDate, [neutralTag]),
        ];

        const choice = new Chooser().choose(books);

        expect(choice).not.toBeNull();
        expect(choice.title).toEqual('Neutral Book');
    });

    test('first book chosen when they are equal', () => {
        const books = [
            new Book('Positive Book 1', someAuthor, someYear, someLink, someRating, emptyDate, [positiveTag]),
            new Book('Positive Book 2', someAuthor, someYear, someLink, someRating, emptyDate, [positiveTag]),
        ];

        const choice = new Chooser().choose(books);

        expect(choice).not.toBeNull();
        expect(choice.title).toEqual('Positive Book 1');
    });

    describe('exclusion by single tag', () => {
        const alphaTag = new Tag('alpha');
        const betaTag = new Tag('beta');
        const gammaTag = new Tag('gamma');

        const bookOne = new Book('Book One', someAuthor, someYear, someLink, 5, emptyDate, [alphaTag, gammaTag]);
        const bookTwo = new Book('Book Two', someAuthor, someYear, someLink, 5, emptyDate, [betaTag, gammaTag]);

        const testCases = [
            ['tag exists on some books', 'alpha', bookTwo],
            ['tag exists on all books', 'gamma', null],
            ['tag is on no books', 'delta', bookOne],
        ];

        it.each(testCases)('%s', (name: string, tagName: string, expectedBook: Book) => {
            const books = [bookOne, bookTwo];
            const choice = new Chooser({ excludeTags: [tagName] }).choose(books);

            if (expectedBook == null) {
                expect(choice).toBeNull();
            } else {
                expect(choice).not.toBeNull();
                expect(choice).toEqual(expectedBook);
            }
        });
    });

    describe('inclusion by single tag', () => {
        const alphaTag = new Tag('alpha');
        const betaTag = new Tag('beta');
        const gammaTag = new Tag('gamma');
        const deltaTag = new Tag('delta');

        const bookOne = new Book('Book One', someAuthor, someYear, someLink, 5, emptyDate, [alphaTag, gammaTag]);
        const bookTwo = new Book('Book Two', someAuthor, someYear, someLink, 5, emptyDate, [betaTag, gammaTag]);

        const testCases = [
            ['tag exists on first book', 'alpha', bookOne],
            ['tag exists on second book', 'beta', bookTwo],
            ['tag exists on all books', 'gamma', bookOne],
            ['tag is on no books', 'delta', null],
        ];

        it.each(testCases)('%s', (name: string, tagName: string, expectedBook: Book) => {
            const books = [bookOne, bookTwo];
            const choice = new Chooser({ includeTags: [tagName] }).choose(books);

            if (expectedBook == null) {
                expect(choice).toBeNull();
            } else {
                expect(choice).not.toBeNull();
                expect(choice).toEqual(expectedBook);
            }
        });
    });

    describe('ignore books currently being read', () => {
        const books = [
            new Book('Currently reading', someAuthor, someYear, someLink, 5, '28/10/2023', [positiveTag]),
            new Book('Unread', someAuthor, someYear, someLink, 1, emptyDate, [negativeTag]),
        ];
        const choice = new Chooser().choose(books);

        // First book is highly rated and would normally be picked, but it's
        // already being read, so the second books is chosen despite its lower rating.
        expect(choice).toEqual(books[1]);
    });
});
