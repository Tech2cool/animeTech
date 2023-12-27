import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams,Link } from 'react-router-dom';
import Loading from '../Loading/Loading';

import "./AnimeDetails.css";

const AnimeDetails = () => {
  const { animeID } = useParams();
  const [animeDetail, setAnimeDetail] = useState([]);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [descBtnActive, setdescBtnActive] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  // https://gogo-server.vercel.app/anime-details?animeID=one-piece
  const fetchAnimeDetails = async (animeId) => {
    const result = await axios.get(`https://gogo-server.vercel.app/anime-details?animeID=${animeId}`)
    console.log({ animeD: "anime details" }, result.data);
    setAnimeDetail(result.data);
    // if(result.data){
    // }
    setisLoading(false);
  }
  const handleScrollWindow = () => {
    const scrollThreshold = 400;
    setShowScrollIndicator(window.scrollY > scrollThreshold);
  };


  useEffect(() => {
    fetchAnimeDetails(animeID)
    setisLoading(true);
    window.addEventListener('scroll', handleScrollWindow);
    document.querySelector(".anime-summary") && document.querySelector(".anime-summary").addEventListener('change',handleDescButton)

  }, [animeID])
  const handleNavTPB = (e) => {
    if (e.currentTarget.name === "goTop") {
      console.log("goTOP")
      window.scroll(0, 0);
    }
    if (e.currentTarget.name === "goDown") {
      console.log("goDown")
      window.scroll(0, document.body.scrollHeight);
    }
  }
  const handleDescButton = ()=>{
    document.querySelector("#anim-desc").classList.toggle('active');
    document.querySelector(".anime-summary").classList.toggle('active');
    document.querySelector(".anime-summary").classList.contains("active")?setdescBtnActive(true):setdescBtnActive(false);
  }
  return (
    <div className='anime-details-container'>
      {
        isLoading?(
          <Loading />
        ):(
                  animeDetail && (
          <>
            <div className="anime-details">
              <div className="anime-d-poster">
                <img src={animeDetail.animeImg} alt="" />
              </div>
              <div className="anime-d-info">
                <h1>{animeDetail.animeTitle}</h1>
                {
                  animeDetail.genres && animeDetail.genres.length > 0 && (
                    <div className="anime-genres">
                      {
                        animeDetail.genres.map(genre => (
                          <div className="anim-genre" key={genre}>
                            <i className='fa-solid fa-tags'></i>
                            <p id='anim-genre'>{genre}</p>
                          </div>
                        ))
                      }
                    </div>
                  )
                }

                <div className="anime-cards">
                  <div className="anim-card" id='anim-totalEpisode'>
                    <p>Total Episodes : <span>{animeDetail.totalEpisodes}</span></p>
                  </div>

                  <div className="anim-card" id='anim-status'>
                    <p>Status: <span>{animeDetail.status}</span></p>
                  </div>

                  <div className="anim-card" id='anim-type'>
                    <p >Type: <span>{animeDetail.type}</span></p>
                  </div>
                  <div className="anim-card" id='anim-releaseDate'>
                    <p>year: <span>{animeDetail.releasedDate}</span></p>
                  </div>

                </div>
                <div className="anime-summary">
                  <p id='anime-otherName'>Other Names: <span>{animeDetail.otherNames && animeDetail.otherNames !== "" ? animeDetail.otherNames : ""}</span></p>
                  <button type="button" onClick={handleDescButton}>
                    {
                      descBtnActive?"Hide Description": "Show Description"
                    }
                    </button>
                  <p id='anim-desc'>Plot Summary: <span>{animeDetail.synopsis}</span></p>
                </div>
              </div>
            </div>

            <div className="allEpisodeContainer">
              <h4>All Episodes</h4>
              <div className="animeEpisodes">
                {
                  animeDetail.episodesList && animeDetail.episodesList.length > 0 ? (
                    animeDetail.episodesList.map(ep => (
                      <Link
                      to={`/video/${ep.episodeId}/${ep.episodeNum}/${animeDetail.animeTitle}/${animeID}`}
                      key={ep.episodeNum}
                      >
                      <div className="anime-d-episode" >
                        <p>EP <span>{ep.episodeNum}</span></p>
                        <p id='ep-sub'>{ep.isSubbed === true ? "SUB" : "DUB"}</p>
                      </div>
                      </Link>
                    ))
                  ) : ""
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
