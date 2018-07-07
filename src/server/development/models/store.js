import mongoose from '../libs/db';

const Schema = mongoose.Schema;

let imageSchema = new Schema({
    fileName: {
        type: String,
        unique: true,
        required: true
    },
    urlImage: {
        type: String,
        unique: true,
        required: true
    },
    descriptionImage: {
        type: String
    }
});

let treeStoreSchema = new Schema({
    categoryName: {
        type: String,
        unique: true,
        required: true
    },
    categoryArray: {
        type: [treeStoreSchema]
    },
    imagesArray: {
        type: [imageSchema]
    }
});

let schema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    treeStore: {
        type: treeStoreSchema
    }
});

export const Store = mongoose.model('Store',schema);