import {User} from '../models/user';
import log from 'winston';

export const addUser = (req, res) => {
    let user = new User({
        email: req.params.email,
        password: req.params.pass
    });
    user.save((err)=>{
        if(err) {
            log.info(err);
            res.sendStatus(404);
        }else{
            log.info('user added');
            res.sendStatus(200);
        }
    });
};