import React from "react";
import {FixedSizeList} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import "./PlaylistItem.css"

const List = React.memo(({data = null, row, itemSize = 20}) => (
    <AutoSizer>
        {({height, width}) => (
            <FixedSizeList
                itemKey={(index, data) => data[index].id}
                itemData={data}
                className="list"
                width={width}
                height={height}
                itemCount={data.length}
                itemSize={itemSize}
            >
                {row}
            </FixedSizeList>
        )}
    </AutoSizer>
))

export default List