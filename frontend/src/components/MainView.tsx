import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Search } from '../types/types';
import { useGameState } from '../util/GameStateProvider';
import { CardComposition } from './CardComposition';
import { PlayerInfo } from './PlayerInfoComponent';
import { TimerComponent } from './TimerComponent';

export const MainView = () => {

    const { gameState, updateGameState, setPlayerDone, setPlayerNext } = useGameState();
    const [ orderedSearches, setOrderedSearches ] = useState<Search[]>([]);

    return (
        <MainDiv>
            <WordLayout>
                <DayLabel>{gameState.currentDay.formattedDate}</DayLabel>
                <TimerComponent timeLeftInSeconds={gameState.secondLeftInRound} />
            </WordLayout>

            <VerticalLayout>
                <ButtonDone onClick={() => setPlayerDone(orderedSearches)}>Done</ButtonDone>
                <ButtonNext onClick={setPlayerNext} visible={gameState.isRoundDone}>Next</ButtonNext>
                <CardComposition 
                orderedSearches={orderedSearches} 
                searches={gameState.currentDay.trendingSearches} 
                setOrderedSearches={setOrderedSearches}
                isRoundDone={gameState.isRoundDone} />
            </VerticalLayout>

            <PlayerInfoContainer>
                {
                    gameState.playerStates.map(playerState => (
                        <PlayerInfo key={playerState.name} isActive={false} name={playerState.name} points={playerState.points} ></PlayerInfo>
                    ))
                }
            </PlayerInfoContainer>
        
        </MainDiv>
    );
}

const ButtonDone = styled.button`

`;

const ButtonNext = styled.button`
visibility: ${props => props.visible ? 'visible' : 'hidden'};
`;

const DayLabel = styled.p`
    color: white;
`;

const MainDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 90%;
    justify-content: center;
`;

const WordLayout = styled.div`
    display: flex;
    flex-direction: row;
    width: 810px;
    justify-content: center;
`;

const VerticalLayout = styled.div`
width: 30%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    margin-top:10px;
    background: #0b242a;
    padding: 15px;
    max-height: 604px;
    box-shadow: 0px 7px 5px 0px rgba(0,0,0,0.75);
-webkit-box-shadow: 0px 7px 5px 0px rgba(0,0,0,0.75);
-moz-box-shadow: 0px 7px 5px 0px rgba(0,0,0,0.75);
rgba(0,0,0,0.75);
    border-radius: 5px;
    border: 1px solid #5c5757;
`;

const PlayerInfoContainer = styled.div`
    position: fixed;
    right: 30px;
    background: #0b242a;
    padding-left: 9px;
    padding-bottom: 11px;
    border-top-left-radius: 8px;
    border: 1px solid #5c5757;
`;

const ConcedeButton = styled.button`
background: #640404;
padding: 10px;
margin-left: 10px;
border-radius: 3px;
color: white;
border: ${props => props.isConcedeBtnDisabled ? '2px solid green' : '2px solid white'};
font-weight: bold;
`;