# Sequence

* On create:
  Send `connect` message with user hash info

* Return `room info` message with info about all rooms.
Maybe add info about number of users in lobby or something like that.

* When user clicks _create new room_ send `create` message.
It should return `join` message.

* User who lands on `localhost:4200/room/:id` first send `connect` message and then send `join` message.

* Room messages: `chat`, `graph`, `algorithm`.

# Interfaces:

* basic message wrapper:
```
{
  payload: any;
  type: string;
  roomId: string; // empty when user has no room
  userHash: string;
}
```

* `connect` message:

```
{
  // empty, TBD
}
```

* `room info` message:

```
{
  rooms[]: {
    name: string;
    description: string;
    master: string:
    numberOfUsers: number;
    roomId: string;
  }    
}
```

* `create` message:

```
{
  // empty, TBD
}
```

* `join` message:

```
{
  roomId: string; // room to join
  error: string; // error goes here
}
```

* `chat` message:

```
{
  message: string;
  timestamp: string;
}
```

* `graph` message:

```
{
  graph: Graph; // graphJson object
}
```

* `algorithm` message:

```
{
  algorithm: string; // abbrivation
  options: any; // here goes root, etc.
}
```

* `master` message:

```
{
  isMaster: boolean;
}
```
