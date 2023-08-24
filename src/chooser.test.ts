import { Chooser } from './chooser';
import { Book, Tag } from './types';

describe('choose method', () => {
    const positiveTag = new Tag('type:positive', 1);
    const neutralTag = new Tag('type:neutral', 0);
    const negativeTag = new Tag('type:negative', -1);

    test('a choice is made', () => {
        const books = [new Book('the title', '', 0, '', 0)];

        const choice = new Chooser().choose(books);

        expect(choice).not.toBeNull();
        expect(choice.title).toEqual('the title');
    });

    test('positive tags have higher priority', () => {
        const books = [
            new Book('Positive Book', '', 0, '', 0, [positiveTag]),
            new Book('Neutral Book', '', 0, '', 0, [neutralTag]),
        ];

        const choice = new Chooser().choose(books);

        expect(choice).not.toBeNull();
        expect(choice.title).toEqual('Positive Book');
    });

    test('negative tags have lower priority', () => {
        const books = [
            new Book('Negative Book', '', 0, '', 0, [negativeTag]),
            new Book('Neutral Book', '', 0, '', 0, [neutralTag]),
        ];

        const choice = new Chooser().choose(books);

        expect(choice).not.toBeNull();
        expect(choice.title).toEqual('Neutral Book');
    });

    test('first book chosen when they are equal', () => {
        const books = [
            new Book('Positive Book 1', '', 0, '', 0, [positiveTag]),
            new Book('Positive Book 2', '', 0, '', 0, [positiveTag]),
        ];

        const choice = new Chooser().choose(books);

        expect(choice).not.toBeNull();
        expect(choice.title).toEqual('Positive Book 1');
    });

    describe('exclusion by single tag', () => {
        const alphaTag = new Tag('alpha');
        const betaTag = new Tag('beta');
        const gammaTag = new Tag('gamma');

        const bookOne = new Book('Book One', '', 0, '', 5, [alphaTag, gammaTag]);
        const bookTwo = new Book('Book Two', '', 0, '', 5, [betaTag, gammaTag]);

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
});
