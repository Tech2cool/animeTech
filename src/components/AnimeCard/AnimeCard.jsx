import React from 'react'

import "./AnimeCard.css";

const AnimeCard = ({ anime }) => {

    return (
        <div className="Anime-card">
            <div className="anime-poster">
                <img 
                src={
                    anime.animeImg && anime.animeImg? anime.animeImg: anime.img
                    } 
                    alt=
                    {
                        (anime.animeTitle && (anime.animeTitle.english && anime.animeTitle.english))||
                        (anime.animeTitle && (anime.animeTitle.english_jp && anime.animeTitle.english_jp))||
                        (anime.animeTitle && (anime.animeTitle.japanese && anime.animeTitle.japanese))||
                        (anime.title?anime.title:"")
                    }/>
            </div>
            <div className="anime-info">
                {
                    anime.AdditionalInfo && anime.AdditionalInfo.averageRating !== null ? 
                    (
                        <div className="anime-rating">
                            <i className='fa-solid fa-star'></i>
                            <p>{anime.AdditionalInfo.averageRating}</p>
                        </div>        
                    ):("")
                }

                <div className="anime-title">
                    <p>
                    {
                        anime.animeTitle?(
                            (anime.animeTitle.english && anime.animeTitle.english)||
                            (anime.animeTitle.english_jp && anime.animeTitle.english_jp)||
                            (anime.animeTitle.japanese && anime.animeTitle.japanese)
                        ):(anime.animeTitle && anime.animeTitle)
                        
                        // (anime.animeTitle && anime.animeTitle.length >0?((anime.animeTitle[0].english?anime.animeTitle[0].english: (anime.animeTitle[0].english_jp?anime.animeTitle[0].english_jp:anime.animeTitle[0].japanese))):anime.animeTitle)
                        // ||(anime.title?anime.title : anime.animeId)
                    }
                    </p>
                </div>
                {
                    anime.episodeNum &&
                    (
                        <div className="anime-ep">
                        <p>Episode <span>{anime.episodeNum}</span></p>
                        </div>
                    )
                }
            <div className="anime-year">
                <p>{anime.year && anime.year?anime.year:anime.releasedDate}</p>
            </div>

            </div>
            {
                anime.description && (
                    <div className="anime-desc">
                        <p>{anime.description && anime.description}</p>
                    </div>
                )
            }

        </div>
    )
}

export default AnimeCard
