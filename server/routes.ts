import * as express from 'express';
import {IUser, IProject} from './interfaces';
import * as mongoose from 'mongoose';


export const dbRoutes = express.Router();

const userSchema = new mongoose.Schema({
    id: String,
    googleId: String,
    twitterId: String,
    projectIds: [String],
    username: String,
    displayName: String,
});

const projectSchema = new mongoose.Schema({
    id: String,
    creatorId: String,
    algorithmId: String,
    graph: {
        nodes: [{
            id: String,
            label: String,
            position: {
                x: Number,
                y: Number,
            }
        }],
        edges: [{
            from: String,
            to: String,
            label: String,
            directed: Boolean,
        }]
    },
});

const User = mongoose.model<IUser>('User', userSchema);
const Project = mongoose.model<IProject>('Project', projectSchema);

dbRoutes.get('/user/:id', (req, res) => {
    console.log('Getting user', req.params['id']);
    User.findById(req.params['id'])
        .then((dbUser: IUser) => res.json({data: dbUser}))
        .catch(error => res.json({error: error}));
});

dbRoutes.put('/user', (req, res) => {
    console.log('Creating new user');
    let reqUser: IUser = req.body['data'];
    let newUser = new User({
        googleId: reqUser.googleId,
        twitterId: reqUser.twitterId,
        projectIds: [],
        username: reqUser.username,
        name: reqUser.displayName
    });

    newUser.save()
        .then((dbUser: IUser) => res.json({id: dbUser._id}))
        .catch(error => res.json({status: 'error' + error}));
});

dbRoutes.post('/user/:id', (req, res) => {
    const id: string = req.params['id'];
    const user: IUser = req.body['data'];

    console.log('Updating user', req.params['id']);

    User.update({_id: id}, { $set: { displayName: user.displayName }})
        .then(() => res.json({status: 'succes'}))
        .catch(error => res.json({status: 'error' + error}));
});
