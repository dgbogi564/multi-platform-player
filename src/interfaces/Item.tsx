import Track from './Track.tsx';
import Session from './Session.tsx';
import { CSSProperties, ReactElement } from 'react';

export interface Item {
    data: Array<Track> | Array<Session> | undefined,
    row: ({ index, style, data }: {
        index: number,
        style: CSSProperties,
        data: Array<any>,
    }) => ReactElement,
    itemSize?: number,
}

export interface TrackItem {
    index: number,
    style: CSSProperties,
    data: Array<Track>
}

export interface SessionItem {
    index: number,
    style: CSSProperties,
    data: Array<Session>
}