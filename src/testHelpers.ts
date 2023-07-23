import { faker } from '@faker-js/faker';
import { Book } from './types';

export function getRandomBook(): Book {
    return new Book(
        faker.commerce.productName(),
        faker.person.fullName(),
        faker.number.int({ min: 1900, max: new Date().getFullYear() }),
        faker.internet.url(),
        faker.number.float({ min: 1, max: 5, precision: 0.01 })
    );
}
