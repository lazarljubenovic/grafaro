# [Grafaro](https://lazarljubenovic.github.io/grafaro/)

Grafaro is a web app for collaborative learning about graph algorithms. You can [view it online](https://lazarljubenovic.github.io/grafaro/), although this is usually not the latest build. Clone and run locally to see the latest versions (see below for instructions).

## Features

 - Complete control over graph: add, delete, rename nodes and edges and move them around
 - Choose an algorithm to inspect (more coming soon)
 - View the code as it executes step-by-step
 - Inspect current state of the algorithm with a list of variables and its contents
 - The state is also visualized though colors on graph
 - View the graph in its matrix representation (also editable)
 - Configure additional algorithm options, such as the starting node (root)
 - Invite others to join the room and watch the algorithm as it executes together (supported with live chat)
 - Save your graphs and share them with others 

## Running locally

### Downloading source

```
git clone https://github.com/lazarljubenovic/grafaro
cd grafaro
yarn # you can also use: npm install
```

### Running Angular

You can run the application with a limited set of features without running the server.

```
ng serve
```

Open `localhost:4200` in browser.

### Running server

For full set of features (collaboration and persistance), run the server as well.

```
yarn ts:build
yarn serve
```

You might need to refresh the page if you run server after starting Angular.

### Generating docs

```
yarn compodoc
```

---

Project generated with [angular-cli](https://github.com/angular/angular-cli).


