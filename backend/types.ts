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
    formatedTraffic: string;
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
    isDone: false;
    isNext: false;
    currentQueryOrder: string[]
}

export type GameState = {
    isRoundDone: boolean;
    playerStates: PlayerState[];
    secondLeftInRound: number;
    currentDay: Day;
}

export const createGameState = (day : Day, playerStates : PlayerState[]) : GameState => {
    
    return {
        playerStates : playerStates,
        isRoundDone: false,
        secondLeftInRound: 120,
        currentDay : day
    };
}

export const createDummyGameState = (word: string): GameState => {

    return {
        isRoundDone: false,
        playerStates: [],
        secondLeftInRound: 120,
        currentDay: {
            formattedDate : '',
            trendingSearches: []
        }
    }
}