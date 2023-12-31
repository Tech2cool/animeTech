import React from 'react'
import { useLanguage } from '../../context/langContext';

import "./AnimeCard.css";

const AnimeCard = ({ anime }) => {
    const { currentLang } = useLanguage();

    const rate = (anime.AdditionalInfo.ageRatingGuide && (anime.AdditionalInfo.ageRatingGuide.match(/\d+/g)?anime.AdditionalInfo.ageRatingGuide.match(/\d+/g):""));
    const ageRate = (rate !==""?(anime.AdditionalInfo.ageRating && anime.AdditionalInfo.ageRating +"-"+rate) : "");
    return (
        <div className="Anime-card">
            <div className="anime-poster">
                <img
                    src={
                        (anime.animeImg && anime.animeImg)|| 
                        (anime.img && anime.img)
                    }
                    alt=
                    {
                        (anime.animeTitle && (anime.animeTitle.english && anime.animeTitle.english)) ||
                        (anime.animeTitle && (anime.animeTitle.english_jp && anime.animeTitle.english_jp)) ||
                        (anime.animeTitle && (anime.animeTitle.japanese && anime.animeTitle.japanese)) ||
                        (anime.title && anime.title)
                    } />
            </div>
            <div className="anime-info">
                {
                anime.AdditionalInfo && anime.AdditionalInfo.averageRating !== null ?
                    (
                        <div className="anime-rating">
                            <i className='fa-solid fa-star'></i>
                            <p>{anime.AdditionalInfo.averageRating && anime.AdditionalInfo.averageRating}</p>
                        </div>
                    ) : ("")
                }

                <div className="anime-title">
                    <p>{
                        (currentLang === "en" ?(
                        (anime.animeTitle && anime.animeTitle.english && anime.animeTitle.english ?anime.animeTitle.english : anime.animeTitle.english_jp))
                        :((anime.animeTitle && anime.animeTitle.english_jp && anime.animeTitle.english_jp)))
                        ||(anime.animeTitle && anime.animeTitle.japanese && anime.animeTitle.japanese)
                        ||(anime.title && anime.title)
                    }</p>
                </div>
                {
                    anime.episodeNum &&
                    (
                        <div className="anime-ep">
                            <p>Episode <span>{anime.episodeNum && anime.episodeNum}</span></p>
                        </div>
                    )
                }
                <div className="anime-year">
                    <p>{
                    (anime.year && ((Number(anime.year) > (new Date().getFullYear())) ? ("Releasing: " +anime.year):"Released: " +anime.year))|| 
                    (anime.releasedDate && ((Number(anime.releasedDate) > (new Date().getFullreleasedDate())) ? ("Releasing: " +anime.releasedDate):"Released: " +anime.releasedDate))|| 
                    (anime.AdditionalInfo.status && anime.AdditionalInfo.status === "unreleased" && "Upcoming")
                    }</p>
                </div>
                    <div className="anime-desc">
                        {
                            anime.AdditionalInfo.status && (
                                <p>Status: {
                                    (anime.AdditionalInfo.status && anime.AdditionalInfo.status ==="current" && "ongoing")||
                                    (anime.AdditionalInfo.status && anime.AdditionalInfo.status ==="unreleased" && "not released")||
                                    (anime.AdditionalInfo.status && anime.AdditionalInfo.status)
                                    }</p>
                            )
                        }
                        {
                        anime.AdditionalInfo.ageRatingGuide && anime.AdditionalInfo.ageRating && (
                        <p>{anime.AdditionalInfo.ageRatingGuide &&anime.AdditionalInfo.ageRating && 
                        (ageRate ?(ageRate+" -"+ anime.AdditionalInfo.ageRatingGuide): (anime.AdditionalInfo.ageRatingGuide))}</p>)}
                    </div>
            </div>
        </div>
    )
}

export default AnimeCard
