//import {express, path, app, port} from "./config.js";

import path from 'path';
import express from 'express';
import config from 'config';
import log from 'winston';
import bodyParser from 'body-parser';
import {serverRouters} from './routers';

const app = express();

app.use(express.static(path.resolve('./src/client/css')));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());

serverRouters(app);

app.listen(config.get('server.port'), (err) => {
    if (err) {
        log.error('something bad happened', err)
    }
    log.info(`server is listening on ${config.get('server.port')}`)
});
