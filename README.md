# firestore-multibatch

Drop-in replacement for [firebase.firestore.WriteBatch](https://firebase.google.com/docs/reference/js/firebase.firestore.WriteBatch) that works without batch operations limit.

Firestore write batches are currently [limited to 500 operations](https://firebase.google.com/docs/firestore/quotas). 

## Usage

```javascript
const firebase = require('firebase');
const {MultiBatch} = require('firestore-multibatch');

firebase.initializeApp({/* ... */});

const db = firebase.firestore();
const batch = new MultiBatch(db); // Instead of db.batch()

// Perform batch operations same as with db.batch()
for (let i = 0; i < 1000; i++) {
    batch.set(db.collection('test').doc(), {foo: 'bar'});
}

batch.commit()
    .then(() => console.log('Batch operations committed'))
    .catch(err => console.error(err));
```
