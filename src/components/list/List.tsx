import { memo, useCallback } from 'react';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Item } from '../../interfaces/Item.tsx';


const List = memo(({ data, row, itemSize = 56 }: Item) => {
    const calcWidth = useCallback((width: number) => width || 500, []);
    const calcHeight = useCallback((height: number) => height || 500, []);
    const calcKey = useCallback((index: number) => data![index].key, [data]);
    const FixedSizeListGenerator = useCallback(({ height, width }: {
        height: number,
        width: number
    }) => (
        <FixedSizeList
            className='list'
            itemKey={calcKey}
            itemData={data}
            width={calcWidth(width)}
            height={calcHeight(height)}
            itemCount={data?.length || 0}
            itemSize={itemSize}
        >
            {row}
        </FixedSizeList>
    ), [calcHeight, calcKey, calcWidth, data, itemSize, row]);

    return (
        <AutoSizer>
            {FixedSizeListGenerator}
        </AutoSizer>
    );
});


export default List;