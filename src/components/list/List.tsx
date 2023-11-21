import { forwardRef, memo, useCallback } from 'react';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Item } from '../../interfaces/Item.tsx';
import Session from '../../interfaces/Session.tsx';
import Track from '../../interfaces/Track.tsx';

const List = memo(forwardRef<FixedSizeList<Track[] | Session[]> | null, Item>(({ data, row, itemSize = 56 }, ref) => {
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
            ref={ref}
        >
            {row}
        </FixedSizeList>
    ), [calcHeight, calcKey, calcWidth, data, itemSize, ref, row]);

    return (
        <AutoSizer>
            {FixedSizeListGenerator}
        </AutoSizer>
    );
}));

export default List;