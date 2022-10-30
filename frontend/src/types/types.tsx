export type SearchTitle = {
    query: string;
    exploreLink: string;
}

export type SearchImage = {
    imageUrl : string;
    newsUrl: string;
    source: string;
}

export type Search = {
    formattedTraffic: string;
    title: SearchTitle;
    image: SearchImage;
    orderNumber: number;
}

export type Day = {
    trendingSearches: Search[],
    formattedDate: string
}

export type PlayerState = {
    name: string;
    points: number;
    isDone: boolean;
    isNext: boolean;
    currentQueryOrder: string[];
}

export type GameState = {
    isRoundDone: boolean;
    playerStates: PlayerState[];
    secondLeftInRound: number;
    currentDay : Day;
}

export const copyGameState = (gameState: GameState) => {
    const playerStates = [...gameState.playerStates];

    return {
        playerStates,
        isRoundDone: gameState.isRoundDone,
        secondLeftInRound: gameState.secondLeftInRound,
        currentDay : gameState.currentDay
    };
}

export const createDummyGameState = (word: string): GameState => {

    return {
        isRoundDone: false,
        playerStates: [],
        secondLeftInRound: 120,
        currentDay: {
            formattedDate: '',
            trendingSearches: []
        }
    }
}