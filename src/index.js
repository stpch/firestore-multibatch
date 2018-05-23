'use strict';

// Max batch operations. See https://firebase.google.com/docs/firestore/quotas.
const BATCH_LIMIT = 500;

/**
 * Provides the same batch operations as {@link firebase.firestore.WriteBatch}
 * but uses multiple batch instances internally to work around Firebase's batch
 * limit.
 */
class MultiBatch {
    /**
     * @param {firebase.firestore} db
     * @param {number} limit
     */
    constructor(db, limit = BATCH_LIMIT) {
        this.db = db;
        this.limit = limit < BATCH_LIMIT ? limit : BATCH_LIMIT;
        this.batches = [db.batch()];
        this.operations = 0;
    }

    /**
     * @returns {firebase.firestore.WriteBatch}
     */
    getBatch() {
        if (this.operations < this.limit) {
            return this.batches[this.batches.length - 1];
        }

        const batch = this.db.batch();
        this.batches.push(batch);
        this.operations = 0;

        return batch;
    }

    /**
     * @returns {Promise}
     */
    commit() {
        return Promise.all(this.batches.map(batch => batch.commit()))
            .then(() => {
                this.batches = [this.db.batch()];
                this.operations = 0;
            });
    }

    /**
     * @param {firebase.firestore.DocumentReference} ref
     * @returns {MultiBatch}
     */
    delete(ref) {
        this.getBatch().delete(ref);
        this.operations++;

        return this;
    }

    /**
     * @param {firebase.firestore.DocumentReference} ref
     * @param {Object} data
     * @param {firebase.firestore.SetOptions} options
     * @returns {MultiBatch}
     */
    set(ref, data, options) {
        this.getBatch().set(ref, data, options);
        this.operations++;

        return this;
    }

    /**
     * @param {firebase.firestore.DocumentReference} ref
     * @param {*} args
     * @returns {MultiBatch}
     */
    update(ref, ...args) {
        this.getBatch().update(ref, ...args);
        this.operations++;

        return this;
    }
}

module.exports = {
    MultiBatch,
    BATCH_LIMIT,
};
