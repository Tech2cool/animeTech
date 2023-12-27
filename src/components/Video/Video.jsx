import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate,Link,useLocation } from 'react-router-dom';
import axios from 'axios';
import Hls from 'hls.js';
import Loading from '../Loading/Loading';

import "./Video.css";

const Video = () => {
  const navigate = useNavigate();


  const { episodeID, episodeNum, animeTitle, animeID } = useParams();
  // console.log(animeID)
  let { state } = useLocation();

  // Destructure the state object
  const { animeTitleNative } = state || "nostate"; // Use default value to handle cases where state is undefined
  console.log(animeTitleNative)
  
  const navigateToPlay = (episodeId, episodeNum, animeTitle, animeId) => {
    const url = `/video${episodeId}/${episodeNum}/${animeTitle}/${animeId}`;
    navigate(url);
  };

  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  // <Route path='/video/:animeID/:episodeNum/:episodeID/:providerID/:subType/:server?/:apiKey?' element={<Video/>}/>
  const [videoSrc, setvideoSrc] = useState([]);
  const [allEpisodes, setallEpisodes] = useState([]);
  const [servers, setservers] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const [currentVideo, setcurrentVideo] = useState({
    src: "",
    quality: ""
  });
  const [values, setValues] = useState({
    Animetitle: "",
    AnimeID: "",
    imgURL: "",
    EpisodeNumber: "",
    EpisodeTitle: "",
  });
  let isMobile;

  // console.log(useParams());

  const fetchSrc = async () => {

    const result = await axios.get(`https://gogo-server.vercel.app/source?episodeID=/${encodeURIComponent(episodeID)}`)
    console.log({ result_data_1: "result.data 1" }, result.data);

    if (result.data.sources) {
      setvideoSrc(result.data.sources);
    } else {
      console.log({ result_data_1: "no result 1 data" });
    }

    // console.log("result 1 done")
    const result2 = await axios.get(`https://gogo-server.vercel.app/search?title=${encodeURIComponent(animeTitle)}`);
    
    if (result2.data.list.length > 0) {
      console.log({ result_data_2: "result.data 2" }, result2.data);
      
      setValues(value => ({
        ...value,
        Animetitle: animeTitle,
        AnimeID: animeID,
        imgURL: result2.data.list[0].img&& result2.data.list[0].img?result2.data.list[0].img:"",
        EpisodeNumber: Number(episodeNum),
        // EpisodeTitle: result.data.animeTitle
      }));

    }
    else{
      const result22 = await axios.get(`https://gogo-server.vercel.app/search?title=${animeTitleNative}`);
      console.log({ result_data_22: "result.data 22" }, result22.data);
      setValues(value => ({
        ...value,
        Animetitle: animeTitle,
        AnimeID: animeID,
        imgURL:result2.data.list[0].img&& result2.data.list[0].img?result2.data.list[0].img:"",
        EpisodeNumber: Number(episodeNum),
        // EpisodeTitle: result.data.animeTitle
      }));
    }
    // setisLoading(false);
  }

  const fetchAllEpisode = async (animID) => {
    // console.log("FetchAllEpisodes start")
    const result3 = await axios.get(`https://gogo-server.vercel.app/episodes?animeID=${encodeURIComponent(animID)}`)
    // console.log(result3.data)
    console.log({ result_data_3: "result.data 3" }, result3.data);

    // if(result3.data.length>0){
    // console.log("FetchAllEpisodes done")
    setallEpisodes(result3.data);
    // }
  }
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const handleScrollWindow = () => {
    const scrollThreshold = 300;
    setShowScrollIndicator(window.scrollY > scrollThreshold);
  };
  const handleScrollEpisode = () => {
    const scrollThreshold = 50;
    if(allEpisodes && allEpisodes.length>0){
      setShowScrollIndicator(document.querySelector(".allEpisodes").scrollTop > scrollThreshold);
    }
  };
  const handleResize = () => {
    isMobile = window.innerWidth < 480;

    if (isMobile) {
      // console.log(window.innerWidth + " - yea, less than 480");
      // window.removeEventListener('scroll', handleScrollEpisode);
      window.addEventListener('scroll', handleScrollWindow);

      // Clean up the event listener when the component unmounts
      return () => {
        window.removeEventListener('scroll', handleScrollWindow);
      };
    } else {
      // console.log(window.innerWidth + " - no longer less than 480");
      // document.querySelector(".allEpisodes").removeEventListener('scroll', handleScrollWindow);
      if(allEpisodes && allEpisodes.length>0){
        document.querySelector(".allEpisodes").addEventListener('scroll', handleScrollEpisode);
        
        // Clean up the event listener when the component unmounts
        return () => {
          document.querySelector(".allEpisodes").addEventListener('scroll', handleScrollEpisode);
        };
      }
    }
  };

  useEffect(() => {
    fetchSrc();
    handleResize();
    setisLoading(true);
    // Add a resize event listener to handle changes
    window.addEventListener('resize', handleResize);

    // Clean up the resize event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [useParams()]);

  useEffect(() => {
    if (allEpisodes.length > 0) {
      console.log({ allEpisodes: "allEpisode" }, allEpisodes);
    }
  }, [allEpisodes])

  useEffect(() => {
    // console.log(values)
    if (animeID !== "") {
      fetchAllEpisode(animeID);
    }
  }, [episodeID])

  useEffect(() => {
    if (videoSrc.length > 0) {
      const defaultURL = videoSrc.find(src => src.quality === "default");
      setcurrentVideo(val => ({
        ...val,
        src: defaultURL.url,
        quality: defaultURL.quality
      }));
      setisLoading(false);
      console.log({ idk: "video srcc" }, { videoSrc });
    }
  }, [videoSrc])

  // useEffect(()=>{
  //   console.log({vuide:"currentVideo is"},{currentVideo})
  // },[currentVideo])
  useEffect(() => {
    // console.log(videoSrc)
    const video = videoRef.current;
    const hls = new Hls();
    if (currentVideo.src !== "") {
      if (Hls.isSupported()) {
        hls.loadSource(currentVideo.src)
        hls.attachMedia(video);
        // hlsRef.current = hls;
        console.log({ currentVideo_1: "currentVideo_1" }, currentVideo)
      }
      else if(video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc[0].url;
      }
      else {
        console.log("video src not supported")
      }
      // video.src =videoSrc[0].url;
      // setisLoading(false);
    }
  }, [currentVideo])


  const handleQuality = (e) => {
    let target = e.target;
    if (videoSrc.length > 0) {
      switch (target.name) {
        case "360p": {
          console.log("360p");
          const defaultURL = videoSrc.find(src => src.quality === "360p");
          setcurrentVideo(val => ({
            ...val,
            src: defaultURL.url,
            quality: defaultURL.quality
          }));
          console.log({ idk: "360p" }, currentVideo.src);

          break;
        }
        case "480p": {
          console.log("480p");
          const defaultURL = videoSrc.find(src => src.quality === "480p");
          setcurrentVideo(val => ({
            ...val,
            src: defaultURL.url,
            quality: defaultURL.quality
          }));
          console.log({ idk: "480p" }, currentVideo.src);
          break;
        }
        case "720p": {
          console.log("720p");
          const defaultURL = videoSrc.find(src => src.quality === "720p");
          setcurrentVideo(val => ({
            ...val,
            src: defaultURL.url,
            quality: defaultURL.quality
          }));
          console.log({ idk: "720p" }, currentVideo.src);
          break;
        }
        case "1080p": {
          console.log("1080p");
          const defaultURL = videoSrc.find(src => src.quality === "1080p");
          setcurrentVideo(val => ({
            ...val,
            src: defaultURL.url,
            quality: defaultURL.quality
          }));
          console.log({ idk: "1080p" }, currentVideo.src);
          break;
        }
        case "backup": {
          console.log("backup");
          const defaultURL = videoSrc.find(src => src.quality === "backup");
          setcurrentVideo(val => ({
            ...val,
            src: defaultURL.url,
            quality: defaultURL.quality
          }));
          console.log({ idk: "backup" }, currentVideo.src);
          break;
        }
        default: {
          console.log("default");
          const defaultURL = videoSrc.find(src => src.quality === "default");
          setcurrentVideo(val => ({
            ...val,
            src: defaultURL.url,
            quality: defaultURL.quality
          }));
          console.log({ idk: "default" }, currentVideo.src);
        }
      }

    }
  }
  const handleNavTPB = (e) => {
    if (e.currentTarget.name === "goTop") {
      console.log("goTOP")
      if (isMobile) {
        window.scroll(0, 0);
      } else {
        document.querySelector(".allEpisodes").scroll(0, 0)
      }

    }
    if (e.currentTarget.name === "goDown") {
      console.log("goDown")
      if (isMobile) {
        window.scroll(0, document.body.scrollHeight);
      } else {
        // window.scroll(0,(document.body.scrollHeight-500));
        document.querySelector(".allEpisodes").scrollTop = document.querySelector(".allEpisodes").scrollHeight;
      }
    }
  }
  return (
    <div className='video-container'>
      {
        isLoading ? (
          <Loading />
        ) :
          (
              <div className="video">

                <div className="video-title">
                  <div className="video-poster">
                    <img src={values.imgURL && values.imgURL} alt={values.Animetitle && values.Animetitle} />
                  </div>

                  <div className="video-info">
                    <p id='viat'>{values.Animetitle && values.Animetitle.toLowerCase()}</p>
                    <div className="video-ep-num">
                      <p>Episode <span>{values.EpisodeNumber && values.EpisodeNumber}</span></p>
                      <p id='epTitle'>{values.EpisodeTitle && values.EpisodeTitle.includes(values.EpisodeNumber) ? "" : values.EpisodeTitle}</p>
                    </div>

                  </div>
                </div>

                <div className="video-src">
                  <video ref={videoRef} controls></video>
                </div>
                <div className="video-qualities">
                  {
                    videoSrc && videoSrc.length > 0 ? (
                      videoSrc.map(src => (
                        <button className={`vidSrc ${currentVideo.quality === src.quality ? 'active' : ''}`} type="button" name={src.quality} onClick={handleQuality} key={src.quality}>{src.quality}</button>
                      ))
                    ) : ("")
                  }
                </div>
                <div className="video-home">
                  <Link to={`/`} >
                    <i className='fa-solid fa-arrow-left'></i>
                  </Link>
                  <Link to={`/anime-details/${animeID}`} >
                    <i className='fa-solid fa-home'></i>
                  </Link>
                  </div>
              </div>
          )
      }
      {
        allEpisodes && allEpisodes.length > 0 ? (
          <div className="allEpisodes">
            <h2>All Episode</h2>
            <div className="related-episodes">
              {
                allEpisodes.map(ep => (
                  <div className={`video-episode ${values.EpisodeNumber === ep.number ? 'active' : ''}`}
                    key={ep.number}
                    onClick={() => {
                      navigateToPlay(ep.id, ep.number, encodeURIComponent(values.Animetitle), animeID)
                    }}
                  >
                    {/* <p>episode title</p> */}
                    <p id='vid-epnum'>{ep.number}</p>
                  </div>
                ))
              }
            </div>
          </div>
        ) : ""
      }
      <div className="tpBtns">
        <button type="button" name='goTop' className={`goTop ${showScrollIndicator ? 'visible' : ''}`} onClick={handleNavTPB}><i className='fa-solid fa-angle-up'></i></button>
        <button type="button" name='goDown' className={`goDown ${showScrollIndicator ? 'visible' : ''}`} onClick={handleNavTPB}><i className='fa-solid fa-angle-down'></i></button>
      </div>
    </div>
  )
}

export default Video
