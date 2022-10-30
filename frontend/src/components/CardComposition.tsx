import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Search } from '../types/types';
import { Card } from './Card';

export type CardCompositionProps = {
    searches : Search[]
    orderedSearches: Search[];
    setOrderedSearches: React.Dispatch<React.SetStateAction<Search[]>>;
    isRoundDone: boolean;
}

export const CardComposition = ( props : CardCompositionProps ) => {

    

    const handleSwapSearchOrder = (searchQuery1 : string, searchQuery2 : string) => {
        const idx1 = props.orderedSearches.findIndex( (search) => search.title.query === searchQuery1 );
        const idx2 = props.orderedSearches.findIndex( (search) => search.title.query === searchQuery2 );

        const newOrderedSeach = [...props.orderedSearches];
        newOrderedSeach[idx1] = props.orderedSearches[idx2];
        newOrderedSeach[idx2] = props.orderedSearches[idx1];
        props.setOrderedSearches(newOrderedSeach);
    };

    useEffect(() => {
        if( !props.isRoundDone)
            props.setOrderedSearches(props.searches);
    },[props.searches])

    return (
        <MainDiv>
         {
            props.orderedSearches.map((search, idx) => (
                <Card
                    key={idx}
                    orderNumber={idx}
                    isRoundDone={props.isRoundDone}
                    search={search} 
                    swapSearchOrder={handleSwapSearchOrder}
                    />
            ))
         }
        </MainDiv>
    )
}


const MainDiv = styled.div`
display:flex;
flex-direction: column;
overflow: auto;
overflow-x: clip;
`;