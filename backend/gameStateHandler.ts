import { createDummyGameState, GameState } from "./types";

export let gameState: GameState = createDummyGameState("af");

export const setGameState = (newGameState : GameState) => {
    gameState = newGameState;
}


export const updateGameState = (newState : GameState, sendingPlayerName : string) => {

    if( gameState.isRoundDone && !newState.isRoundDone )
        newState.isRoundDone = true;

    const sendingPlayerState = newState.playerStates.filter( state => state.name === sendingPlayerName)[0];
    const playerStateIdx = gameState.playerStates.findIndex( state => state.name === sendingPlayerName);
    gameState.playerStates[playerStateIdx] = sendingPlayerState;

    gameState.isRoundDone = gameState.playerStates.filter( (pState) => pState.isDone).length === gameState.playerStates.length;
};