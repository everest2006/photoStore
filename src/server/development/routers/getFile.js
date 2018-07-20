import log from 'winston';
import request from 'request';
import {streamToBuffer, bufferToStream} from '../services';
import multiparty from 'multiparty';
import config from 'config';
import {Store, Image} from '../models/store';




function requestToYandex(fileName, folderPath) {
    return new Promise(function(resolve, reject){
        var options = {
            url:  `${config.get('yandex.urlUpload')}/${config.get('yandex.folder')}/${folderPath}${fileName}`,
            headers: {'Authorization': `OAuth ${config.get('yandex.OAuth')}`}
        };
        request(options,  function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(JSON.parse(response['body']).href);
            }
            if (response.statusCode == 409) {
                reject(JSON.parse(response['body']).description);
            }
            reject(error);
        });
    })
}

function parseFromData(req) {
    return new Promise(function (resolve, reject) {
        var contentType = req.headers['content-type'];
        var form = new multiparty.Form();
        var dataFromRequest ={};

        if (contentType && contentType.indexOf('multipart') === 0) {
            form.on('field', function(name, value) {
                dataFromRequest[name] = value;
            });
            form.on('part', function(part) {
                if (part.filename) {
                    streamToBuffer(part).then(function (buffer) {
                        dataFromRequest.buffer = buffer;
                    });
                    part.resume();
                }
                part.on('error', function(err) {
                    reject(err);
                });
            });
            form.on('close', function() {
               resolve(dataFromRequest);
            });
            form.parse(req,);
        }
    });
}

export const getFile = (req, res) => {
    parseFromData(req).then(function (dataFromRequest) {
        requestToYandex(dataFromRequest.fileName, dataFromRequest.path)
            .then(function (href) {
                return new Promise(function (resolve, reject) {
                    bufferToStream(dataFromRequest.buffer).pipe(
                        request.put(href, function (error, response, body) {
                            if(response.statusCode == 201){
                                log.info(`file ${dataFromRequest.fileName} inTo yandex disk ${response.statusCode}`);
                                resolve();
                            } else {
                                log.error('put file to yandex disk error', response.statusCode);
                                log.error('error', body);
                            }
                        })
                    );
                });
            })
            .then(function () {
                return new Promise(function (resolve, reject) {
                    var options = {
                        url: `${config.get('yandex.urlDownloader')}/${config.get('yandex.folder')}/${dataFromRequest.path}${dataFromRequest.fileName}`,
                        headers: {'Authorization': `OAuth ${config.get('yandex.OAuth')}`}
                    };
                    request.get(options, function (error, response, body) {
                        //console.log(response);
                        resolve(JSON.parse(response['body']).file);
                    })
                });
            }).then(function (urlFile) {
                return new Promise(function (resolve, reject) {
                    Store.findOne({email: dataFromRequest.email}, function(err, store) {
                        if (err) log.error(`don't find ${dataFromRequest.email} in DB`, err);



                        let obj = store['treeStore'];
                        let prevObj = {};
                        let path = dataFromRequest.path.split('/');
                        path[0] = 'root';
                        console.log(path);
                        for(let i=0; i<path.length; i++){
                            if (path[i]){
                                obj = obj.filter(item=>item.categoryName===path[i])[0];
                                prevObj = obj;
                                obj = obj.categoryArray;
                            }
                        }
                        console.log(prevObj);
                        prevObj.imagesArray.push(
                            new Image(
                            {
                                fileName: dataFromRequest.fileName,
                                urlImage: urlFile,
                                descriptionImage: ''
                            }
                            )
                        );
                        console.log(prevObj);
                        store.markModified('treeStore');
                        store.save(function(err, d) {
                            console.log('------');
                            console.log(err);
                            if (err) log.error(err);
                            console.log(d);
                            log.info(`file ${dataFromRequest.fileName} added to DB`);
                        });





                        resolve();
                    });
                });
            })
            .catch(function (err) {
                log.error('requestToYandex ', err);
            });
    });

    res.sendStatus(200);
};