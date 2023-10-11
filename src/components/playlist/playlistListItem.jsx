import React from "react";

const PlaylistListItem = React.memo(({index, style, data}) => (
    <div className="playlistList-item" style={style}>
        <div className="playlist-index">{index + 1}.</div>
        <div className="playlist-name">{data[index].name}</div>
    </div>
))

export default PlaylistListItem