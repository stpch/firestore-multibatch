'use strict';

require('dotenv').config();
const firebase = require('firebase');
require('firebase/firestore');
const {MultiBatch, BATCH_LIMIT} = require('../src/index');

describe('Cloud Firestore', () => {
    let db;

    beforeAll(() => {
        firebase.initializeApp({
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
        });

        db = firebase.firestore();
        db.settings({timestampsInSnapshots: true});
    });

    afterAll(() => {
        const mb = new MultiBatch(db);

        return db.collection('test').get()
            .then(snapshot => snapshot.docs.forEach(doc => mb.delete(doc.ref)))
            .then(() => mb.commit());
    });

    test('Add and delete document', () => {
        return db.collection('test').add({foo: 'bar'})
            .then(ref => ref.delete());
    });

    describe('Batch operations over limit', () => {
        const limit = BATCH_LIMIT * 2;

        test('should fail without MultiBatch', () => {
            return expect(performBatchOperations(db.batch())).rejects
                .toBeDefined();
        });

        test('should work with MultiBatch', () => {
            return performBatchOperations(new MultiBatch(db));
        });

        function performBatchOperations(batch) {
            for (let i = 0; i < limit; i++) {
                const ref = db.collection('test').doc();
                batch.set(ref, {index: i});
            }

            return batch.commit();
        }
    });
});
