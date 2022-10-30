import { Day, Search } from "./types";

const googleTrends = require('google-trends-api');

const SEARCH_GEO_LOCATION = 'FI';

let days : Day[] = [];
let lastRetrievedDate : Date = new Date();

export const loadData = () => {
    return new Promise<Day[]>( (resolve, reject) => {
        googleTrends.dailyTrends({
            trendDate: lastRetrievedDate,
            geo: SEARCH_GEO_LOCATION,
        }, function (err : any, results : any) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                const data = parseData(results);
                data.forEach(day => setSeachOrderNumbers(day));
                setNextRetrieveDate(new Date(data[data.length-1].formattedDate));
                shuffleSearches(data);
                resolve(data);
            }
        });
    });
}

const setNextRetrieveDate = (lastDateFromPrevRequest : Date) => {
    lastRetrievedDate = new Date(lastDateFromPrevRequest.getTime() - (1000 * 60 * 60 * 24 ));
    console.log('Next retrieval date set to ',lastRetrievedDate);
}

const parseData = (data : string) : Day[] => {
    const dataJson = JSON.parse(data);
    const days : Day[] = dataJson.default.trendingSearchesDays;
    return days;
}

const shuffleSearches = (days : Day[]) => {
    days.forEach( day => {
        let newSearches : Search[] = [];
        while( day.trendingSearches.length > 0 ) {
            const idx = getRandomInt(day.trendingSearches.length);
            newSearches.push(day.trendingSearches.splice(idx,1)[0]);
        }
        day.trendingSearches = newSearches;
    });
}

const setSeachOrderNumbers = (day : Day) => {
    for(let i = 0; i < day.trendingSearches.length; i++)
        day.trendingSearches[i].orderNumber = i;
}

const getRandomInt = (max : number) => {
    return Math.floor(Math.random() * max);
}