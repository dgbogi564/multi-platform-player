import {memo, forwardRef} from "react"
import {FixedSizeList} from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"

const List = memo(forwardRef(({data = null, row, itemSize = 56}, ref) => {
        return (
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
                        ref={ref}
                    >
                        {row}
                    </FixedSizeList>
                )}
            </AutoSizer>
        )
    }
))

List.displayName = "ListComponent"

export default List