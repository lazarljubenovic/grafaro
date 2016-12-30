import * as express from 'express';
import {IUser, IProject, defaultGraph} from './interfaces';
import * as mongoose from 'mongoose';


export const dbRoutes = express.Router();

const userSchema = new mongoose.Schema({
    id: String,
    googleId: String,
    twitterId: String,
    projectIds: [String],
    username: String,
    displayName: String,
    favProjects: [String],
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
        }]
    },
    name: String,
    description: String,
});

const User = mongoose.model<IUser>('User', userSchema);
const Project = mongoose.model<IProject>('Project', projectSchema);

dbRoutes.get('/user', (req, res) => {
    console.log('Getting users', req.params['id']);
    User.find()
        .then((dbUser: IUser[]) => res.json({data: dbUser}))
        .catch(error => res.json({error: error}));
});

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
        .then((dbUser: IUser) => res.json({data: {id: dbUser._id}}))
        .catch(error => res.json({error}));
});

dbRoutes.post('/user/:id', (req, res) => {
    const id: string = req.params['id'];
    const user: IUser = req.body['data'];

    console.log('Updating user', req.params['id']);

    User.update({_id: id}, {$set: {displayName: user.displayName}})
        .then(() => res.json({status: 'success'}))
        .catch(error => res.json({error}));
});

function getLastId(nodeEdgeObj: any): number {
    return parseInt(nodeEdgeObj.sort((A, B) =>
        parseInt(B.id.split('-')[1], 10) - parseInt(A.id.split('-')[1], 10))[0] // ensure ordering
        .id.split('-')[1], 10);
}

dbRoutes.get('/project/:id', (req, res) => {
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

dbRoutes.get('/project', (req, res) => {
    Project.find()
        .populate({path: 'creatorId', select: 'displayName'})
        .exec()
        .then((dbProjects: IProject[]) => res.json({data: dbProjects}))
        .catch(error => res.json({error}));
});

dbRoutes.put('/project', (req, res) => {
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

dbRoutes.post('/project/:id/save', (req, res) => {
    const projectId: string = req.params['id'];
    const algorithmId = req.body['data']['algorithmId'];
    const graph = req.body['data']['graph'];

    console.log('Updating project', projectId);

    updateProjectFields(projectId, res, {algorithmId, graph});
});

dbRoutes.post('/project/:id/rename', (req, res) => {
    const projectId: string = req.params['id'];
    const userId: string = req.body['data']['userId'];
    const name: string = req.body['data']['name'];

    updateProjectFieldsByUser(projectId, userId, res, {name});
});

dbRoutes.post('/project/:id/redescribe', (req, res) => {
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
