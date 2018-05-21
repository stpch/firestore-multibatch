'use strict';

require('dotenv').config();
const firebase = require('firebase');
require('firebase/firestore');

describe('Cloud Firestore', () => {
    test('Initialize app', () => {
        firebase.initializeApp({
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_API_KEY,
            projectId: process.env.FIREBASE_API_KEY,
        });
    });

    test('Insert and read data', () => {
        const db = firebase.firestore();
        db.settings({timestampsInSnapshots: true});

        return db.collection('test').add({foo: 'bar'});
    });
});
