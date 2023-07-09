import { Chooser } from './chooser';
import { Book } from './types';

describe('choose method', () => {
    test('a choice is made', () => {
        const books = [new Book('the title', '', 0, '', 0)];

        const choice = new Chooser().choose(books);

        expect(choice).not.toBeNull();
        expect(choice.title).toEqual('the title');
    });
});
