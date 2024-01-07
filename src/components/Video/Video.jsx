import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
// import Hls from 'hls.js';
import { useLanguage } from '../../context/langContext';
import Loading from '../Loading/Loading';
import EpisodeCard from '../EpisodeCard/EpisodeCard';
// import videojs from 'video.js'
import VideoPlayer from "../CUSTOM_VIDEO_PLAYER/VideoPlayer";

// import 'videojs-mobile-ui/dist/videojs-mobile-ui.css';
// import '@videojs/themes/dist/fantasy/index.css';
// import 'videojs-mobile-ui';
import "./Video.css";
// import "videojs-hotkeys";
// import "videojs-seek-buttons";

import fakeImg from "../../images/NoImg.png";

const Video = () => {
  const navigate = useNavigate();
  const { currentLang } = useLanguage();

  const { episodeID, episodeNum, animeTitle, animeID } = useParams();

  const navigateToPlay = (episodeId, episodeNum, animeTitle, animeId) => {
    const url = `/video/${episodeId}/${episodeNum}/${animeTitle}/${animeId}`;
    navigate(url);
  };

  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [crrLoaded, setcrrLoaded] = useState(false);

  // <Route path='/video/:animeID/:episodeNum/:episodeID/:providerID/:subType/:server?/:apiKey?' element={<Video/>}/>
  const [videoSrc, setvideoSrc] = useState([]);
  const [quality, setquality] = useState([]);
  const [allEpisodes, setallEpisodes] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const [currentVideo, setcurrentVideo] = useState({
    src: "",
    quality: ""
  });
  const [oldVideoURL, setoldVideoURL] = useState("");
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
  let isMobile;

  // ////console.log(useParams());
  let isRequestPending = false;
  let timeoutOccurred = false;

  const fetchSrc = async () => {
    isRequestPending = true;
    try {
      setisLoading(true);
      const result = await axios.get(`https://gogo-server.vercel.app/source?episodeID=/${encodeURIComponent(episodeID)}`, { timeout: 5000 })
      console.log({ result_data_1: "result.data 1" }, result.data);

      setvideoSrc(result.data.sources);
      // ////console.log("result 1 done")
      // console.log(animeTitle);
      const result2 = await axios.get(`https://gogo-server.vercel.app/search?title=${encodeURIComponent(animeTitle.split("Part")[0])}`, { timeout: 5000 });
      if (result2.data.list.length > 0) {
        // console.log({ result_data_2: "result.data 2" }, result2.data);
        const res = result2.data.list[0];
        setValues(value => ({
          ...value,
          Animetitle: {
            english: (res.animeTitle && (res.animeTitle.english && res.animeTitle.english ? res.animeTitle.english : null)),
            english_jp: (res.animeTitle && (res.animeTitle.english_jp && res.animeTitle.english_jp ? res.animeTitle.english_jp : animeTitle)),
            japanese: (res.animeTitle && (res.animeTitle.japanese && res.animeTitle.japanese ? res.animeTitle.japanese : null)),
          },
          AnimeID: res.animeID && res.animeID ? res.animeID : "",
          imgURL: res.animeImg && res.animeImg ? res.animeImg : "",
          EpisodeNumber: Number(episodeNum),
          AdditonalInfo: res,
          // EpisodeTitle: result.data.animeTitle
        }));
      }
      else {
        const result2 = await axios.get(`https://gogo-server.vercel.app/anime-details?animeID=${animeID}`, { timeout: 5000 })
        // console.log({ result_data_22: "result.data 2" }, result2.data);
        const res = result2.data;
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

      }
      setisLoading(false);
    } catch (error) {
      console.error(error)
      setisLoading(false);
    }
    // setisLoading(false);
    finally {
      isRequestPending = false;
      setisLoading(false);
    }
  }

  const fetchAllEpisode = async (animID) => {
    isRequestPending = true;

    // ////console.log("FetchAllEpisodes start")
    try {
      //console.log(values.AdditonalInfo.AdditionalInfo.id)
      const result3 = await axios.get(`https://gogo-server.vercel.app/episodes?animeID=${encodeURIComponent(values.AnimeID)}&kid=${values.AdditonalInfo.AdditionalInfo.id}`, { timeout: 5000 })
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
    // ////console.log(result3.data)
    ////console.log({ result_data_3: "result.data 3" }, result3.data);

    // if(result3.data.length>0){
    // ////console.log("FetchAllEpisodes done")
    // }
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


  const videoRef = useRef(null);
  // const hlsRef = useRef(null);
  // const storageKey = `videoPlaybackTime_${episodeID}`;

  useEffect(() => {
    if (!isRequestPending) {
      // console.log('Request already pending. Ignoring duplicate request.');
      fetchSrc();
    }
  }, [episodeID]);


  useEffect(() => {
    // ////console.log(values)
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
        setcrrLoaded(false);
        // console.log({ idk: "video srcc" }, { videoSrc });
      }
    }
  }, [videoSrc])

  // useEffect(()=>{
  //   console.log({currentVideoFIX:currentVideo.src});
  // },[currentVideo])
  // const initializeVideoJS = () => {
  //   // Check if Video.js is already initialized on the video element
  //   if (!videojs.getPlayers()[videoRef.current.id]) {

  //     const videoPlayer = videojs(videoRef.current, {
  //       controls: true,
  //       autoplay: false,
  //       preload: 'auto',
  //       fluid: true,
  //       aspectRatio: '16:9',
  //       userActions: {
  //         click: true,
  //         // hotkeys: true,
  //       },
  //       playbackRates: [0.25, 0.5, 1, 1.5, 2, 2.5, 3, 4],
  //       controlBar: {
  //         fullscreenToggle: true,
  //         // progressControl: true,
  //         // seekToLive: true,
  //         timeDivider: false, // Show the time divider (default is true)
  //         durationDisplay: true, // Show the duration display (default is true)
  //       },
  //     });


  //     videoPlayer.mobileUi({
  //       fullscreen: {
  //         enterOnRotate: true,
  //         exitOnRotate: true,
  //         lockOnRotate: true,
  //         lockToLandscapeOnEnter: true,
  //         disabled: false,
  //       },
  //       touchControls: {
  //         seekSeconds: 10,
  //         tapTimeout: 300,
  //         disableOnEnd: false,
  //         disabled: false,
  //       },
  //     });

  //     videoPlayer.hotkeys({
  //       volumeStep: 0.1,
  //       seekStep: 10,
  //       enableModifiersForNumbers: false
  //     });

  //   }

  // };

  // useEffect(()=>{
  //   initializeVideoJS();
  // },[])

  // const hls = new Hls();
  // useEffect(() => {
  //   const video = videoRef.current;
  //   // console.log({crrr:currentVideo.src},{oldVideoURL:oldVideoURL})

  //   if ((currentVideo.src !== "" || oldVideoURL !== "")) {
  //     if(currentVideo.src !== oldVideoURL){

  //     if (!crrLoaded) {
  //       initializeVideoJS();
  //       if (Hls.isSupported()) {
  //         hls.loadSource(currentVideo.src);
  //         setoldVideoURL(currentVideo.src);
  //         hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
  //           // window.hls = hls
  //           const availableQualities = hls.levels.map((l) => l.height)
  //           setquality({
  //             default: data.levels[hls.startLevel].height,
  //             options: availableQualities,
  //           })
  //           // console.log('Height:', data.levels[hls.startLevel].height);

  //           // console.log(hls.levels)
  //         })
  //         hls.on(Hls.Events.LEVEL_SWITCHED, (evt, data) => {
  //           const level = hls.levels[data.level];
  //           if (level) {
  //             setquality(d=>({
  //               ...d,
  //               default:level.height,
  //             }))
  //               // console.log(`qualityChange ${level.width}x${level.height}`);
  //           }
  //         });

          

  //         hls.attachMedia(video);
  //         window.hls = hls;
  //         setcrrLoaded(true);
  //       } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
  //         video.src = videoSrc[0].url;
  //       }
  //       // console.log("if"+{crrr:currentVideo.src},{oldVideoURL})
  //       const storedTime = localStorage.getItem(storageKey);
  //       if (storedTime && video) {
  //         video.currentTime = parseFloat(storedTime);
  //       }
  //     }
  //   }

  //   }
  // }, [currentVideo]);

  // const updateQuality = (newQuality) => {
  //   window.hls.levels.forEach((level, i) => {
  //     if (level.height === newQuality) {
  //       window.hls.currentLevel = i
  //     }
  //   })
  // }
  // useEffect(() => {
  //   console.log({ quality: quality })
  // }, [quality])

  // useEffect(() => {
  //   const storedTime = localStorage.getItem(storageKey);
  //   if (storedTime && videoRef.current) {
  //     videoRef.current.currentTime = parseFloat(storedTime);
  //   }
  // }, [storageKey]);

  // const handleVideoTimeUpdate = () => {
  //   if (videoRef.current) {
  //     const currentTime = videoRef.current.currentTime;
  //     localStorage.setItem(storageKey, currentTime);
  //   }
  // };

  // const handleQuality = (e) => {
  //   let target = e.target;
  //   if (videoSrc.length > 0) {
  //     setcrrLoaded(false);
  //     switch (target.name) {
  //       case "360": {
  //         ////console.log("360p");
  //         updateQuality(360)
  //         setquality(d => ({
  //           ...d,
  //           default: 360,
  //         }))
  //         // const defaultURL = videoSrc.find(src => src.quality === "360p");
  //         // setcurrentVideo(val => ({
  //         //   ...val,
  //         //   src: defaultURL.url,
  //         //   quality: defaultURL.quality
  //         // }));
  //         ////console.log({ idk: "360p" }, currentVideo.src);

  //         break;
  //       }
  //       case "480": {
  //         ////console.log("480p");
  //         updateQuality(480)
  //         setquality(d => ({
  //           ...d,
  //           default: 480,
  //         }))
  //         // const defaultURL = videoSrc.find(src => src.quality === "480p");
  //         // setcurrentVideo(val => ({
  //         //   ...val,
  //         //   src: defaultURL.url,
  //         //   quality: defaultURL.quality
  //         // }));
  //         ////console.log({ idk: "480p" }, currentVideo.src);
  //         break;
  //       }
  //       case "720": {
  //         ////console.log("720p");
  //         updateQuality(720)
  //         setquality(d => ({
  //           ...d,
  //           default: 720,
  //         }))
  //         // const defaultURL = videoSrc.find(src => src.quality === "720p");
  //         // setcurrentVideo(val => ({
  //         //   ...val,
  //         //   src: defaultURL.url,
  //         //   quality: defaultURL.quality
  //         // }));
  //         ////console.log({ idk: "720p" }, currentVideo.src);
  //         break;
  //       }
  //       case "1080": {
  //         ////console.log("1080p");
  //         updateQuality(1080);
  //         setquality(d => ({
  //           ...d,
  //           default: 1080,
  //         }))
  //         // const defaultURL = videoSrc.find(src => src.quality === "1080p");
  //         // setcurrentVideo(val => ({
  //         //   ...val,
  //         //   src: defaultURL.url,
  //         //   quality: defaultURL.quality
  //         // }));
  //         ////console.log({ idk: "1080p" }, currentVideo.src);
  //         break;
  //       }
  //       case "backup": {
  //         ////console.log("backup");
  //         const defaultURL = videoSrc.find(src => src.quality === "backup");
  //         setcurrentVideo(val => ({
  //           ...val,
  //           src: defaultURL.url,
  //           quality: defaultURL.quality
  //         }));
  //         ////console.log({ idk: "backup" }, currentVideo.src);
  //         break;
  //       }
  //       default: {
  //         ////console.log("default");
  //         const defaultURL = videoSrc.find(src => src.quality === "default");
  //         setcurrentVideo(val => ({
  //           ...val,
  //           src: defaultURL.url,
  //           quality: defaultURL.quality
  //         }));
  //         ////console.log({ idk: "default" }, currentVideo.src);
  //       }
  //     }

  //   }
  // }
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
  // const [toggle, settoggle] = useState(false);
  // useEffect(() => {
  //   const toggleBtn = document.querySelector(".toggle");
  //   const qBtns = document.querySelectorAll(".vidSrc");

  //   if (toggleBtn.classList.contains('active')) {
  //     qBtns.forEach(btn => {
  //       btn.style.display = "block";
  //     });
  //   } else {
  //     qBtns.forEach(btn => {
  //       btn.style.display = btn.classList.contains('active') ? "block" : "none";
  //     });

  //   }
  // }, [toggle]);

  function handlePrev() {
    if (episodeNum !== null && episodeNum > 1) {
      let currentEpNumb = Number(episodeNum);
      let prevEpisodeNum = currentEpNumb - 1;
      // console.log(prevEpisodeNum);

      let prevEpisodeID = episodeID.replace(currentEpNumb, prevEpisodeNum);
      // console.log(prevEpisodeID);

      let prevAnimeTitle = values.Animetitle.english_jp ? values.Animetitle.english_jp : values.Animetitle.english;
      // let prevIsDub = isDub;

      // navigateToPlay(ep.id, ep.number, encodeURIComponent(values.Animetitle), values.AnimeID)
      navigateToPlay(prevEpisodeID, prevEpisodeNum, encodeURIComponent(prevAnimeTitle), values.AnimeID);
    }
    // else{
    //     console.log("cant be less than 1");
    // }
  }

  function handleNext() {
    if (episodeNum > 0 && episodeNum < allEpisodes.length) {
      let currentEpNumb = Number(episodeNum);
      let nextEpisodeNum = currentEpNumb + 1;
      //console.log(nextEpisodeNum);

      let nextEpisodeID = episodeID.replace(currentEpNumb, nextEpisodeNum);
      //console.log(nextEpisodeID);

      let nextAnimeTitle = values.Animetitle.english_jp ? values.Animetitle.english_jp : values.Animetitle.english;
      // let nextIsDub = isDub;

      navigateToPlay(nextEpisodeID, nextEpisodeNum, encodeURIComponent(nextAnimeTitle), values.AnimeID);
      // navigateToPlay(nextEpisodeID,nextEpisodeNum,nextAnimeTitle,nextIsDub);
    }
    // else{
    //     console.log("cant be more than" + allEpisodes.length);
    // }
  }

  return (
    <div className='video-container'>
      {
        isLoading ? (
          <Loading LoadingType={"HashLoader"} color={"red"} />
        ) :
          (
            <div className="video">

              <div className="video-title">
                <div className="video-poster">
                  <img src={values.imgURL && values.imgURL ? values.imgURL : fakeImg} alt={values.Animetitle && values.Animetitle} />
                </div>

                <div className="video-info">
                  <p id='viat'>{
                    currentLang === "en" ? (
                      (values.Animetitle && (values.Animetitle.english && values.Animetitle.english ? values.Animetitle.english : values.Animetitle.english_jp))
                    ) : (
                      values.Animetitle && (values.Animetitle.english_jp && values.Animetitle.english_jp ? values.Animetitle.english_jp : values.Animetitle.japanese))
                  }</p>
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
                {/* <video ref={videoRef}
                  className='video-js vjs-big-play-centered vjs-theme-fantasy'
                  // controls
                  onTimeUpdate={handleVideoTimeUpdate}
                ></video> */}
              </div>
              {/* <div className="video-qualities">

                {
                  videoSrc && videoSrc.length > 0 ? (
                    <>
                      {
                        quality.options?.map((src) => (
                          <button className={`vidSrc ${quality.default === src ? 'active' : ''}`} type="button" name={src} onClick={handleQuality} key={src}>{src}P</button>
                        ))

                      }
                    <button className={`vidSrc ${currentVideo.quality === "backup" ? 'active' : ''}`} type="button" name={"backup"} onClick={handleQuality}>backup</button>
                    </>
                    // videoSrc.map(src => (
                    // ))
                  ) : ("")
                }
                <button
                  type="button"
                  className={`toggle ${toggle ? "active" : ""}`}
                  onClick={() => settoggle(!toggle)}
                >
                  <i className='fa-solid fa-angles-left'></i>Quality
                </button>
              </div> */}
              <div className="video-home">
                {/* <Link to={`/`} >
                    <i className='fa-solid fa-home'></i>
                  </Link> */}
                {episodeNum > 1 ? (
                  <button type="button" className='btn btn-prev' onClick={handlePrev} >Prev</button>
                ) : ""}
                <Link to={`/anime-details/${values.AnimeID}`} >
                  <i className='fa-solid fa-home'></i>
                </Link>
                {
                  episodeNum < allEpisodes.length ? (
                    <button type="button" className='btn btn-next' onClick={handleNext} >Next</button>
                  ) : ""
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
