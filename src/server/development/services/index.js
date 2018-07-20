import {Duplex} from 'stream';
import request from 'request';
import config from 'config';
import log from 'winston';

export const streamToBuffer = (stream) => {
    return new Promise((resolve, reject) => {
        let buffers = [];
        stream.on('error', reject);
        stream.on('data', (data) => buffers.push(data));
        stream.on('end', () => resolve(Buffer.concat(buffers)));
    });
};

export const bufferToStream = (buffer) => {
    let stream = new Duplex();
    stream.push(buffer);
    stream.push(null);
    return stream;
};

export const createFolderInYandex = (newFolder, path='') => {
    return new Promise(function (resolve, reject) {
        var options = {
            url: `${config.get('yandex.urlCreateFolder')}/${config.get('yandex.folder')}/${path}${newFolder}`,
            headers: {'Authorization': `OAuth ${config.get('yandex.OAuth')}`}
        };
        request.put(options, function (error, response, body) {
            if(response.statusCode == 201){
                log.info(`folder ${newFolder} created ${response.statusCode}`);
                resolve(response.statusCode);
            } else {
                log.error('put folder to yandex disk error', response.statusCode);
                log.error('error', body);
            }
        })
    })
};

export const renameInYandex = (oldName,newName, path='') => {
    return new Promise(function (resolve, reject) {
        var options = {
            url: `${config.get('yandex.urlRenameFolder')}?from=/${config.get('yandex.folder')}/${path}/${oldName}&path=/${config.get('yandex.folder')}/${path}/${newName}`,
            headers: {'Authorization': `OAuth ${config.get('yandex.OAuth')}`}
        };
        request.post(options, function (error, response, body) {
            if((response.statusCode === 201)||(response.statusCode ===202)){
                log.info(`${newName} renamed ${response.statusCode}`);
                resolve(response.statusCode);
            } else {
                log.error('rename folder or file in yandex disk error', response.statusCode);
                log.error('error', body);
            }
        })
    })
};