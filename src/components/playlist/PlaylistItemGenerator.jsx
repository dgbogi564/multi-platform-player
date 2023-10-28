import {memo} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPause, faPlay, faVolumeHigh} from '@fortawesome/free-solid-svg-icons';

const PlaylistItemGenerator = (onTripleClickItem = null, onClickButton = null) => {
    const playlistItem = memo(({index, style, data}) => (
        <div className="list-item" aria-rowindex={index} style={style} onClick={onTripleClickItem}>
            <div className="item-index interactive" data-value={index} onClick={onClickButton}>
                {(data[index].playing) ? (<>
                    <FontAwesomeIcon className="hover-hidden" icon={faVolumeHigh}/>
                    <FontAwesomeIcon className="hover-show" icon={faPause}/>
                </>) : (<>
                    <div className="hover-hidden">{index + 1}</div>
                    <FontAwesomeIcon className="hover-show" icon={faPlay}/>
                </>)}
            </div>

            <div className="item-display">
                {(data[index].thumbnail_url) ? (
                    <img className="item-thumbnail" aria-hidden="false" draggable="false"
                         src={data[index].thumbnail_url}></img>
                ) : (
                    <img width="0" height="0"></img>
                )}
                <div className={"item-info"}>
                    <a className={"item-title"} href={data[index].url} target="_blank"
                       rel="noopener noreferrer">{data[index].title || data[index].url}</a>
                    <a className={"item-author"} href={data[index].author_url} target="_blank"
                       rel="noopener noreferrer">{data[index].author_name}</a>
                </div>
            </div>
        </div>
    ))
    playlistItem.displayName = "PlaylistItemComponent"
    return playlistItem;
}


export default PlaylistItemGenerator