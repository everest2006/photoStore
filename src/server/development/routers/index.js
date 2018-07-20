import path from 'path';
import {findUser} from './findUser';
import {addUser} from './addUser';
import {login} from './login';
import {getFile} from './getFile';
import {addFolder} from './addFolder';
import {renameFolder} from './renameFolder';
import {renameFile} from './renameFile';
import log from 'winston';


export const serverRouters = (app) => {
    app.get('/', (req, res) => {
        res.sendFile(path.resolve("./src/client/index.html"), function (err) {
            if (err) {
                log.error('something bad happened', err);
            } else {
                log.info('Sent:', path.resolve("./src/client/index.html"));
            }
        })
    });
    app.post('/login/:email/:pass', login);
    app.get('/findUser/:email', findUser);
    app.get('/addUser/:email/:pass', addUser);
    app.put('/getFile', getFile);
    app.post('/addFolder', addFolder);
    //app.post('/removeFolder/:email/:pathInToFolder/:nameRemoveFolder', removeFolder);
    app.post('/renameFolder', renameFolder);
    // app.post('/removeFile/:email/:pathInToFolder/:nameRemoveFile', removeFile);
    app.post('/renameFile', renameFile);
};
