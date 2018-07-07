import log from 'winston';
import request from 'request';
import fs from 'fs';
const Readable = require('readable-stream').Readable;

function httpGetFile(req) {
    return new Promise(function(resolve, reject){
        var options = {
            url:  `https://cloud-api.yandex.net/v1/disk/resources/upload?path=${encodeURIComponent('/photoStore/photo.png')}`,
            headers: {'Authorization': 'OAuth AQAEA7qhhYDzAAUOXIUrtcLziUmgo-qcLjy2-vk'}
        };
        function callback(error, response, body) {
            console.log(response.statusCode);
            if (!error && response.statusCode == 200) {
                let href = JSON.parse(response['body']).href;
                console.log(href);
                resolve(href);
            }
        }
        request(options, callback);
    })
}


export const getFile = (req, res) => {
    let myData;
    req.on('data', function (data) {
        myData+=data;
    })
        .on('end', function () {

        })
        .pipe(fs.createWriteStream('d:\\myPhoto.jpg'));

    httpGetFile(req).then(function (href) {
        console.log(href);
        fs.createReadStream('d:\\myPhoto.jpg').pipe(
            request.put(href, function (error, response, body) {
                if(response.statusCode == 201){
                    console.log('ok');
                } else {
                    console.log('error: '+ response.statusCode);
                    console.log(body);
                }
            })
        );
    })

    res.sendStatus(200);
};