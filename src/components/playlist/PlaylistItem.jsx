import React from "react";

const PlaylistItem = React.memo(({index, style, data}) => (
    <div className="playlist-item" style={style}>
        <div className="playlist-index">{index + 1}.</div>
        <div className="playlist-url">{data[index].url}</div>
    </div>
))


export default PlaylistItem