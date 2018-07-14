import {User} from '../models/user';
import {Store} from '../models/store';
import log from 'winston';
import multiparty from 'multiparty';

function parseFromData(req) {
    return new Promise(function (resolve, reject) {
        console.log(req);
        req.setEncoding('utf8');
        req.on('data', function (data) {
            console.log(data); // I can't parse it because, it's a string. why?
        });
    });
}


export const addFolder = (req, res) => {
    parseFromData(req).then(function (dataFromRequest) {
        console.log(dataFromRequest);
    })
    res.sendStatus(200);
};