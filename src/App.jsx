import {Component} from "react";
import ReactPlayer from "react-player";

import "./App.css"

import Playlist from "./Playlist"

class App extends Component {
    state = {
        url: null,
        playlist: [],
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
            let pos = this.state.position - 1
            this.setState({
                url: this.state.playlist[pos].url,
                pos: pos,
                playing: true
            })
        }
    }

    next = () => {
        let pos;
        let playing = false;
        if (this.state.position < this.state.playlist.length - 1) {
            pos = this.state.position + 1
            playing = true
        } else if (this.state.loop === 1) {
            pos = 0;
            playing = true
        } else {
            pos = this.state.position
        }
        this.setState({
            url: this.state.playlist[pos].url,
            pos: pos,
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

    handleShuffle = () => {
        console.log("onShuffle")
        let playlist = [...this.state.playlist]
        this.shuffle(playlist)
        this.setState({
            url: playlist[0].url,
            playlist: playlist,
            pos: 0,
            playing: true
        })
        this.player.reload
    }

    handleLoop = () => {
        let loop = (this.state.loop + 1) % 3
        let loopText = ({
            0: "Loop: Off",
            1: "Loop: All",
            2: "Loop: Single"
        })[loop];
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

    handleAdd = (input) => {
        console.log("onAdd")
        let playlist = [
            ...this.state.playlist,
            ...input.split(/\r?\n/).map((url) => ({url: url, id: crypto.randomUUID()}))
        ]
        this.setState({})
        if (this.state.url == null) {
            this.setState({
                url: playlist[0].url,
                playlist: playlist,
                pos: 0,
                playing: true
            })
        } else {
            this.setState({
                playlist: playlist
            })
        }
    }

    ref = player => {
        this.player = player
    }

    render() {
        const {url, playlist, position, playing, played, loop, loopText} = this.state
        //const SEPARATOR = " · "
        //const loopLabel = ["Loop: Off", "Loop: All", "Loop: Single"]

        let loopSingle = loop === 2

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
                            loop={loopSingle}
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
                            <td>
                                <span>
                                    Playing ({((playlist.length > 0) ? (position + 1) : 0) + "/" + playlist.length}): {url}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button onClick={this.handleLoop}>
                                    {loopText}
                                </button>
                                <button onClick={this.handleShuffle}>Shuffle</button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button onClick={this.prev}>Prev</button>
                                <button onClick={this.next}>Next</button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button onClick={() => this.load("https://soundcloud.com/tycho/tycho-awake")}>
                                    Soundcloud autplay test
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </section>
                <section>
                    <table>
                        <tbody>
                        <tr>
                            <td>
                            <textarea
                                ref={input => {
                                    this.input = input
                                }}
                                placeholder="Enter URLs"
                                rows="5"
                            />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button onClick={() => this.handleAdd(this.input.value)}>Add</button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="playlist-wrapper">
                                    <Playlist data={playlist}/>
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