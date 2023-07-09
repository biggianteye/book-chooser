export class Book {
    title: string;
    author: string;
    yearPublished: number;
    goodreadsLink: string;
    goodreadsRating: number;

    constructor(
        title: string,
        author: string,
        yearPublished: number,
        goodreadsLink: string,
        goodreadsRating: number
    ) {
        this.title = title;
        this.author = author;
        this.yearPublished = yearPublished;
        this.goodreadsLink = goodreadsLink;
        this.goodreadsRating = goodreadsRating;
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
