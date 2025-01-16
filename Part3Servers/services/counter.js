const Counter = require('../models/counter');

const getNextSequence = async (sequenceName) => {
    const counter = await Counter.findOneAndUpdate(
        { _id: sequenceName },
        { $inc: { seq: 1 } },
        { 
            new: true,      // return the updated document
            upsert: true    // create if doesn't exist
        }
    );
    return counter.seq;
};

module.exports = { getNextSequence };