'use strict';

const {MultiBatch, BATCH_LIMIT} = require('../src/index');

const db = {
    batch() {
        return {
            commit() {},
            delete() {},
            set() {},
            update() {},
        };
    },
};

describe('MultiBatch', () => {
    describe('constructor', () => {
        test('with default limit', () => {
            const mb = new MultiBatch(db);
            const batch = mb.getBatch();

            expect(mb.limit).toBe(BATCH_LIMIT);
            expect(mb.operations).toBe(0);

            expect(batch).toBeDefined();
            expect(mb.batches.length).toBe(1);
            expect(batch).toBe(mb.batches[0]);
        });

        test('with custom limit under BATCH_LIMIT', () => {
            const limit = BATCH_LIMIT - 1;
            const mb = new MultiBatch(db, limit);
            expect(mb.limit).toBe(limit);
        });

        test('with custom limit over BATCH_LIMIT', () => {
            const limit = BATCH_LIMIT + 1;
            const mb = new MultiBatch(db, limit);
            expect(mb.limit).toBe(BATCH_LIMIT);
        });
    });

    test('getBatch', () => {
        const mb = new MultiBatch(db, 1);

        const batch1 = mb.getBatch();
        mb.set();
        expect(batch1).toBe(mb.batches[0]);

        const batch2 = mb.getBatch();
        mb.set();
        expect(batch2).toBe(mb.batches[1]);
    });

    test('commit', () => {
        const mb = new MultiBatch(db, 1);
        mb.set();
        mb.set();

        expect(mb.batches.length).toBe(2);
        expect(mb.operations).toBe(1);

        return mb.commit()
            .then(() => {
               expect(mb.batches.length).toBe(1);
               expect(mb.operations).toBe(0);
            });
    });

    test('delete, set, update', () => {
        const mb = new MultiBatch(db, 2);
        mb.set();
        mb.delete();
        mb.update();

        expect(mb.batches.length).toBe(2);
        expect(mb.operations).toBe(1);

        return mb.commit()
            .then(() => {
                expect(mb.batches.length).toBe(1);
                expect(mb.operations).toBe(0);
            });
    });
});
