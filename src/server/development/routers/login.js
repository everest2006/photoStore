import {User} from '../models/user';

export const login = (req, res) => {
    User.findOne({email: req.params.email, password: req.params.pass}, (err, answer)=> {
        answer ? res.send(true) : res.send(false);
    });
};
