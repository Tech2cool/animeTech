import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate,Link,useLocation } from 'react-router-dom';
import axios from 'axios';
import Hls from 'hls.js';
import Loading from '../Loading/Loading';
import videojs from 'video.js'
import 'videojs-mobile-ui/dist/videojs-mobile-ui.css';
import 'videojs-mobile-ui';
import "./Video.css";
import "videojs-hotkeys";

const Video = () => {
  const navigate = useNavigate();

  const { episodeID, episodeNum, animeTitle, animeID } = useParams();
  // ////console.log(animeID)
  let { state } = useLocation();

  // Destructure the state object
  const { animeTitleNative } = state || "nostate"; // Use default value to handle cases where state is undefined
  ////console.log(animeTitleNative)
  
  const navigateToPlay = (episodeId, episodeNum, animeTitle, animeId) => {
    const url = `/video${episodeId}/${episodeNum}/${animeTitle}/${animeId}`;
    navigate(url);
  };

  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [crrLoaded, setcrrLoaded] = useState(false);

  // <Route path='/video/:animeID/:episodeNum/:episodeID/:providerID/:subType/:server?/:apiKey?' element={<Video/>}/>
  const [videoSrc, setvideoSrc] = useState([]);
  const [allEpisodes, setallEpisodes] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const [currentVideo, setcurrentVideo] = useState({
    src: "",
    quality: ""
  });
  const [oldVideoURL, setoldVideoURL] = useState("");
  const [values, setValues] = useState({
    Animetitle: "",
    AnimeID: "",
    imgURL: "",
    EpisodeNumber: "",
    EpisodeTitle: "",
  });
  let isMobile;

  // ////console.log(useParams());
  let isRequestPending = false;

  const fetchSrc = async () => {
    isRequestPending = true;
    try {
      const result = await axios.get(`https://gogo-server.vercel.app/source?episodeID=/${encodeURIComponent(episodeID)}` )
      ////console.log({ result_data_1: "result.data 1" }, result.data);

      setvideoSrc(result.data.sources);
      // ////console.log("result 1 done")
      const result2 = await axios.get(`https://gogo-server.vercel.app/search?title=${encodeURIComponent(animeTitle)}` );
      
      if (result2.data.list.length > 0) {
        //console.log({ result_data_2: "result.data 2" }, result2.data);
        setValues(value => ({
          ...value,
          Animetitle: animeTitle,
          AnimeID: result2.data.list[0].animeID &&result2.data.list[0].animeID?result2.data.list[0].animeID:"",
          imgURL: result2.data.list[0].img&& result2.data.list[0].img?result2.data.list[0].img:"",
          EpisodeNumber: Number(episodeNum),
          // EpisodeTitle: result.data.animeTitle
        }));
  
      }
      else{
        const result22 = await axios.get(`https://gogo-server.vercel.app/search?title=${animeTitleNative&& animeTitleNative !== ""?animeTitleNative:animeTitle}` );
        //console.log({ result_data_22: "result.data 22" }, result22.data);
        setValues(value => ({
          ...value,
          Animetitle: animeTitle,
          AnimeID: result22.data.list[0].animeID &&result22.data.list[0].animeID?result22.data.list[0].animeID:"",
          imgURL:result22.data.list[0].img&& result22.data.list[0].img?result22.data.list[0].img:"",
          EpisodeNumber: Number(episodeNum),
          // EpisodeTitle: result.data.animeTitle
        }));
      }
    } catch (error) {
      console.error(error) 
    }
    // setisLoading(false);
    finally{
      isRequestPending=false;
    }
  }

  const fetchAllEpisode = async (animID) => {
    isRequestPending = true;

    // ////console.log("FetchAllEpisodes start")
    try {
      const result3 = await axios.get(`https://gogo-server.vercel.app/episodes?animeID=${encodeURIComponent(animID)}` )
      setallEpisodes(result3.data);
      
    } catch (error) {
      console.error('Error:', error);
    }
    finally{
      isRequestPending=false;
    }
    // ////console.log(result3.data)
    ////console.log({ result_data_3: "result.data 3" }, result3.data);

    // if(result3.data.length>0){
    // ////console.log("FetchAllEpisodes done")
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
    // console.log("resized called")
    isMobile = window.innerWidth < 480;

    if (isMobile) {
      window.addEventListener('scroll', handleScrollWindow);

      return () => {
        window.removeEventListener('scroll', handleScrollWindow);
      };
    } else {
      if(allEpisodes && allEpisodes.length>0){
        document.querySelector(".allEpisodes").addEventListener('scroll', handleScrollEpisode);
        
        return () => {
          document.querySelector(".allEpisodes").addEventListener('scroll', handleScrollEpisode);
        };
      }
    }
  };

  useEffect(() => {
    if (!isRequestPending) {
      // console.log('Request already pending. Ignoring duplicate request.');
      fetchSrc();
      setisLoading(true);
      handleResize();
      // Add a resize event listener to handle changes
    window.addEventListener('resize', handleResize);
    
    // Clean up the resize event listener when the component unmounts
    console.log({epid:"useEffect"})
    return () => {
      window.removeEventListener('resize', handleResize);
    };

    }
  }, [episodeID]);


  useEffect(() => {
    // ////console.log(values)
    if (values.AnimeID !== "") {
      if (!isRequestPending) {
        fetchAllEpisode(values.AnimeID);
        console.log({valuesAnimeID:"values.AnimeID"})
      }
    }

  }, [values.AnimeID])

  useEffect(() => {
    if (videoSrc.length > 0) {
      const defaultURL = videoSrc.find(src => src.quality === "default");
      // console.log({defaultURL})
      if(defaultURL !==""){
        setcurrentVideo(val => ({
          ...val,
          src: defaultURL.url,
          quality: defaultURL.quality
        }));
        setoldVideoURL(defaultURL.url);
        setisLoading(false);
        setcrrLoaded(false);
        console.log({ idk: "video srcc" }, { videoSrc });
      }
    }
  }, [videoSrc])

  // useEffect(()=>{
  //   console.log({currentVideoFIX:currentVideo.src});
  // },[currentVideo])
  const initializeVideoJS = () => {
    // Check if Video.js is already initialized on the video element
    // if (!videojs.getPlayers()[videoRef.current.id]) {

      const videoPlayer = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: 'auto',
        fluid: true,
        aspectRatio: '16:9',
        userActions: {
          click: true,
          hotkeys: (event) => {
            if (event.which === 88) {
              videoPlayer.pause();
            }
          },
        },
        playbackRates: [0.25, 0.5, 1, 1.5, 2, 2.5, 3, 4],
        controlBar: {
          fullscreenToggle: true,
        },
      });

      videoPlayer.mobileUi({
        fullscreen: {
          enterOnRotate: true,
          exitOnRotate: true,
          lockOnRotate: true,
          lockToLandscapeOnEnter: true,
          disabled: false,
        },
        touchControls: {
          seekSeconds: 10,
          tapTimeout: 300,
          disableOnEnd: false,
          disabled: false,
        },
      });
      
      videoPlayer.hotkeys({
        volumeStep: 0.1,
        seekStep: 10,
        enableModifiersForNumbers: false
      });
    
    // }

  };

  // useEffect(()=>{
  //   initializeVideoJS();
  // },[])

  useEffect(() => {
    const video = videoRef.current;
    // console.log({crrr:currentVideo.src},{oldVideoURL:oldVideoURL})
    
    if (currentVideo.src !=="" || oldVideoURL !=="") {
      if(!crrLoaded){
        initializeVideoJS();
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(currentVideo.src);
            hls.attachMedia(video);
            setcrrLoaded(true);
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoSrc[0].url;
          }
          console.log("if"+{crrr:currentVideo.src},{oldVideoURL})
          
        }
    }
  }, [currentVideo]);

  const handleQuality = (e) => {
    let target = e.target;
    if (videoSrc.length > 0) {
      switch (target.name) {
        case "360p": {
          ////console.log("360p");
          const defaultURL = videoSrc.find(src => src.quality === "360p");
          setcurrentVideo(val => ({
            ...val,
            src: defaultURL.url,
            quality: defaultURL.quality
          }));
          ////console.log({ idk: "360p" }, currentVideo.src);

          break;
        }
        case "480p": {
          ////console.log("480p");
          const defaultURL = videoSrc.find(src => src.quality === "480p");
          setcurrentVideo(val => ({
            ...val,
            src: defaultURL.url,
            quality: defaultURL.quality
          }));
          ////console.log({ idk: "480p" }, currentVideo.src);
          break;
        }
        case "720p": {
          ////console.log("720p");
          const defaultURL = videoSrc.find(src => src.quality === "720p");
          setcurrentVideo(val => ({
            ...val,
            src: defaultURL.url,
            quality: defaultURL.quality
          }));
          ////console.log({ idk: "720p" }, currentVideo.src);
          break;
        }
        case "1080p": {
          ////console.log("1080p");
          const defaultURL = videoSrc.find(src => src.quality === "1080p");
          setcurrentVideo(val => ({
            ...val,
            src: defaultURL.url,
            quality: defaultURL.quality
          }));
          ////console.log({ idk: "1080p" }, currentVideo.src);
          break;
        }
        case "backup": {
          ////console.log("backup");
          const defaultURL = videoSrc.find(src => src.quality === "backup");
          setcurrentVideo(val => ({
            ...val,
            src: defaultURL.url,
            quality: defaultURL.quality
          }));
          ////console.log({ idk: "backup" }, currentVideo.src);
          break;
        }
        default: {
          ////console.log("default");
          const defaultURL = videoSrc.find(src => src.quality === "default");
          setcurrentVideo(val => ({
            ...val,
            src: defaultURL.url,
            quality: defaultURL.quality
          }));
          ////console.log({ idk: "default" }, currentVideo.src);
        }
      }

    }
  }
  const handleNavTPB = (e) => {
    if (e.currentTarget.name === "goTop") {
      ////console.log("goTOP")
      if (isMobile) {
        window.scroll(0, 0);
        document.querySelector(".allEpisodes").scroll(0, 0)
      } else {
        window.scroll(0, 0);
        document.querySelector(".allEpisodes").scroll(0, 0)
      }

    }
    if (e.currentTarget.name === "goDown") {
      ////console.log("goDown")
      if (isMobile) {
        window.scroll(0, document.body.scrollHeight);
        document.querySelector(".allEpisodes").scrollTop = document.querySelector(".allEpisodes").scrollHeight;
      } else {
        // window.scroll(0,(document.body.scrollHeight-500));
        window.scroll(0, document.body.scrollHeight);
        document.querySelector(".allEpisodes").scrollTop = document.querySelector(".allEpisodes").scrollHeight;
      }
    }
  }
  return (
    <div className='video-container'>
      {
        isLoading ? (
          <Loading LoadingType={"HashLoader"} color={"red"}/>
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
                  <video ref={videoRef} 
                  className='video-js vjs-big-play-centered vjs-theme-fantasy'
                  // controls
                  ></video>
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
                    <i className='fa-solid fa-home'></i>
                  </Link>
                  <Link to={`/anime-details/${values.AnimeID}`} >
                    <i className='fa-solid fa-bars'></i>
                  </Link>
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
                allEpisodes.map(ep => (
                  <div className={`video-episode ${values.EpisodeNumber === ep.number ? 'active' : ''}`}
                    key={ep.number}
                    onClick={() => {
                      navigateToPlay(ep.id, ep.number, encodeURIComponent(values.Animetitle), values.AnimeID)
                    }}
                  >
                    {/* <p>episode title</p> */}
                    <p id='vid-epnum'>{ep.number}</p>
                  </div>
                ))
              }
            </div>

          </>
        ) : ""
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
