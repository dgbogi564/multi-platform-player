import {memo} from "react";

const SessionListItemGenerator = (onClick = null) => {
    let sessionItem = memo(({index, style, data}) => (
        <div className="list-item interactive" aria-rowindex={index} style={style} onClick={onClick}>
            <div className="item-index">{index + 1}</div>
            <div className="item-name">{data[index].name}</div>
        </div>
    ))
    sessionItem.displayName = "SessionListItemComponent"
    return sessionItem;
}

export default SessionListItemGenerator