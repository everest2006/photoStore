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

export const createFolderInYandex = (nameFolder, path='') => {
    return new Promise(function (resolve, reject) {
        var options = {
            url: `${config.get('yandex.urlCreateFolder')}/${config.get('yandex.folder')}/${path}${nameFolder}`,
            headers: {'Authorization': `OAuth ${config.get('yandex.OAuth')}`}
        };
        request.put(options, function (error, response, body) {
            if(response.statusCode == 201){
                log.info(`folder ${nameFolder} created ${response.statusCode}`);
                resolve();
            } else {
                log.error('put folder to yandex disk error', response.statusCode);
                log.error('error', body);
            }
        })
    })
}