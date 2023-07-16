import { Book, Tag } from './types';

describe('calculated book ratings', () => {
    const testCases = [
        ['no tags', new Book('', '', 0, '', 2.5), 2.5],
        [
            'some tags',
            new Book('', '', 0, '', 3.5, [
                new Tag('positive', 1),
                new Tag('negative', -1),
                new Tag('neutral', 0),
                new Tag('very positive', 5),
            ]),
            8.5,
        ],
    ];

    it.each(testCases)('%s', (name: string, book: Book, expected: number) => {
        expect(book.getCalculatedRating()).toEqual(expected);
    });
});
