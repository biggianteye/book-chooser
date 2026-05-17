import { describe, expect, test } from 'vitest';

import { getRandomBook } from './testHelpers';
import { Book, ExportBook, Tag } from './types';

describe('calculated book ratings', () => {
    const testCases = [
        ['no tags', new Book('', '', 0, '', 2.5, ''), 2.5],
        [
            'some tags',
            new Book('', '', 0, '', 3.5, '', [
                new Tag('positive', 1),
                new Tag('negative', -1),
                new Tag('neutral', 0),
                new Tag('very positive', 5),
            ]),
            8.5,
        ],
    ];

    test.each(testCases)('%s', (name: string, book: Book, expected: number) => {
        expect(book.getCalculatedRating()).toEqual(expected);
    });
});

describe('tag display', () => {
    const testCases = [
        ['default modifier', new Tag('foo'), '[foo]'],
        ['positive tag', new Tag('foo', 1), '[foo(+)]'],
        ['neutral tag', new Tag('bar', 0), '[bar]'],
        ['negative tag', new Tag('baz', -1), '[baz(-)]'],
        ['modifier magnitude does not matter', new Tag('bat', 5), '[bat(+)]'],
    ];

    test.each(testCases)('%s', (name: string, tag: Tag, expected: string) => {
        expect(tag.toString()).toEqual(expected);
    });
});

describe('book display', () => {
    const testCases = [
        [
            'no tags',
            new Book('AAA', 'BBB', 2003, 'https://www.goodreads.com/...', 5, ''),
            //             `"AAA" by BBB (1900),
            // https://www.goodreads.com/...`,
            [`"AAA" by BBB (2003)`, `https://www.goodreads.com/...`].join('\n'),
        ],
        [
            'positive, negative and neutral tags',
            new Book('CCC', 'DDD', 2011, 'https://www.goodreads.com/...', 5, '', [
                new Tag('xxx', -1),
                new Tag('yyy', 1),
                new Tag('zzz', 0),
            ]),
            [`"CCC" by DDD (2011)`, `https://www.goodreads.com/...`, `[xxx(-)] [yyy(+)] [zzz]`].join('\n'),
        ],
        [
            'tags are alphabetical',
            new Book('EEE', 'FFF', 2017, 'https://www.goodreads.com/...', 5, '', [
                new Tag('vvv', 1),
                new Tag('uuu', -1),
                new Tag('www', 0),
            ]),
            [`"EEE" by FFF (2017)`, `https://www.goodreads.com/...`, `[uuu(-)] [vvv(+)] [www]`].join('\n'),
        ],
    ];

    test.each(testCases)('%s', (name: string, book: Book, expected: string) => {
        expect(book.toString()).toEqual(expected);
    });
});

describe('whether or not a book has a tag', () => {
    const emptyTagList = [];
    const tagList = [new Tag('lorem', 0), new Tag('ipsum', 0), new Tag('dolor', 0)];

    const testCases = [
        ['empty tags, null name', emptyTagList, null, false],
        ['empty tags, empty name', emptyTagList, '', false],
        ['empty tags, regular name', emptyTagList, 'lorem', false],
        ['regular tags, null name', tagList, null, false],
        ['regular tags, empty name', tagList, '', false],
        ['regular tags, non-existent name', tagList, 'sit', false],
        ['regular tags, existing name', tagList, 'lorem', true],
    ];

    test.each(testCases)('%s', (name: string, tags: Tag[], tagName: string, expected: boolean) => {
        const book = getRandomBook();
        book.tags = tags;

        expect(book.hasTag(tagName)).toEqual(expected);
    });
});

describe('setting book tags', () => {
    test('setTags updates the tags and returns the same book instance', () => {
        const book = getRandomBook();
        const tags = [new Tag('alpha', 1), new Tag('beta', -1)];

        const updatedBook = book.setTags(tags);

        expect(updatedBook).toBe(book);
        expect(book.tags).toEqual(tags);
    });
});

describe('export books', () => {
    test('ExportBook copies the book and stores the calculated rating', () => {
        const book = new Book('AAA', 'BBB', 2003, 'https://www.goodreads.com/...', 4.5, '', [
            new Tag('alpha', 1),
            new Tag('beta', -2),
        ]);

        const exportBook = new ExportBook(book);

        expect(exportBook).toBeInstanceOf(Book);
        expect(exportBook.title).toEqual(book.title);
        expect(exportBook.author).toEqual(book.author);
        expect(exportBook.yearPublished).toEqual(book.yearPublished);
        expect(exportBook.goodreadsLink).toEqual(book.goodreadsLink);
        expect(exportBook.goodreadsRating).toEqual(book.goodreadsRating);
        expect(exportBook.started).toEqual(book.started);
        expect(exportBook.tags).toEqual(book.tags);
        expect(exportBook.calculatedRating).toEqual(3.5);
    });
});
