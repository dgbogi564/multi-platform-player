import { MouseEvent } from 'react';
import { SessionItem } from '../../interfaces/Item.tsx';

const SessionItemGenerator = (sessionId: number, loadSession: (e: MouseEvent) => void) => (
    ({ index, style, data }: SessionItem) => {
        // const isPlaying = () => sessionId === index;
        return (
            <div className='row interactive' aria-rowindex={index} style={style} onClick={loadSession}>
                <div className='index'>{index + 1}</div>
                <div className='name'>{data[index].title}</div>
            </div>
        );
    }
);

export default SessionItemGenerator;