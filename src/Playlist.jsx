import React from "react"
import {FixedSizeList as List} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import "./Playlist.css"

export default function Playlist({data = null, itemSize = 20}) {
    return (
        <AutoSizer>
            {({height, width}) => (
                <List
                    itemKey={(index, data) => data[index].id}
                    itemData={data}
                    className="List"
                    width={width}
                    height={height}
                    itemCount={(data) ? data.length : 50}
                    itemSize={itemSize}
                >
                    {Row}
                </List>
            )}
        </AutoSizer>
    )
}

const Row = ({index, style, data}) => (
    <div className="playlist-item" style={style}>
        <div className="playlist-index">{index+1}.</div>
        <div className="playlist-url">{data[index].url}</div>
    </div>
);
