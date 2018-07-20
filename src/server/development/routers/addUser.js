import {User} from '../models/user';
import {Store} from '../models/store';
import log from 'winston';
import {createFolderInYandex} from '../services';

export const addUser = (req, res) => {
    createFolderInYandex(req.params.email).then(function () {
        let user = new User({
            email: req.params.email,
            password: req.params.pass
        });

        let store = new Store(
            {
                email: req.params.email,
                treeStore: [
                ]
            }
        );
        store.treeStore.push(
                {
                    categoryName: 'root',
                    categoryArray: [],
                    imagesArray: []
                }
        );
        store.save((err)=>{
            if(err) {
                log.info(err);
            }else{
                log.info('store added');
            }
        });

        user.save((err)=>{
            if(err) {
                log.info(err);
            }else{
                log.info(`user req.params.email added`);
            }
        });
    });
    res.sendStatus(200);
};