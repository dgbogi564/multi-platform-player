import React from "react";

const PlaylistListItem = React.memo(({index, style, data}) => (
    <div className="playlistList-item" style={style}>
        <div className="playlistList-index">{index + 1}.</div>
        <div className="playlistList-name">{data[index].name}</div>
    </div>
))

PlaylistListItem.displayName = "PlaylistListItemComponent"

export default PlaylistListItem