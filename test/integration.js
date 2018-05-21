'use strict';

require('dotenv').config();
const firebase = require('firebase');
require('firebase/firestore');

describe('Cloud Firestore', () => {
    test('Initialize app', () => {
        firebase.initializeApp({
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
        });
    });

    test('Add and delete data', () => {
        const db = firebase.firestore();
        db.settings({timestampsInSnapshots: true});

        return db.collection('test').add({foo: 'bar'})
            .then(ref => ref.delete());
    });
});
