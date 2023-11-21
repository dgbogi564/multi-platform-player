import { MouseEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { TrackItem } from '../../interfaces/Item.tsx';

const TrackItemGenerator = (playing: boolean, currentIndex: number,
                            togglePlay: (e: MouseEvent) => void) => ({ index, style, data }: TrackItem) => (
    <div className='row' aria-rowindex={index} style={style} onClick={togglePlay}>
        <div className='index interactive' onClick={togglePlay}>
            {index === currentIndex && playing ? (<>
                <FontAwesomeIcon className='hover-hidden playing' icon={faVolumeHigh}/>
                <FontAwesomeIcon className='hover-show playing' icon={faPause}/>
            </>) : (<>
                <div className='hover-hidden paused'>{index + 1}</div>
                <FontAwesomeIcon className='hover-show paused' icon={faPlay}/>
            </>)}
        </div>
        <div className='display'>
            {
                (data[index].thumbnail_url)
                    ? (<img src={data[index].thumbnail_url} className='thumbnail' draggable="false" alt=''/>)
                    : (<img width='0' height='0' alt=''/>)
            }
            <div className='details'>
                <a className='title' href={data[index].url} target='_blank' rel='noreferrer'>
                    {data[index].title || data[index].url}</a>
                <a className='author' href={data[index].author_url} target='_blank' rel='noreferrer'>
                    {data[index].author_name}</a>
            </div>
        </div>
    </div>
);

export default TrackItemGenerator;