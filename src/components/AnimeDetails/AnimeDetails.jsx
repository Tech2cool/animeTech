import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams, Link } from 'react-router-dom';
import Loading from '../Loading/Loading';
import { useLanguage } from '../../context/langContext';

import "./AnimeDetails.css";
import EpisodeCard from '../EpisodeCard/EpisodeCard';

const AnimeDetails = () => {
  const { animeID } = useParams();
  const [animeDetail, setAnimeDetail] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [descBtnActive, setdescBtnActive] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [epTitle, setepTitle] = useState(false);
  const [ageRating, setageRating] = useState('');
  const { currentLang } = useLanguage();

  // https://gogo-server.vercel.app/anime-details?animeID=one-piece
  const fetchAnimeDetails = async (animeId) => {
    const result = await axios.get(`https://gogo-server.vercel.app/anime-details?animeID=${animeId}`)
    // console.log({ animeD: "anime details" }, result.data);
    setAnimeDetail(result.data);
    // if(result.data){
    // }
    setisLoading(false);
  }

  const fetchAllEpisode = async (animID) => {
    // console.log("FetchAllEpisodes start")
    if(animeDetail && animeDetail.AdditionalInfo && animeDetail.AdditionalInfo.id){
      try {
        // console.log(animeDetail.AdditionalInfo.id)
        const result3 = await axios.get(`https://gogo-server.vercel.app/episodes?animeID=${animID}&kid=${(animeDetail && animeDetail.AdditionalInfo.id && animeDetail.AdditionalInfo.id)}`)
        setEpisodes(result3.data);
        // console.log({ep:result3.data})
        
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }

  const handleScrollWindow = () => {
    const scrollThreshold = 400;
    setShowScrollIndicator(window.scrollY > scrollThreshold);
  };


  useEffect(() => {
    if (animeDetail) {
      fetchAllEpisode(animeID);
      if (episodes && episodes.length > 0) {
        const filteredEpisodes = episodes.filter(ep => (
          ep.title && (
            ep.title.english !== null ||
            ep.title.english_jp !== null ||
            ep.title.japanese !== null
          )
        ));

        setepTitle(filteredEpisodes.length > 0 ? true : false);
      }
      if (animeDetail.AdditionalInfo && animeDetail.AdditionalInfo.ageRating && animeDetail.AdditionalInfo.ageRatingGuide) {
        const adInfo = animeDetail.AdditionalInfo;
        const rate = (adInfo.ageRatingGuide && (adInfo.ageRatingGuide.match(/\d+/g) ? adInfo.ageRatingGuide.match(/\d+/g) : ""));
        const ageRate = (rate !== "" ? (adInfo.ageRating && adInfo.ageRating + "-" + rate) : "");

        setageRating(ageRate ? (ageRate + " -" + adInfo.ageRatingGuide) : (adInfo.ageRatingGuide))
      }
    }

  }, [animeDetail]);

  useEffect(()=>{
      if (episodes && episodes.length > 0) {
        const filteredEpisodes = episodes.filter(ep => (
          ep.title && (
            ep.title.english !== null ||
            ep.title.english_jp !== null ||
            ep.title.japanese !== null
          )
        ));

        setepTitle(filteredEpisodes.length > 0 ? true : false);
      }
  },[episodes])

  useEffect(() => {
    fetchAnimeDetails(animeID)
    setisLoading(true);
    window.addEventListener('scroll', handleScrollWindow);
    document.querySelector(".anime-summary") && document.querySelector(".anime-summary").addEventListener('change', handleDescButton)
  }, [animeID])

  const handleNavTPB = (e) => {
    if (e.currentTarget.name === "goTop") {
      //console.log("goTOP")
      window.scroll(0, 0);
    }
    if (e.currentTarget.name === "goDown") {
      //console.log("goDown")
      window.scroll(0, document.body.scrollHeight);
    }
  }
  const handleDescButton = () => {
    document.querySelector("#anim-desc").classList.toggle('active');
    document.querySelector(".anime-summary").classList.toggle('active');
    document.querySelector(".anime-summary").classList.contains("active") ? setdescBtnActive(true) : setdescBtnActive(false);
  }

  return (
    <div className='anime-details-container'>
      {
        isLoading ? (
          <Loading LoadingType={"PuffLoader"} color={"red"} />
        ) : (
          animeDetail && (
            <>
              <div className="anime-details">
                <div className="anime-d-poster">
                  <img src={
                    (animeDetail.animeImage && animeDetail.animeImage) ||
                    (animeDetail.animeImg && animeDetail.animeImg) || ""
                  } alt="" />
                </div>
                <div className="anime-d-info">
                  <h1>{
                    currentLang === "en" ? (
                      (animeDetail.Title && animeDetail.Title.english && animeDetail.Title.english)||
                      (animeDetail.Title && animeDetail.Title.english_jp && animeDetail.Title.english_jp)
                    ) : (
                      (animeDetail.Title && animeDetail.Title.english_jp && animeDetail.Title.english_jp)||
                      (animeDetail.Title && animeDetail.Title.japanese && animeDetail.Title.japanese)
                    )
                  }</h1>
                  {
                    animeDetail.genres && animeDetail.genres.length > 0 && (
                      <div className="anime-genres">
                        {
                          animeDetail.genres.map(genre => (
                            <Link
                              to={`/genre/${genre}`}
                              key={genre}
                            >
                              <div className="anim-genre" >
                                <i className='fa-solid fa-tags'></i>
                                <p id='anim-genre'>{genre}</p>
                              </div>
                            </Link>
                          ))
                        }
                      </div>
                    )
                  }

                  <div className="anime-cards">
                    <div className="anim-card" id='anim-totalEpisode'>
                      <p>Total Episodes : <span>{animeDetail.totalEpisodes && animeDetail.totalEpisodes}</span></p>
                    </div>
                    <div className="anim-card" id='anim-status'>
                      <p>Status: <span>{animeDetail.status && animeDetail.status}</span></p>
                    </div>
                    {
                      ageRating !== "" && (
                        <div className="anim-card" id='anim-ageRate'>
                          <p >Rating: <span>{ageRating !== "" && ageRating}</span></p>
                        </div>
                      )
                    }

                    <div className="anim-card" id='anim-type'>
                      <p >Type: <span>{animeDetail.type && animeDetail.type}</span></p>
                    </div>

                    <div className="anim-card" id='anim-releaseDate'>
                      <p>year: <span>{animeDetail.releasedDate && animeDetail.releasedDate}</span></p>
                    </div>

                  </div>
                  <div className="anime-summary">
                    <p id='anime-otherName'>Other Names: <span>{animeDetail.otherName && animeDetail.otherName !== "" ? animeDetail.otherName : ""}</span></p>
                    <button type="button" onClick={handleDescButton}>
                      {
                        descBtnActive ? "Hide Description" : "Show Description"
                      }
                    </button>
                    <p id='anim-desc'>Plot Summary: <span>{
                      (animeDetail.AdditionalInfo && animeDetail.AdditionalInfo.description && animeDetail.AdditionalInfo.description) ||
                      (animeDetail.synopsis && animeDetail.synopsis)
                    }</span></p>
                  </div>
                </div>
              </div>

              <div className="allEpisodeContainer">
                <h4>All Episodes</h4>
                <div className={`animeEpisodes ${epTitle ? "active" : ""}`}>
                  {
                    episodes && episodes.length > 0 ? (
                      episodes.map(ep => (
                        <Link
                          to={`/video/${ep.id}/${ep.number}/${
                            (animeDetail.Title && animeDetail.Title.english_jp &&animeDetail.Title.english_jp)||
                            (animeDetail.Title && animeDetail.Title.japanese &&animeDetail.Title.japanese)||
                            (animeDetail.Title && animeDetail.Title.english &&animeDetail.Title.english)
                          }/${animeID}`}
                          key={ep.number}
                        >
                        <EpisodeCard episode={ep} from={"animeDetails"} />
                        </Link>
                      ))
                    ) : (<Loading LoadingType={"PuffLoader"} color={"red"}/>)
                  }
                </div>
              </div>
              <div className="tpBtns">
                <button type="button" name='goTop' className={`goTop ${showScrollIndicator ? 'visible' : ''}`} onClick={handleNavTPB}><i className='fa-solid fa-angle-up'></i></button>
                <button type="button" name='goDown' className={`goDown ${showScrollIndicator ? 'visible' : ''}`} onClick={handleNavTPB}><i className='fa-solid fa-angle-down'></i></button>
              </div>
            </>
          )

        )
      }
    </div>
  )
}

export default AnimeDetails
