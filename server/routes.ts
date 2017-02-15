import * as express from 'express';
import {IUser, IProject, defaultGraph, DBGraph, GraphFileInfo} from './interfaces';
import * as mongoose from 'mongoose';


export const databaseRoutes = express.Router();

const userSchema = new mongoose.Schema({
    socialId: String,
    displayName: String,
    graph: [{
        lastModified: Number,
        name: String,
        graph: {
            nodes: [{
                id: String,
                label: String,
                position: {
                    x: Number,
                    y: Number,
                },
                weight: Number
            }],
            edges: [{
                id: String,
                from: String,
                to: String,
                label: String,
                weight: String,
            }],
            nextNodeId: Number,
            nextEdgeId: Number,
        },
    }],
});

const projectSchema = new mongoose.Schema({
    id: String,
    creatorId: {type: String, ref: 'User'},
    algorithm: {
        id: String,
        options: Object,
    },
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
            id: String,
            from: String,
            to: String,
            label: String,
            directed: Boolean,
            weight: String,
        }],
        nextNodeId: Number,
        nextEdgeId: Number,
    },
    name: String,
    description: String,
});

const User = mongoose.model<IUser>('User', userSchema);
const Project = mongoose.model<IProject>('Project', projectSchema);

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
        .then((result) => res.json({status: 'succes'}))
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
    const userId = req.body['userId'];
    const graphName = req.body['graphName'];
    const graphJson = req.body['graphJson'];

    let newGraph: DBGraph = {
        graph: graphJson,
        lastModified: Date.now(),
        name: graphName,
    };

    User.findById(userId)
        .then(dbUser => {
            let user = dbUser;
            user.graph.push(newGraph);
            User.findByIdAndUpdate(userId, user)
                .then(() => res.json({status: 'success'}))
                .catch((error) => res.json({error}));
        });
});

databaseRoutes.get('/graph', (req, res) => {
    User.find()
        .then((dbUsers) => {
            let fileInfo = [];

            dbUsers.forEach(user => {
                let graphsInfo: GraphFileInfo = {
                    name: user.displayName,
                    graph: [],
                };
                user.graph.forEach(graph => {
                    graphsInfo.graph.push({
                        id: 1,
                        name: graph.name,
                        lastChange: graph.lastModified
                    });
                });

                fileInfo.push(graphsInfo);
            });

            res.json({data: fileInfo});
        })
        .catch(error => res.json({error}));
});

function getLastId(nodeEdgeObj: any): number {
    return parseInt(nodeEdgeObj.sort((A, B) =>
        parseInt(B.id.split('-')[1], 10) - parseInt(A.id.split('-')[1], 10))[0] // ensure ordering
        .id.split('-')[1], 10);
}

databaseRoutes.get('/project/:id', (req, res) => {
    console.log('Getting project', req.params['id']);

    Project.findById(req.params['id'])
        .lean(true)
        .exec()
        .then((dbProject: IProject) => {
            let nextNodeId = getLastId(dbProject.graph.nodes) + 1;
            let nextEdgeId = getLastId(dbProject.graph.edges) + 1;
            dbProject.graph.nextNodeId = nextNodeId;
            dbProject.graph.nextEdgeId = nextEdgeId;
            res.json({data: dbProject});
        })
        .catch(error => res.json({error}));
});

databaseRoutes.delete('/project/:id', (req, res) => {
    console.log('Deleting project', req.params['id']);

    Project.findById(req.params['id'])
        .remove()
        .then(() => res.json({status: 'success'}))
        .catch(error => res.json({error}));
});

databaseRoutes.get('/project', (req, res) => {
    Project.find()
        .populate({path: 'creatorId', select: 'displayName'})
        .exec()
        .then((dbProjects: IProject[]) => res.json({data: dbProjects}))
        .catch(error => res.json({error}));
});

databaseRoutes.put('/project', (req, res) => {
    console.log('Creating new project');

    const userId: string = req.body['data']['userId'];

    if (!userId) {
        res.json({status: 'error' + ': User is unknown'});
    } else {
        const projectName: string = req.body['data']['projectName'];

        const projectDescription: string = req.body['data']['projectDescription'];

        const newProject = new Project({
            creatorId: userId,
            name: projectName,
            description: projectDescription ? projectDescription : '',
            graph: defaultGraph,
            algorithm: {
                id: 'bfs',
                options: {
                    root: 'node-0'
                }
            },
        });

        newProject.save()
            .then((dbProject: IProject) => {
                User.update({_id: userId}, {$push: {projectIds: dbProject._id}})
                    .then(() => res.json({data: {id: dbProject._id}}))
                    .catch(error => res.json({error}));
            })
            .catch(error => res.json({error}));
    }
});

databaseRoutes.post('/project/:id/save', (req, res) => {
    const projectId: string = req.params['id'];
    const algorithmId = req.body['data']['algorithmId'];
    const graph = req.body['data']['graph'];

    console.log('Updating project', projectId);

    updateProjectFields(projectId, res, {algorithmId, graph});
});

databaseRoutes.post('/project/:id/rename', (req, res) => {
    const projectId: string = req.params['id'];
    const userId: string = req.body['data']['userId'];
    const name: string = req.body['data']['name'];

    updateProjectFieldsByUser(projectId, userId, res, {name});
});

databaseRoutes.post('/project/:id/redescribe', (req, res) => {
    const projectId: string = req.params['id'];
    const userId: string = req.body['data']['userId'];
    const description: string = req.body['data']['description'];

    updateProjectFieldsByUser(projectId, userId, res, {description});
});

function updateProjectFieldsByUser(id: string, userId: string, res, fieldObj): void {
    Project.findById(id)
        .then((dbProject: IProject) => {
            if (dbProject.creatorId == userId) {
                updateProjectFields(id, res, fieldObj);
            } else {
                res.json({error: 'The user is not the creator of the project.'});
            }
        })
        .catch(error => res.json({errror: error}));
}

function updateProjectFields(id: string, res, fieldObj): void {
    Project.update({_id: id}, {$set: fieldObj})
        .then(() => res.json({status: 'success'}))
        .catch(error => res.json({error}));
}
