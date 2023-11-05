import { useMemo } from 'react';
import ReactPlayer from 'react-player';
import useStore, { select } from './state/store.tsx';
import List from './components/list/List.tsx';
import TrackItemGenerator from './components/list/TrackItemGenerator.tsx';
import SessionItemGenerator from './components/list/SessionltemGenerator.tsx';
import Track from './interfaces/Track.tsx';


export default App;

function App() {

    const playing = useStore(select.playing);
    const input = useStore(select.input);
    const action = useStore(select.action);
    const sessionList = useStore(select.session.list);
    const sessionId = useStore(select.session.id);

    let playlist = [] as Array<Track>, loop = null, index = -1, track = null;
    if (sessionId !== -1) {
        const session = sessionList[sessionId];
        playlist = session.playlist;
        loop = session.loop;
        index = session.index;
        track = playlist[index];
    }

    return (
        <>
            <h1>Playlist Shuffler</h1>

            <section>

                <div className='player-wrapper'>
                    <ReactPlayer
                        className='react-player'
                        width='100%'
                        height='100%'
                        url={track?.url}
                        playing={playing}
                        controls={true}
                        loop={loop?.single}
                        onReady={action.handle.ready}
                        onStart={action.handle.start}
                        onPlay={action.handle.play}
                        onPause={action.handle.pause}
                        onBuffer={action.handle.buffer}
                        onEnded={action.handle.ended}
                        onError={action.handle.error}
                    />
                </div>

                <table>
                    <tbody>
                    <tr>
                        <th>
                            Playing ({index + 1} / {playlist.length}):
                        </th>
                        <td>
                            <a href={track?.url} target="_blank" rel="noreferrer">{track ? track.url : 'N/A'}</a>
                        </td>
                    </tr>
                    <tr>
                        <th>Controls</th>
                        <td>
                            <button onClick={action.shuffle}>Shuffle</button>
                            <button onClick={action.prev}>Prev</button>
                            <button onClick={action.next}>Next</button>
                            <button onClick={action.toggle.loop}>{loop?.text || 'Loop: Off'}</button>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <div className='sessionList-wrapper'>
                    <List data={sessionList}
                          row={useMemo(() => SessionItemGenerator(
                              sessionId,
                              action.load.session,
                          ), [action.load.session, sessionId])}
                    />
                </div>

            </section>

            <section>

                <textarea placeholder='Enter URLs (one per line)'
                          rows={5}
                          defaultValue={input}
                          onChange={action.handle.input}/>

                <div className='play-button-wrapper'>
                    <button onClick={action.load.playlist}>
                        Play
                    </button>
                </div>


                <div className='playlist-wrapper'>
                    <List data={playlist}
                          row={useMemo(() => TrackItemGenerator(
                              playing,
                              index,
                              action.toggle.play,
                          ), [index, playing, action.toggle.play])}
                    />
                </div>

            </section>

            <footer>
                <a href='https://github.com/dgbogi564/playlist-randomizer'>Github</a>
            </footer>
        </>
    );
}
