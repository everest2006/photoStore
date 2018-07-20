import log from 'winston';
import {renameInYandex} from '../services';
import {Store} from '../models/store';



function parseFromData(req) {
    return new Promise(function (resolve, reject) {
        resolve(req.body);
    });
}


export const renameFile = (req, res) => {
    parseFromData(req).then(function (dataFromRequest) {
        renameInYandex(dataFromRequest.oldFileName, dataFromRequest.newFileName,dataFromRequest.pathFolder)
            .then(function (status) {
                log.info(`folder ${dataFromRequest.newFileName} rename to Yandex disk  ${status}`);
                return new Promise(function (resolve, reject) {
                    Store.findOne({email: dataFromRequest.email}, function (err, store) {
                        let mas = [...store.treeStore];
                        if (err) log.error(err);
                        let obj = mas;
                        let path = dataFromRequest.pathFolder.split('/');

                        path[0] = 'root';
                        for(let i=0; i<path.length; i++){
                            if (path[i]){
                                obj = obj.filter(item=>item.categoryName===path[i])[0];
                                obj = obj.categoryArray;
                            }
                        }

                        obj = obj.filter(item=>item.categoryName===dataFromRequest.oldFolderName)[0];
                        obj.categoryName = dataFromRequest.newFolderName;
                        store.markModified('treeStore');
                        store.save(function(err) {
                            if (err) log.error(err);
                            log.info(`category ${dataFromRequest.newFolderName} added to DB`);
                        });
                    })
                })
            })
    });
    res.sendStatus(200);
};

