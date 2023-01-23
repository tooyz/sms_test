import { TextSplitter } from '../src/text-splitter';

describe('splitter', () => {
    test('should split len=140', () => {
        const SMS_MSG_LENGTH = 140;
        const str = 'Lorem ipsum dolor sit amet consectetur adipiscing elit Nullam eleifend odio at magna pretium suscipit Nam commodo mauris felis ut suscipit velit efficitur eget Sed sit amet posuere risus';
        const spl = new TextSplitter(str, {maxLength: SMS_MSG_LENGTH}).split();

        expect(spl[0]).toBe('Lorem ipsum dolor sit amet consectetur adipiscing elit Nullam eleifend odio at magna pretium suscipit Nam commodo mauris felis ut 1/2');
        expect(spl[1]).toBe('suscipit velit efficitur eget Sed sit amet posuere risus 2/2');
    });

    test('should split len=140 single', () => {
        const SMS_MSG_LENGTH = 140;
        const str = 'Lorem ipsum dolor sit amet consectetur adipiscing elit';
        const spl = new TextSplitter(str, {maxLength: SMS_MSG_LENGTH}).split();

        expect(spl[0]).toBe('Lorem ipsum dolor sit amet consectetur adipiscing elit');
    });

    test('should split len=9 fail', () => {
        const SMS_MSG_LENGTH = 9;
        // НЕ РЕШАЕМО
        // "aaaa xx/xx".length > 9
        const str = 'a aa aaa a aa aa aaa aaaa a aa aa aa aa aa aa aa aaaa';

        expect(() => {
            new TextSplitter(str, {maxLength: SMS_MSG_LENGTH}).split();
        }).toThrow()
    });

    test('should split len=9', () => {
        const SMS_MSG_LENGTH = 9;
        //заменено последнее слово
        const str = 'a aa aaa a aa aa aaa aaaa a aa aa aa aa aa aa aa aaa';
        const spl = new TextSplitter(str, {maxLength: SMS_MSG_LENGTH}).split();

        const ar = [
            'a aa 1/14', 'aaa 2/14',
            'a aa 3/14', 'aa 4/14',
            'aaa 5/14',  'aaaa 6/14',
            'a aa 7/14', 'aa 8/14',
            'aa 9/14',   'aa 10/14',
            'aa 11/14',  'aa 12/14',
            'aa 13/14',  'aaa 14/14'
        ];

        for ( let i = 0; i < ar.length; i++ ) {
            expect(spl[i]).toBe(ar[0]);
        }
    });
});