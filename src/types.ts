export class Book {
    title: string;
    author: string;
    yearPublished: number;
    goodreadsLink: string;
    goodreadsRating: number;
    tags: Tag[];

    constructor(
        title: string,
        author: string,
        yearPublished: number,
        goodreadsLink: string,
        goodreadsRating: number,
        tags: Tag[] = []
    ) {
        this.title = title;
        this.author = author;
        this.yearPublished = yearPublished;
        this.goodreadsLink = goodreadsLink;
        this.goodreadsRating = goodreadsRating;
        this.tags = tags;
    }

    getCalculatedRating(): number {
        const tagSum = this.tags.reduce((result: number, tag: Tag) => {
            return result + tag.modifier;
        }, 0);
        return tagSum + this.goodreadsRating;
    }
}

export class Tag {
    name: string;
    modifier: number;

    constructor(name: string, modifier: number) {
        this.name = name;
        this.modifier = modifier;
    }
}
