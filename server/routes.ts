import * as express from 'express';
import {IUser, DBGraph, GraphFileInfo} from './interfaces';
import * as mongoose from 'mongoose';


export const databaseRoutes = express.Router();

const graphSchema = new mongoose.Schema({
    lastModified: Number,
    name: String,
    graph: {
        nodes: [{
            _id: false,
            id: String,
            label: String,
            position: {
                x: Number,
                y: Number,
            },
            weight: Number
        }],
        edges: [{
            _id: false,
            id: String,
            from: String,
            to: String,
            label: String,
            weight: Number,
        }],
        nextNodeId: Number,
        nextEdgeId: Number,
    },
}, {_id: false});

const userSchema = new mongoose.Schema({
    socialId: String,
    displayName: String,
    graphs: [graphSchema],
});

const User = mongoose.model<IUser>('User', userSchema);

databaseRoutes.get('/user', (req, res) => {
    console.log('Getting users');
    User.find()
        .then((dbUser: IUser[]) => res.json({data: dbUser}))
        .catch(error => res.json({error: error}));
});

databaseRoutes.delete('/user', (req, res) => {
    console.log('Deleting all users...');
    User.find()
        .remove()
        .then((result) => res.json({status: 'success'}))
        .catch((error) => res.json({error}));
});

function createNewUser(socialId: string, success: Function, error: Function) {
    let newUser = new User({
        graph: [],
        displayName: socialId,
        socialId: socialId
    });

    newUser.save()
        .then(dbUser => success(dbUser))
        .catch(err => error(err));
}

databaseRoutes.get('/user/social/:id', (req, res) => {
    const socialId = req.params['id'];
    console.log('Getting user with social id', socialId);
    User.findOne({socialId})
        .then((dbUser: IUser) => {
            if (dbUser) {
                res.json({data: dbUser});
            } else {
                createNewUser(socialId,
                    (dbUser: IUser) => res.json({data: dbUser}),
                    (error) => res.json({error})
                );
            }
        })
        .catch(error => res.json({error: error}));
});

databaseRoutes.get('/user/:id', (req, res) => {
    console.log('Getting user', req.params['id']);
    User.findById(req.params['id'])
        .then((dbUser: IUser) => res.json({data: dbUser}))
        .catch(error => res.json({error: error}));
});

databaseRoutes.put('/user', (req, res) => {
    let socialId: string = req.body['data'].socialId;

    createNewUser(socialId,
        (dbUser: IUser) => res.json({data: {id: dbUser._id}}),
        (error) => res.json({error})
    );
});

databaseRoutes.post('/user/:id', (req, res) => {
    const id: string = req.params['id'];
    const user: IUser = req.body['data'];

    console.log('Updating user', req.params['id']);

    User.findByIdAndUpdate(id, {$set: {displayName: user.displayName}})
        .then(() => res.json({status: 'success'}))
        .catch(error => res.json({error}));
});

databaseRoutes.delete('/user/:id', (req, res) => {
    const id: string = req.params['id'];

    console.log('Removing user', id);
    User.findByIdAndRemove(id)
        .then(() => res.json({status: 'success'}))
        .catch((error) => res.json({error}));
});

databaseRoutes.put('/graph', (req, res) => {
    console.log('Adding graph');
    const userName = req.body['userName'];
    const graphName = req.body['graphName'];
    const graphJson = req.body['graphJson'];

    if (userName && graphName && graphJson) {
        let newGraph: DBGraph = {
            graph: graphJson,
            lastModified: Date.now(),
            name: graphName,
        };

        User.findOne({displayName: userName})
            .then(dbUser => {
                let user = dbUser;
                user.graphs.push(newGraph);
                User.findOneAndUpdate({displayName: userName}, user)
                    .then(() => res.json({status: 'success'}))
                    .catch((error) => res.json({error}));
            });
    } else {
        res.json({error: 'Something is undefined!'});
    }
});

databaseRoutes.get('/graph/:userName/:graphName', (req, res) => {
    const userName = req.params['userName'];
    const graphName = req.params['graphName'];

    console.log('userName', userName);
    console.log('graphName', graphName);

    User.findOne({displayName: userName}, {_id: 0})
        .then(dbUser => {
            const graph = dbUser.graphs
                .find(dbGraph => dbGraph.name == graphName)
                .graph;

            res.json({data: graph});
        })
        .catch((error) => res.json({error}));
});

databaseRoutes.get('/graph', (req, res) => {
    User.find()
        .then((dbUsers) => {
            let fileInfo = [];

            dbUsers.forEach(user => {
                if (user.graphs.length > 0) {
                    let graphsInfo: GraphFileInfo = {
                        name: user.displayName,
                        graph: [],
                    };
                    user.graphs.forEach(graph => {
                        graphsInfo.graph.push({
                            id: 1,
                            name: graph.name,
                            lastChange: graph.lastModified
                        });
                    });

                    fileInfo.push(graphsInfo);
                }
            });

            res.json({data: fileInfo});
        })
        .catch(error => res.json({error}));
});
