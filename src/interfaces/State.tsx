import { ChangeEvent, MouseEvent } from 'react';
import Session from './Session.tsx';

interface State {
    playing: boolean,
    input: string,
    session: {
        id: number,
        list: Array<Session>,
    },
    action: {
        load: {
            track: (index: number) => void,
            playlist: () => void,
            session: (e: MouseEvent) => void,
        },
        prev: () => void,
        next: () => void,
        shuffle: () => void,
        handle: {
            ready: () => void,
            start: () => void,
            play: () => void,
            pause: () => void,
            buffer: () => void,
            ended: () => void,
            error: (e: MouseEvent) => void,
            input: (e: ChangeEvent) => void,
        },
        toggle: {
            play: (e: MouseEvent) => void,
            loop: () => void,
        },
        fetchOEmbed: () => Promise<void>,
    }
}

export default State;