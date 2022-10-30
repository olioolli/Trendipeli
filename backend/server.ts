// Importing module
import express from 'express';
import cors from 'cors';
import * as WebSocket from 'ws';
import * as http from 'http';
import { createGameState, Day } from './types';
import { gameState, setGameState, updateGameState } from './gameStateHandler';
import { loadData } from './trendApi';

//readDictionary();

const app = express();
const PORT: Number = 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

interface ExtWebSocket extends WebSocket {
    isAlive: boolean;
}

let isDataLoading = false;
let days : Day[] = [];
let dayIdx = -1;

const loadMoreDays = async () => {
    if( isDataLoading ) return;

    console.log("Loading more data");
    isDataLoading = true;
    const data = await loadData();
    days = [...days, ...data];
    console.log("Got data: "+data.length);
    isDataLoading = false;
};

const setupNextRound = async () => {
    if( isDataLoading ) return;

    dayIdx++;

    if( dayIdx >= days.length )
        await loadMoreDays();
    //else if( dayIdx >= days.length-1 )
      //  loadMoreDays();
    
    console.log("Setting game state");
    setGameState(createGameState(days[dayIdx],gameState.playerStates));
}

setupNextRound();

wss.on('connection', (ws: ExtWebSocket) => {

    ws.isAlive = true;

    ws.on('pong', () => {
        ws.isAlive = true;
    });

    ws.on('message', (message: string) => {
        if (message === "gamestate") {

        }

        ws.send(`Received message: ${message}`);
    });
});

server.listen(process.env.PORT || 8999, () => {
    console.log("Listening...");
});

setInterval(() => {
    wss.clients.forEach((ws) => {
        const extWs = ws as ExtWebSocket;
        if (!extWs.isAlive) return extWs.terminate();

        extWs.isAlive = false;
        extWs.ping(null, false);
    });
}, 10000);

const broadCastGameState = () => {
    wss.clients.forEach((ws) => {
        const extWs = ws as ExtWebSocket;
        if (!extWs.isAlive) return;
        extWs.send(JSON.stringify(gameState));
    });
};

// Handling GET / Request
app.get('/', (req, res) => {
    res.send('Welcome to typescript backend!');
})

// Server setup
app.listen(PORT, () => {
    console.log('The application is listening '
        + 'on port http://localhost:' + PORT);
})

app.post("/login", async (req, res) => {
    if (req.body.username) {
        if (!addUser(req.body.username)) {
            res.sendStatus(400);
            return;
        }
        else {
            res.sendStatus(200);
            broadCastGameState();
            return;
        }
    }
    res.send(500);
});

app.get("/isLoggedIn", (req, res) => {
    try {
        const username = req.query.username as string;
        const result = getUser(username) != undefined;
        res.send(JSON.stringify({ isLoggedIn: result }));
    }
    catch (err) {
        res.send(JSON.stringify({ isLoggedIn: false }));
    }
});

app.post("/game", async (req, res) => {
    const newGameState = req.body.game;
    const sendingPlayerName = req.body.player;
    updateGameState(newGameState, sendingPlayerName);

    await handleStartNextRound();

    broadCastGameState();
    res.status(200).json(gameState);
});

app.get("/game", (req, res) => {
    res.send(JSON.stringify(gameState));
});

app.get("/users", (req, res) => {
    res.send(JSON.stringify(users));
});

app.get("/reset", async (req, res) => {

    users = [];
    broadCastGameState();
    res.send("Game reset");
});

app.get("/next", async (req, res) => {
    
    broadCastGameState();
    res.send("Next");
});

const addUser = (username: string) => {
    if (getUser(username))
        return true;

    gameState.playerStates.push({ name: username, points: 0, isDone: false, isNext: false, currentQueryOrder: []});
    users.push(username);
    return true;
}

const handleStartNextRound = async () => {
    if (!gameState.isRoundDone || !isAllPlayerNext()) return;

    gameState.playerStates.forEach(state => {
        state.isDone = false
        state.isNext = false;
    });

    await setupNextRound();
}

const isAllPlayerNext = () => {
    return gameState.playerStates.filter(state => !state.isNext).length === 0;
}

const getUser = (username: string) => {
    for (let user of users)
        if (user === username)
            return user;

    return undefined;
}

let users: string[] = [];