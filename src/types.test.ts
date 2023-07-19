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

describe('tag display', () => {
    const testCases = [
        ['positive tag', new Tag('foo', 1), '[foo(+)]'],
        ['neutral tag', new Tag('bar', 0), '[bar]'],
        ['negative tag', new Tag('baz', -1), '[baz(-)]'],
        ['modifier magnitude does not matter', new Tag('bat', 5), '[bat(+)]'],
    ];

    it.each(testCases)('%s', (name: string, tag: Tag, expected: string) => {
        expect(tag.toString()).toEqual(expected);
    });
});

describe('book display', () => {
    const testCases = [
        [
            'no tags',
            new Book('AAA', 'BBB', 2003, 'https://www.goodreads.com/...', 5),
            //             `"AAA" by BBB (1900),
            // https://www.goodreads.com/...`,
            [`"AAA" by BBB (2003)`, `https://www.goodreads.com/...`].join('\n'),
        ],
        [
            'positive, negative and neutral tags',
            new Book('CCC', 'DDD', 2011, 'https://www.goodreads.com/...', 5, [
                new Tag('xxx', -1),
                new Tag('yyy', 1),
                new Tag('zzz', 0),
            ]),
            [
                `"CCC" by DDD (2011)`,
                `https://www.goodreads.com/...`,
                `[xxx(-)] [yyy(+)] [zzz]`,
            ].join('\n'),
        ],
        [
            'tags are alphabetical',
            new Book('EEE', 'FFF', 2017, 'https://www.goodreads.com/...', 5, [
                new Tag('vvv', 1),
                new Tag('uuu', -1),
                new Tag('www', 0),
            ]),
            [
                `"EEE" by FFF (2017)`,
                `https://www.goodreads.com/...`,
                `[uuu(-)] [vvv(+)] [www]`,
            ].join('\n'),
        ],
    ];

    it.each(testCases)('%s', (name: string, book: Book, expected: string) => {
        expect(book.toString()).toEqual(expected);
    });
});
