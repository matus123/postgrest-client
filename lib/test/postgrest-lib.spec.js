"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const constants_1 = require("../src/constants");
describe('#PostgrestClient', () => {
    describe('#Initialing client', () => {
        test('initialize with constructor', () => {
            const client = new src_1.PostgrestClient();
            expect(client).toBeInstanceOf(src_1.PostgrestClient);
        });
        test('initialize with factory function', () => {
            const client = src_1.postgrestClient();
            expect(client).toBeInstanceOf(src_1.PostgrestClient);
        });
    });
    describe('#Utils', () => {
        test('clone', () => {
            const client = src_1.postgrestClient().url('http://localhost:3000');
            const clone = client.clone();
            clone.url('http://localhost:5000');
            expect(clone).not.toBe(client);
            expect(clone).not.toEqual(client);
        });
        test('toQueryUrl', () => {
            const client = src_1.postgrestClient().url('http://localhost:3000');
            expect(client.toQueryUrl()).toEqual('http://localhost:3000');
        });
    });
    describe('#Horizontal filtering (rows)', () => {
        test('Simple condition', () => {
            const client = src_1.postgrestClient().url('http://localhost:3000').filter({
                test: {
                    operator: constants_1.FilterOperator.Eq,
                    value: 4,
                },
            });
            expect(client.toQueryUrl()).toEqual('http://localhost:3000?test=eq.4');
        });
        test('Simple condition with tableName', () => {
            const client = src_1.postgrestClient().url('http://localhost:3000').filter({
                test: {
                    tableName: 'test_test',
                    operator: constants_1.FilterOperator.Eq,
                    value: 4,
                },
            });
            expect(client.toQueryUrl()).toEqual('http://localhost:3000?test_test.test=eq.4');
        });
        test('`In` operator escaping', () => {
            const client = src_1.postgrestClient().url('http://localhost:3000').filter({
                btest: {
                    operator: constants_1.FilterOperator.In,
                    value: [4, 5],
                },
            });
            expect(client.toQueryUrl()).toEqual('http://localhost:3000?btest=in.(4,5)');
        });
        test('`Like` operator escaping ', () => {
            const client = src_1.postgrestClient().url('http://localhost:3000').filter({
                atest: {
                    operator: constants_1.FilterOperator.Like,
                    value: 'dubohon%',
                },
            });
            expect(client.toQueryUrl()).toEqual('http://localhost:3000?atest=like.dubohon*');
        });
        test('Multiple conditions ', () => {
            const client = src_1.postgrestClient().url('http://localhost:3000').filter({
                atest: {
                    operator: constants_1.FilterOperator.Eq,
                    value: 4,
                },
                btest: {
                    operator: constants_1.FilterOperator.In,
                    value: [4, 5],
                },
            });
            expect(client.toQueryUrl()).toEqual('http://localhost:3000?atest=eq.4&btest=in.(4,5)');
        });
    });
    describe('#Vertical filtering (columns)', () => {
        test('Simple select', () => {
            const client = src_1.postgrestClient().url('http://localhost:3000').select(['test']);
            expect(client.toQueryUrl()).toEqual('http://localhost:3000?select=test');
        });
        test('Multiple select', () => {
            const client = src_1.postgrestClient().url('http://localhost:3000').select(['test', 'test2']);
            expect(client.toQueryUrl()).toEqual('http://localhost:3000?select=test,test2');
        });
        test('Select with alias and cast', () => {
            const client = src_1.postgrestClient().url('http://localhost:3000').select([{ column: 'test_test', alias: 'testTest', cast: 'text' }, 'test2']);
            expect(client.toQueryUrl()).toEqual('http://localhost:3000?select=testTest:test_test::text,test2');
        });
    });
    describe('#Ordering', () => {
        test('Empty order', () => {
            const client = src_1.postgrestClient().url('http://localhost:3000').order({});
            expect(client.toQueryUrl()).toEqual('http://localhost:3000');
        });
        test('Simple order by column', () => {
            const client = src_1.postgrestClient().url('http://localhost:3000').order({
                test_test: {},
            });
            expect(client.toQueryUrl()).toEqual('http://localhost:3000?order=test_test');
        });
        test('Order by column, descending and nulls first', () => {
            const client = src_1.postgrestClient().url('http://localhost:3000').order({
                test_test: {
                    direction: constants_1.Ordering.Desc,
                    nulls: 'first',
                },
            });
            expect(client.toQueryUrl()).toEqual('http://localhost:3000?order=test_test.desc.nullsfirst');
        });
        test('Order by multiple columns', () => {
            const client = src_1.postgrestClient().url('http://localhost:3000').order(['test_aaa', 'test_bbb']);
            expect(client.toQueryUrl()).toEqual('http://localhost:3000?order=test_aaa,test_bbb');
        });
        test('Order by multiple columns and different orders', () => {
            const client = src_1.postgrestClient().url('http://localhost:3000').order({
                test_aaa: {
                    direction: constants_1.Ordering.Desc,
                },
                test_bbb: {
                    nulls: 'last',
                },
                test_ccc: {
                    direction: constants_1.Ordering.Asc,
                    nulls: 'first',
                },
            });
            expect(client.toQueryUrl()).toEqual('http://localhost:3000?order=test_aaa.desc,test_bbb.nullslast,test_ccc.asc.nullsfirst');
        });
        // todo: domysliet
        // test('Missing column name', () => {
        //   const client = postgrestClient().url('http://localhost:3000').order([]);
        //   expect(client.toQueryUrl()).toThrow('http://localhost:3000?order=');
        // });
    });
});
//# sourceMappingURL=postgrest-lib.spec.js.map