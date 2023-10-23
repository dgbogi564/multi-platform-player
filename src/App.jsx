import {Component} from "react"
import ReactPlayer from "react-player"

import List from "./components/playlist/List.jsx"
import PlaylistItem from "./components/playlist/PlaylistItem.jsx"
import PlaylistListItem from "./components/playlist/playlistListItem.jsx"
import {retrieve, store} from "./utils/localStorage.jsx"

class App extends Component {
    state = {
        url: null,
        playlist: [],
        playlistList: retrieve("playlistList", []),
        playlistId: null,
        position: 0,
        playing: false,
        played: 0,
        loop: 0,
        loopText: "Loop: Off"
    }


    load = url => {
        this.setState({url: url, playing: true})
    }

    prev = () => {
        if (this.state.position > 1) {
            let position = this.state.position - 1
            this.setState({
                url: this.state.playlist[position].url,
                position: position,
                playing: true
            })
        }
    }

    next = () => {
        let position
        let playing = false
        if (this.state.position < this.state.playlist.length - 1) {
            position = this.state.position + 1
            playing = true
        } else if (this.state.loop === 1) {
            position = 0;
            playing = true
        } else {
            position = this.state.position
        }
        this.setState({
            url: this.state.playlist[position].url,
            position: position,
            playing: playing
        })
    }

    shuffle = (playlist) => {
        // Fisher-Yates shuffle algorithm: https://stackoverflow.com/a/6274381
        let i, j, temp;
        for (i = playlist.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1))
            temp = playlist[i];
            playlist[i] = playlist[j];
            playlist[j] = temp;
        }
        this.player.seekTo(0)
    }

    handleLoop = () => {
        let loop = (this.state.loop + 1) % 3
        let loopText = [
            "Loop: Off",
            "Loop: All",
            "Loop: Single"
        ][loop];
        this.setState({
            loop: loop,
            loopText: loopText
        })
        console.log("OnLoop", {loop, loopText})
    }


    handlePlay = () => {
        console.log("onPlay")
        this.setState({playing: true})
    }

    handleSeek = this.handlePlay

    handlePause = () => {
        console.log("onPause")
        this.setState({playing: false})
    }

    handleEnded = () => {
        console.log("onEnded")
        this.next()
    }

    handleError = (e) => {
        console.log("onError", e)
        this.forceUpdate()
        this.next()
    }

    handleShuffle = (input) => {
        console.log("onShuffle")

        let playlist = input.split(/\r?\n/).map((url) => ({
            url: "https://" + url.replace("https://", "").replace("http://", ""),
            id: crypto.randomUUID()
        }))
        this.shuffle(playlist)

        let playlistList = [...this.state.playlistList]
        let playlistId = this.state.playlistId
        if (playlistId == null) {
            playlistId = playlistList.length
        }
        playlistList.push({
            name: new Date().toTimeString(),
            id: playlistList.length,
            playlist: playlist
        })

        this.setState({
            url: playlist[0].url,
            playlist: playlist,
            playlistId: playlistId,
            playlistList: playlistList,
            playing: true,
            position: 0
        })

        store("textAreaInput", input)
        store("playlistList", playlistList)
    }

    ref = player => {
        this.player = player
    }

    render() {
        const {url, playlist, playlistList, position, playing, loop, loopText} = this.state

        return (
            <div className="app">
                <section>
                    <h1>Playlist Shuffler</h1>

                    <div className='player-wrapper'>
                        <ReactPlayer
                            ref={this.ref}
                            className="react-player"
                            width="100%"
                            height="100%"
                            url={url}
                            playing={playing}
                            loop={loop === 2}
                            controls={true}
                            onReady={() => console.log("onReady")}
                            onStart={() => console.log("onStart")}
                            onPlay={this.handlePlay}
                            onPause={this.handlePause}
                            onBuffer={() => console.log("onBuffer")}
                            onSeek={this.handleSeek}
                            onEnded={this.handleEnded}
                            onError={this.handleError}
                            onPlaybackQualityChange={e => console.log("onPlaybackQualityChange", e)}
                        />
                    </div>

                    <table>
                        <tbody>
                        <tr>
                            <th>
                                Playing ({((playlist.length > 0) ? (position + 1) : 0) + " / " + playlist.length}):
                            </th>
                            <td>
                                <a href={url} target="_blank" rel="noreferrer">{url ? url : "N/A"}</a>
                            </td>
                        </tr>
                        <tr>
                            <th>Controls</th>
                            <td>
                                <button onClick={this.prev}>Prev</button>
                                <button onClick={this.next}>Next</button>
                                <button onClick={this.handleLoop}>{loopText}</button>

                            </td>
                        </tr>
                        </tbody>
                    </table>

                    <div className="playlistList-wrapper">
                        <List data={playlistList} row={PlaylistListItem}/>
                    </div>

                </section>

                <section>

                    <textarea
                                ref={input => {
                                    this.input = input
                                }}
                                placeholder="Enter URLs"
                                defaultValue={retrieve("textAreaInput")}
                                rows="5"
                            />

                    <table>
                        <tbody>
                        <tr>
                            <td>
                                <div className="shuffle-button">
                                    <button onClick={() => this.handleShuffle(this.input.value)}>Shuffle</button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="playlist-wrapper">
                                    <List data={playlist} row={PlaylistItem}/>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </section>
            </div>
        )
    }
}

export default App