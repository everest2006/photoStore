import mongoose from '../libs/db';

let imageSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    urlImage: {
        type: String,
        required: true
    },
    descriptionImage: {
        type: String
    }
});



var categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    categoryArray: [
        { type: mongoose.Schema.Types.Object, ref: 'categorySchema' }
    ],
    imagesArray: [
        imageSchema
    ]
});

let storeSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    treeStore:[
        categorySchema
    ]


});

export const Store = mongoose.model('Store',storeSchema);
export const Category = mongoose.model('Category',categorySchema);
export const Image = mongoose.model('Image',imageSchema);