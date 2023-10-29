import React from "react";
import ReactPlayer from "react-player";

import List from "./components/playlist/List.jsx";
import PlaylistItemGenerator from "./components/playlist/PlaylistItemGenerator.jsx";
import SessionListItemGenerator from "./components/playlist/sessionListItemGenerator.jsx";
import {retrieve, store} from "./utils/localStorage.jsx";
import axios from "axios";

class App extends React.Component {

    state = {
        url: null,
        playlist: [],
        sessionList: retrieve("sessionList", []),
        playlistId: null,
        position: 0,
        playing: false,
        loop: 0,
        loopText: "Loop: Off"
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.playlistId != null && this.state.sessionList.length > 0) {
            this.storeState();
        }
    }

    load = (position = this.state.position, playlist = this.state.playlist) => {
        if (playlist === this.state.playlist) {
            playlist = [...playlist];
        }
        playlist[this.state.position].playing = false;
        playlist[position].playing = true;
        this.setState({
            url: playlist[position].url,
            playlist: playlist,
            position: position,
            playing: true
        });
        this.playlistRef.scrollToItem(position);
    };

    storeState = () => {
        let sessionList = [...this.state.sessionList];
        let playlistId = this.state.playlistId;
        let session = sessionList[playlistId];
        let state = this.state;
        session.state = {
            url: state.url,
            playlist: state.playlist,
            position: state.position
        };
        store("sessionList", sessionList);
    };

    loadState = (index) => {
        let state = this.state.sessionList[index].state;
        this.setState({
            ...state,
            playlistId: this.state.sessionList[index].id
        });
        this.load(state.position, state.playlist);
    };

    getThumbnail = async (position = this.state.position, playlist = this.state.playlist) => {
        let video = playlist[position];
        if (video.thumbnail_url) {
            return;
        }
        playlist = [...playlist];
        try {
            let data = (await axios.get("https://noembed.com/embed?url=" + video.url)).data;
            video.thumbnail_url = data.thumbnail_url;
            video.title = data.title;
            video.author_name = data.author_name;
            video.author_url = data.author_url;
        } catch (error) {
            console.log("Axios error: " + error);
        }
        this.setState({playlist: playlist});
    };

    prev = () => {
        let position = this.state.position;
        if (this.state.position > 0) {
            position = position - 1;
        } else if (this.state.loop === 1) {
            position = this.state.playlist.length - 1;
        }
        this.load(position);
    };

    next = () => {
        let position = this.state.position;
        if (this.state.position < this.state.playlist.length - 1) {
            position = this.state.position + 1;
        } else if (this.state.loop === 1) {
            position = 0;
        }
        this.load(position);
    };

    shuffle = (playlist) => {
        // Inside-Out Shuffle Algorithm
        for (let i = playlist.length - 1; i >= 0; i--) {
            const j = i + Math.floor(Math.random() * (playlist.length - i));
            [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
        }
    };

    handleLoop = () => {
        let loop = (this.state.loop + 1) % 3;
        let loopText = [
            "Loop: Off",
            "Loop: All",
            "Loop: Single"
        ][loop];
        this.setState({
            loop: loop,
            loopText: loopText
        });
        console.log("OnLoop", {loop, loopText});
    };


    handlePlay = () => {
        console.log("onPlay");
        let playlist = [...this.state.playlist];
        playlist[this.state.position].playing = true;
        this.setState({playlist: playlist, playing: true});
    };

    handleSeek = this.handlePlay;

    handlePause = () => {
        console.log("onPause");
        let playlist = [...this.state.playlist];
        playlist[this.state.position].playing = false;
        this.setState({playlist: playlist, playing: false});
    };

    handleEnded = () => {
        console.log("onEnded");
        this.next();
    };

    handleError = (error) => {
        console.log("onError", error);
        this.next();
    };

    handleReady = () => {
        console.log("onReady");
        this.getThumbnail();
    };

    handleShuffle = () => {
        console.log("onShuffle");
        let playlist = [...this.state.playlist];
        this.shuffle(playlist);
        this.load(0, playlist);
    };

    handlePlaylistItemTripleClick = (e) => {
        if (e.detail === 3) {
            let index = parseInt(e.currentTarget.getAttribute("aria-rowindex"));
            this.handleClickPlay(index);
        }
    };
    handlePlaylistItemButtonClick = (e) => {
        let index = parseInt(e.currentTarget.getAttribute("data-value"));
        this.handleClickPlay(index);
    };

    handleClickPlay = (index) => {
        if (index === this.state.position) {
            (this.state.playing) ? this.handlePause() : this.handlePlay();
        } else {
            this.load(index);
        }
    };

    handleSessionListItemClick = (e) => {
        this.loadState(parseInt(e.currentTarget.getAttribute("aria-rowindex")));
    };


    handlePlayButton = (input) => {
        console.log("onPlayButton");
        let playlist = input.split(/\r?\n/).filter(e => e != null && e !== "").map((url, index) => {
            url = "https://" + url.replace("https://", "").replace("http://", "");
            return {url: url, id: index, playing: false};
        });
        let sessionList = [...this.state.sessionList];
        let playlistId = sessionList.length;
        sessionList.push({
            name: new Date().toTimeString(),
            id: playlistId,
            state: this.state
        });
        this.setState({sessionList: sessionList, playlistId: playlistId});
        this.load(0, playlist);
        store("textAreaInput", input);
        store("sessionList", sessionList);
    };

    handlePlaylistRef = ref => {
        this.playlistRef = ref;
    };

    handlePlayerRef = ref => {
        this.playerRef = ref;
    };

    render() {
        const {url, playlist, sessionList, position, playing, loop, loopText} = this.state;

        return (
            <div className="app">
                <section>
                    <h1>Playlist Shuffler</h1>

                    <div className='player-wrapper'>
                        <ReactPlayer
                            ref={this.handlePlayerRef}
                            className="react-player"
                            width="100%"
                            height="100%"
                            url={url}
                            playing={playing}
                            loop={loop === 2}
                            controls={true}
                            onReady={this.handleReady}
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
                                <button onClick={this.handleShuffle}>Shuffle</button>
                                <button onClick={this.prev}>Prev</button>
                                <button onClick={this.next}>Next</button>
                                <button onClick={this.handleLoop}>{loopText}</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    <div className="sessionList-wrapper">
                        <List data={sessionList}
                              row={SessionListItemGenerator(this.handleSessionListItemClick)}/>
                    </div>

                </section>

                <section>

                    <textarea
                        ref={input => {
                            this.input = input;
                        }}
                        placeholder="Enter URLs (one per line)"
                        defaultValue={retrieve("textAreaInput")}
                        rows="5"
                    />

                    <table>
                        <tbody>
                        <tr>
                            <td>
                                <button className="play-button"
                                        onClick={() => this.handlePlayButton(this.input.value)}>Play
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="playlist-wrapper">
                                    <List data={playlist} ref={this.handlePlaylistRef}
                                          row={PlaylistItemGenerator(this.handlePlaylistItemTripleClick, this.handlePlaylistItemButtonClick)}/>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </section>
            </div>
        );
    }
}

export default App;