import mongoose from '../libs/db';

const Schema = mongoose.Schema;

let schema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    regDate : {
        type: Date,
        default: Date.now()
    }
});

export const User = mongoose.model('User',schema);
