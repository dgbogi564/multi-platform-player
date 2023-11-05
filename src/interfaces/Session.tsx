import Track from './Track.tsx';
import Loop from './Loop.tsx';

interface Session {
    key: string,
    title: string,
    playlist: Array<Track>;
    index: number,
    loop: Loop,
    input: string,
}

export default Session;