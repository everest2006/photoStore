import {User} from '../models/user';

export const findUser = (req, res) => {
    User.findOne({email: req.params.email}, (err, answer)=> {
        answer ? res.send(true) : res.send(false);
    });
};