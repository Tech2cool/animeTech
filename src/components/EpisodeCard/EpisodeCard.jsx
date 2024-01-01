import React from 'react'

const EpisodeCard = ({ episode, current_ep, onclick, from }) => {
    return (
        <div>
            {
                from === "video" && (

                    onclick && onclick ? (<div className={`video-episode ${current_ep && current_ep === episode.number ? 'active' : ''}`} onClick={onclick}>
                        <p id='vid-epnum'>{episode.number}</p>
                    </div>)
                        : (
                            <div className={`video-episode ${current_ep && current_ep === episode.number ? 'active' : ''}`}>
                                <p id='vid-epnum'>{episode.number}</p>
                            </div>)
                )
            }
            {
                from === "animeDetails" && (
                    <div className="anime-d-episode" >
                        <p id='epnumm'>EP <span>{episode.number}</span></p>
                        <p id='epTTL'>{
                            (episode.title && episode.title.english && episode.title.english) ||
                            (episode.title && episode.title.english_jp && episode.title.english_jp) ||
                            (episode.title && episode.title.japanese && episode.title.english_jp)
                        }</p>
                        <p id='ep-sub'>{episode.hasDub === false ? "SUB" : "DUB"}</p>
                    </div>
                )
            }

        </div>
    )
}

export default EpisodeCard
