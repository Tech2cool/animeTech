import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../context/langContext';
import Loading from '../Loading/Loading';
import EpisodeCard from '../EpisodeCard/EpisodeCard';
import VideoPlayer from "../CUSTOM_VIDEO_PLAYER/VideoPlayer";

import "./Video.css";

import fakeImg from "../../images/NoImg.png";

const Video = () => {
  const navigate = useNavigate();
  const { currentLang } = useLanguage();

  const { episodeID, episodeNum, animeTitle, animeID } = useParams();

  const navigateToPlay = (episodeId, episodeNum, animeTitle, animeId) => {
    const url = `/video/${episodeId}/${episodeNum}/${animeTitle}/${animeId}`;
    navigate(url);
  };
  const isValidData = (data)=>{
    if(data === undefined ||data === null ||data === "null" ||data === "undefined"||data === ""){
      return false
    }
    return true
  }
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [videoSrc, setvideoSrc] = useState([]);
  const [allEpisodes, setallEpisodes] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const [currentVideo, setcurrentVideo] = useState({
    src: "",
    quality: ""
  });
  const [values, setValues] = useState({
    Animetitle: {
      english: "",
      english_jp: "",
      japanese: ""
    },
    AnimeID: "",
    imgURL: "",
    EpisodeNumber: "",
    EpisodeTitle: "",
    AdditonalInfo: [],
  });
  const [myAnime, setMyAnime] = useState({})
  let isMobile;

  let isRequestPending = false;
  let timeoutOccurred = false;
  let TheAnimeTitle, Poster;
  if(isValidData(myAnime?.animeTitle)){
    if(currentLang === "en"){
      if(isValidData(myAnime?.animeTitle?.english)){
        TheAnimeTitle = myAnime?.animeTitle?.english
      }else if(isValidData(myAnime?.animeTitle?.english_jp)){
        TheAnimeTitle = myAnime?.animeTitle?.english_jp
      }
    }else{
      if(isValidData(myAnime?.animeTitle?.english_jp)){
        TheAnimeTitle = myAnime?.animeTitle?.english_jp
      }else if(isValidData(myAnime?.animeTitle?.japanese)){
        TheAnimeTitle = myAnime?.animeTitle?.japanese
      }
    }
  }
  if(isValidData(myAnime?.animeImg)){
    Poster = myAnime?.animeImg
  }else{
    Poster = fakeImg
  }
  const fetchSrc = async () => {
    isRequestPending = true;
    try {
      setisLoading(true);
      const result = await axios.get(`https://gogo-server.vercel.app/source?episodeID=/${encodeURIComponent(episodeID)}`, { timeout: 5000 })
    //  console.log({ result_data_1: "result.data 1" }, result.data);

      setvideoSrc(result.data.sources);
      // ////console.log("result 1 done")
      // console.log(animeTitle);

        const result2 = await axios.get(`https://gogo-server.vercel.app/anime-details?animeID=${animeID}`, { timeout: 5000 })
        console.log({ result_data_22: "result.data 2" }, result2.data);
        const res = result2.data;
        setMyAnime(res)
        setValues(value => ({
          ...value,
          Animetitle: {
            english: (res.Title && (res.Title.english && res.Title.english ? res.Title.english : null)),
            english_jp: (res.Title && (res.Title.english_jp && res.Title.english_jp ? res.Title.english_jp : animeTitle)),
            japanese: (res.Title && (res.Title.japanese && res.Title.japanese ? res.Title.japanese : null)),
          },
          AnimeID: res.animeID && res.animeID ? res.animeID : animeID,
          imgURL: res.animeImage && res.animeImage ? res.animeImage : "",
          EpisodeNumber: Number(episodeNum),
          AdditonalInfo: res,
          // EpisodeTitle: result.data.animeTitle
        }));


      setisLoading(false);
    } catch (error) {
      console.error(error)
      setisLoading(false);
    }
    finally {
      isRequestPending = false;
      setisLoading(false);
    }
  }

  const fetchAllEpisode = async (animID) => {
    isRequestPending = true;
    try {
      //console.log(values.AdditonalInfo.AdditionalInfo.id)
      const result3 = await axios.get(`https://gogo-server.vercel.app/episodes?animeID=${encodeURIComponent(animID)}&kid=${values.AdditonalInfo.AdditionalInfo.id}`, { timeout: 5000 })
      setallEpisodes(result3.data);
      // console.log({ ep: result3.data })
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message);
      } else if (error.code === 'ECONNABORTED') {
        console.log('Timeout occurred');
        timeoutOccurred = true;
      } else {
        console.error('Error:', error.message);
      }
    }
    finally {
      isRequestPending = false;
    }
    ////console.log({ result_data_3: "result.data 3" }, result3.data);
  }

  useEffect(() => {
    // console.log({allEpisodes})
    handleResize();
    // Add a resize event listener to handle changes
    window.addEventListener('resize', handleResize);

    // Clean up the resize event listener when the component unmounts
    // console.log({epid:"useEffect"})
    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, [allEpisodes])

  const handleScrollWindow = () => {
    const scrollThreshold = 300;
    setShowScrollIndicator(window.scrollY > scrollThreshold);
  };
  const handleScrollEpisode = () => {
    const scrollThreshold = 50;
    if (allEpisodes && allEpisodes.length > 0) {
      setShowScrollIndicator(document.querySelector(".allEpisodes").scrollTop > scrollThreshold);
    }
  };

  const handleResize = () => {
    // console.log("resized called")
    isMobile = window.innerWidth < 1150;

    if (isMobile) {
      window.addEventListener('scroll', handleScrollWindow);

      return () => {
        window.removeEventListener('scroll', handleScrollWindow);
      };
    } else {
      if (allEpisodes && allEpisodes.length > 0) {
        document.querySelector(".allEpisodes").addEventListener('scroll', handleScrollEpisode);

        return () => {
          document.querySelector(".allEpisodes").addEventListener('scroll', handleScrollEpisode);
        };
      }
    }
  };


  useEffect(() => {
    if (!isRequestPending) {
      fetchSrc();
    }
  }, [episodeID]);


  useEffect(() => {
    if (values.AnimeID !== "") {
      if (!isRequestPending) {
        fetchAllEpisode(values.AnimeID);
        // console.log({valuesAnimeID:"values.AnimeID"})
      }
    }

  }, [values.AnimeID])

  useEffect(() => {
    if (videoSrc && videoSrc.length > 0) {
      const defaultURL = videoSrc.find(src => src.quality === "default");
      // console.log({defaultURL})
      if (defaultURL !== "") {
        setcurrentVideo(val => ({
          ...val,
          src: defaultURL.url,
          quality: defaultURL.quality
        }));
        
        setisLoading(false);
        // console.log({ idk: "video srcc" }, { videoSrc });
      }
    }
  }, [videoSrc])

  const handleNavTPB = (e) => {
    if (e.currentTarget.name === "goTop") {
      if (isMobile) {
        window.scroll(0, 0);
        document.querySelector(".allEpisodes").scroll(0, 0)
      } else {
        window.scroll(0, 0);
        document.querySelector(".allEpisodes").scroll(0, 0)
      }

    }
    if (e.currentTarget.name === "goDown") {
      if (isMobile) {
        window.scroll(0, document.body.scrollHeight);
        document.querySelector(".allEpisodes").scrollTop = document.querySelector(".allEpisodes").scrollHeight;
      } else {
        window.scroll(0, document.body.scrollHeight);
        document.querySelector(".allEpisodes").scrollTop = document.querySelector(".allEpisodes").scrollHeight;
      }
    }
  }

  function handlePrev() {
    if (episodeNum !== null && episodeNum > 1) {
      let currentEpNumb = Number(episodeNum);
      let prevEpisodeNum = currentEpNumb - 1;

      let prevEpisodeID = episodeID.replace(currentEpNumb, prevEpisodeNum);

      let prevAnimeTitle = values.Animetitle.english_jp ? values.Animetitle.english_jp : values.Animetitle.english;
      navigateToPlay(prevEpisodeID, prevEpisodeNum, encodeURIComponent(prevAnimeTitle), values.AnimeID);
    }

  }

  function handleNext() {
    if (episodeNum > 0 && episodeNum < allEpisodes.length) {
      let currentEpNumb = Number(episodeNum);
      let nextEpisodeNum = currentEpNumb + 1;

      let nextEpisodeID = episodeID.replace(currentEpNumb, nextEpisodeNum);

      let nextAnimeTitle = values.Animetitle.english_jp ? values.Animetitle.english_jp : values.Animetitle.english;

      navigateToPlay(nextEpisodeID, nextEpisodeNum, encodeURIComponent(nextAnimeTitle), values.AnimeID);
    }
  }

  return (
    <div className='video-container'>
      {
        isLoading ? (<Loading LoadingType={"HashLoader"} color={"red"} />) :
        (
          <div className="video">
            <div className="video-title">
              <div className="video-poster">
                <img src={Poster} alt={"Poster"} />
              </div>
              <div className="video-info">
                <p id='viat'>{TheAnimeTitle}</p>
                <div className="video-ep-num">
                  <p>Episode <span>{values.EpisodeNumber && values.EpisodeNumber}</span></p>
                  <p id='epTitle'>
                    {
                      allEpisodes &&
                      allEpisodes.length > 0 &&
                      allEpisodes[Number(values.EpisodeNumber) - 1] && (
                        (allEpisodes[Number(values.EpisodeNumber) - 1].title ? (
                          (allEpisodes[Number(values.EpisodeNumber) - 1].title.english &&
                            allEpisodes[Number(values.EpisodeNumber) - 1].title.english) ||
                          (allEpisodes[Number(values.EpisodeNumber) - 1].title.english_jp &&
                            allEpisodes[Number(values.EpisodeNumber) - 1].title.english_jp) ||
                          (allEpisodes[Number(values.EpisodeNumber) - 1].title.japanese &&
                            allEpisodes[Number(values.EpisodeNumber) - 1].title.japanese) || null
                        ) : null)
                      )
                    }</p>
                </div>
              </div>
            </div>
            <div className="video-src">
              <VideoPlayer url={currentVideo.src} />
            </div>
            <div className="video-home">
              {
                episodeNum > 1 && (<button type="button" className='btn btn-prev' onClick={handlePrev} >Prev</button>)
              }
              <Link to={`/anime-details/${values.AnimeID}`} >
                <i className='fa-solid fa-home'></i>
              </Link>
              {
                episodeNum < allEpisodes.length && (<button type="button" className='btn btn-next' onClick={handleNext} >Next</button>)
              }
            </div>
          </div>
        )
      }
      <div className="allEpisodes">
        {
          allEpisodes && allEpisodes.length > 0 ? (
            <>
              <h2>All Episode</h2>
              <div className="related-episodes">
                {
                  allEpisodes.map((ep, i) => (
                    <EpisodeCard
                      episode={ep}
                      key={i}
                      current_ep={values.EpisodeNumber}
                      from={"video"}
                      onclick={() => { navigateToPlay(ep.id, ep.number, encodeURIComponent(animeTitle), values.AnimeID) }}
                    />
                  ))
                }
              </div>

            </>
          ) : (timeoutOccurred ? <p>Connection Timeout</p> : <Loading LoadingType={"PuffLoader"} color={"red"} />)
        }
      </div>
      <div className="tpBtns">
        <button type="button" name='goTop' className={`goTop ${showScrollIndicator ? 'visible' : ''}`} onClick={handleNavTPB}><i className='fa-solid fa-angle-up'></i></button>
        <button type="button" name='goDown' className={`goDown ${showScrollIndicator ? 'visible' : ''}`} onClick={handleNavTPB}><i className='fa-solid fa-angle-down'></i></button>
      </div>
    </div>
  )
}

export default Video
