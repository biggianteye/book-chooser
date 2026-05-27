import { describe, expect, test } from 'vitest';

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

        const choices = new Chooser().choose(books);

        expect(choices).toHaveLength(1);
        expect(choices[0].title).toEqual('the title');
    });

    test('positive tags have higher priority', () => {
        const books = [
            new Book('Positive Book', someAuthor, someYear, someLink, someRating, emptyDate, [positiveTag]),
            new Book('Neutral Book', someAuthor, someYear, someLink, someRating, emptyDate, [neutralTag]),
        ];

        const choices = new Chooser().choose(books);

        expect(choices).toHaveLength(1);
        expect(choices[0].title).toEqual('Positive Book');
    });

    test('negative tags have lower priority', () => {
        const books = [
            new Book('Negative Book', someAuthor, someYear, someLink, someRating, emptyDate, [negativeTag]),
            new Book('Neutral Book', someAuthor, someYear, someLink, someRating, emptyDate, [neutralTag]),
        ];

        const choices = new Chooser().choose(books);

        expect(choices).toHaveLength(1);
        expect(choices[0].title).toEqual('Neutral Book');
    });

    test('first book chosen when they are equal', () => {
        const books = [
            new Book('Positive Book 1', someAuthor, someYear, someLink, someRating, emptyDate, [positiveTag]),
            new Book('Positive Book 2', someAuthor, someYear, someLink, someRating, emptyDate, [positiveTag]),
        ];

        const choices = new Chooser().choose(books);

        expect(choices).toHaveLength(1);
        expect(choices[0].title).toEqual('Positive Book 1');
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

        test.each(testCases)('%s', (name: string, tagName: string, expectedBook: Book) => {
            const books = [bookOne, bookTwo];
            const choices = new Chooser({ excludeTags: [tagName] }).choose(books);

            if (expectedBook == null) {
                expect(choices).toHaveLength(0);
            } else {
                expect(choices.length).toBeGreaterThan(0);
                expect(choices[0]).toEqual(expectedBook);
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
            ['tag exists on first book', alphaTag, bookOne],
            ['tag exists on second book', betaTag, bookTwo],
            ['tag exists on all books', gammaTag, bookOne],
            ['tag is on no books', deltaTag, null],
        ];

        test.each(testCases)('%s', (name: string, tag: Tag, expectedBook: Book) => {
            const books = [bookOne, bookTwo];
            const choices = new Chooser({ includeTags: [tag.name] }).choose(books);

            if (expectedBook == null) {
                expect(choices).toHaveLength(0);
            } else {
                expect(choices.length).toBeGreaterThan(0);
                expect(choices[0]).toEqual(expectedBook);
            }
        });
    });

    test('ignore books currently being read', () => {
        const books = [
            new Book('Currently reading', someAuthor, someYear, someLink, 5, '28/10/2023', [positiveTag]),
            new Book('Unread', someAuthor, someYear, someLink, 1, emptyDate, [negativeTag]),
        ];
        const choices = new Chooser().choose(books);

        // First book is highly rated and would normally be picked, but it's
        // already being read, so the second books is chosen despite its lower rating.
        expect(choices[0]).toEqual(books[1]);
    });

    test('returns empty array when no books available', () => {
        const books = [];
        const choices = new Chooser().choose(books);

        expect(choices).toEqual([]);
    });

    test('returns single book when limit is 1', () => {
        const books = [
            new Book('Book One', someAuthor, someYear, someLink, 3, emptyDate, [positiveTag]),
            new Book('Book Two', someAuthor, someYear, someLink, 2, emptyDate),
        ];
        const choices = new Chooser().choose(books, 1);

        expect(choices).toHaveLength(1);
        expect(choices[0].title).toEqual('Book One');
    });

    test('returns multiple books in ranked order', () => {
        const books = [
            new Book('Book One', someAuthor, someYear, someLink, 3, emptyDate, [positiveTag]),
            new Book('Book Two', someAuthor, someYear, someLink, 2, emptyDate),
            new Book('Book Three', someAuthor, someYear, someLink, 1, emptyDate, [negativeTag]),
        ];
        const choices = new Chooser().choose(books, 3);

        expect(choices).toHaveLength(3);
        expect(choices[0].title).toEqual('Book One');
        expect(choices[1].title).toEqual('Book Two');
        expect(choices[2].title).toEqual('Book Three');
    });

    test('respects limit parameter', () => {
        const books = [
            new Book('Book One', someAuthor, someYear, someLink, 3, emptyDate),
            new Book('Book Two', someAuthor, someYear, someLink, 2, emptyDate),
            new Book('Book Three', someAuthor, someYear, someLink, 1, emptyDate),
            new Book('Book Four', someAuthor, someYear, someLink, 0, emptyDate),
        ];
        const choices = new Chooser().choose(books, 2);

        expect(choices).toHaveLength(2);
        expect(choices[0].title).toEqual('Book One');
        expect(choices[1].title).toEqual('Book Two');
    });

    test('filters out books with exclude tags before limiting', () => {
        const alphaTag = new Tag('alpha');
        const books = [
            new Book('Book One', someAuthor, someYear, someLink, 3, emptyDate, [alphaTag, positiveTag]),
            new Book('Book Two', someAuthor, someYear, someLink, 2, emptyDate, [positiveTag]),
            new Book('Book Three', someAuthor, someYear, someLink, 1, emptyDate, [positiveTag]),
        ];
        const choices = new Chooser({ excludeTags: ['alpha'] }).choose(books, 2);

        expect(choices).toHaveLength(2);
        expect(choices[0].title).toEqual('Book Two');
        expect(choices[1].title).toEqual('Book Three');
    });

    test('filters out books with started date before limiting', () => {
        const books = [
            new Book('Currently reading', someAuthor, someYear, someLink, 5, '28/10/2023', [positiveTag]),
            new Book('Book Two', someAuthor, someYear, someLink, 2, emptyDate),
            new Book('Book Three', someAuthor, someYear, someLink, 1, emptyDate),
        ];
        const choices = new Chooser().choose(books, 2);

        expect(choices).toHaveLength(2);
        expect(choices[0].title).toEqual('Book Two');
        expect(choices[1].title).toEqual('Book Three');
    });

    test('returns fewer than requested when not enough books available', () => {
        const books = [
            new Book('Book One', someAuthor, someYear, someLink, 3, emptyDate),
            new Book('Book Two', someAuthor, someYear, someLink, 2, emptyDate),
        ];
        const choices = new Chooser().choose(books, 5);

        expect(choices).toHaveLength(2);
    });
});
