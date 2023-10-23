import React from "react"
import {FixedSizeList} from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"

const List = React.memo(({data = null, row, itemSize = 44}) => (
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

List.displayName = "ListComponent"

export default List