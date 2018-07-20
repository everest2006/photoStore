import log from 'winston';
import {createFolderInYandex} from '../services';
import {Store, Category} from '../models/store';
import mongoose from '../libs/db';


function parseFromData(req) {
    return new Promise(function (resolve, reject) {
        resolve(req.body);
    });
}


export const addFolder = (req, res) => {
    parseFromData(req).then(function (dataFromRequest) {
       createFolderInYandex(dataFromRequest.newFolder,dataFromRequest.path)
           .then(function (status) {
               log.info(`folder ${dataFromRequest.newFolder} added to Yandex disk  ${status}`);
               return new Promise(function (resolve, reject) {
                   Store.findOne({email: dataFromRequest.email}, function (err, store) {
                       let mas = [...store.treeStore];
                       if (err) log.error(err);
                       let obj = mas;
                       let path = dataFromRequest.path.split('/');

                       path[0] = 'root';
                       for(let i=0; i<path.length; i++){
                           if (path[i]){
                              obj = obj.filter(item=>item.categoryName===path[i])[0];
                               obj = obj.categoryArray;
                           }
                       }
                       obj.push(
                                new Category(
                               {
                                   _id: new mongoose.Types.ObjectId(),
                                    categoryName: dataFromRequest.newFolder,
                                   categoryArray: [],
                                   imagesArray: []
                              }
                                )
                     );
                       console.log(store.treeStore[0].categoryArray);
                       store.markModified('treeStore');
                       store.save(function(err, d) {
                           if (err) log.error(err);
                            console.log(d);
                           log.info(`category ${dataFromRequest.newFolder} added to DB`);
                       });
                   })
               })
            })
    });
    res.sendStatus(200);
};
