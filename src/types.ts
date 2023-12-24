export class Book {
    title: string;
    author: string;
    yearPublished: number;
    goodreadsLink: string;
    goodreadsRating: number;
    started: string;
    tags: Tag[];

    constructor(
        title: string,
        author: string,
        yearPublished: number,
        goodreadsLink: string,
        goodreadsRating: number,
        started: string,
        tags: Tag[] = []
    ) {
        this.title = title;
        this.author = author;
        this.yearPublished = Number(yearPublished);
        this.goodreadsLink = goodreadsLink;
        this.goodreadsRating = Number(goodreadsRating);
        this.started = started;
        this.tags = tags;
    }

    getCalculatedRating(): number {
        const tagSum = this.tags.reduce((result: number, tag: Tag): number => {
            return result + tag.modifier;
        }, 0);
        return tagSum + this.goodreadsRating;
    }

    hasTag(name: string): boolean {
        return this.tags
            .map((t: Tag) => {
                return t.name;
            })
            .includes(name);
    }

    setTags(tags: Tag[]): Book {
        this.tags = tags;
        return this;
    }

    toString(): string {
        const output: string[] = [`"${this.title}" by ${this.author} (${this.yearPublished})`, `${this.goodreadsLink}`];

        if (this.tags.length > 0) {
            const tags: string = [...this.tags]
                .sort((a: Tag, b: Tag): number => {
                    return a.name.localeCompare(b.name);
                })
                .map((t: Tag) => {
                    return t.toString();
                })
                .join(' ');
            output.push(tags);
        }

        return output.join('\n');
    }
}

/**
 * Identical to a book but inlines the calculated rating, ready for export.
 */
export class ExportBook extends Book {
    calculatedRating: number;

    constructor(book: Book) {
        super(
            book.title,
            book.author,
            book.yearPublished,
            book.goodreadsLink,
            book.goodreadsRating,
            book.started,
            book.tags
        );

        this.calculatedRating = this.getCalculatedRating();
    }
}

export class Tag {
    name: string;
    modifier: number;

    constructor(name: string, modifier?: number) {
        this.name = name;
        if (modifier == undefined) {
            this.modifier = 0;
        } else {
            this.modifier = Number(modifier);
        }
    }

    toString(): string {
        if (this.modifier > 0) {
            return `[${this.name}(+)]`;
        }
        if (this.modifier < 0) {
            return `[${this.name}(-)]`;
        }
        return `[${this.name}]`;
    }
}
