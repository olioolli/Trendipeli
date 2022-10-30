import React, { useState } from 'react';
import styled from 'styled-components';
import { Search } from '../types/types';
import { ImageWindow } from './ImageWindow';

export type CardProps = {
    search : Search;
    orderNumber: number;
    isRoundDone : boolean;
    swapSearchOrder : (searchQuery1 : string, searchQuery2 : string) => void;
}

export const Card = ( props : CardProps ) => {

    const handleDragStart = (e) => {
        e.dataTransfer.setData("text/plain", props.search.title.query);
    }

    const handleDragDrop = (e) => {
        e.preventDefault();
        props.swapSearchOrder(e.dataTransfer.getData("text/plain"), props.search.title.query);
    }

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const getOrderLabelColor = () => {
        if( !props.isRoundDone)
            return 'white';

        return props.orderNumber === props.search.orderNumber ? 'green' : 'red';
    }

    const [zoomedImgUrl, setZoomedImgUrl] = useState<string | undefined>();
    
    return (
        <MainDiv onDrop={handleDragDrop} onDragStart={ handleDragStart } onDragOver={handleDragOver} draggable="true">
            <LeftPanel>
                <OrderLabel color={getOrderLabelColor()} >#{props.orderNumber+1}</OrderLabel>
                <RealOrderLabel color={getOrderLabelColor()} isRoundDone={props.isRoundDone}>{props.search.orderNumber+1}</RealOrderLabel>
                <TrafficLabel isRoundDone={props.isRoundDone}>{props.search.formattedTraffic}</TrafficLabel>
            </LeftPanel>
            <RightPanel>
                <Image 
                onClick={() => {setZoomedImgUrl(props.search.image.imageUrl); console.log("afdaf")}} 
                src={props.search.image.imageUrl} />
                <QueryLabel>{props.search.title.query}</QueryLabel>
            </RightPanel>
            {zoomedImgUrl ? <ImageWindow imageClicked={ () => setZoomedImgUrl(undefined)} imageSrc={zoomedImgUrl}></ImageWindow> : <></>}
        </MainDiv>

    )
}

const Image = styled.img`
    max-height: 60px;
`;

const TrafficLabel = styled.p`
color: green;
visibility: ${props => props.isRoundDone ? 'visible' : 'hidden'};
`;

const OrderLabel = styled.p`
color: ${props => props.color};
`;

const RealOrderLabel = styled.p`
color: ${props => props.color};
visibility: ${props => props.isRoundDone ? 'visible' : 'hidden'};
`;

const QueryLabel = styled.p`
    margin-left: 1rem;
`;

const MainDiv = styled.div`
display:flex;
border: 1px solid white;
border-radius: 3px;
height: max-content;
padding: 5px 15px 5px 15px;
color: white;
width: 100%;
`;

const RightPanel = styled.div`
display:flex;
width: 100%;
`;


const LeftPanel = styled.div`
display:flex;
width: 50%;
justify-content: space-around;
`;