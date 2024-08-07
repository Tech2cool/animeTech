import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom";
import axios from 'axios';
import AnimeCard from '../AnimeCard/AnimeCard';
import Loading from '../Loading/Loading';
import {useParams, useNavigate } from 'react-router-dom';

import "./Home.css";
import ExtraNavbar from '../ExtraNavbar/ExtraNavbar';

const Home = () => {
  const navigate = useNavigate();
  const {page} = useParams();

  const [anime, setAnime] = useState([]);
  const [totalPage, setTotalPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setisLoading] = useState(false);

  const fetchLatest= async(pageNum=1,perPage=12)=>{
    try {
      const result = await axios.get(`https://ani-short.vercel.app/recent?page=${pageNum}&perPage=${perPage}`);

      // console.log({result:"result 1"},result.data);
      setAnime(result.data.list);
      setTotalPage(result.data.totalPages);
    } catch (error) {
      //console.log(error);
    }
    setisLoading(false);
  }

  // useEffect refresh only
  // useEffect(()=>{
  //   fetchLatest();
  //   setisLoading(true);
  // },[])
  useEffect(() => {
    fetchLatest(page);
    setisLoading(true);
    setCurrentPage(page? Number(page):1);
  }, [page]);

  // useEffect anime change only
  useEffect(()=>{
    // //console.log(anime);
  },[anime])

  const handleNavigation= (e)=>{
    if(e.target.name === "prev"){
      if(currentPage <= 1) return;

        //console.log("prev");
        // fetchLatest(currentPage-1);
        navigate(`/${currentPage - 1}`)
        // setCurrentPage(currentPage-1);
        // setisLoading(true);
    }
    if(e.target.name === "next"){
      if(currentPage < 1 || currentPage >= totalPage) 
      return;
      // fetchLatest(currentPage+1);
      navigate(`/${currentPage + 1}`)
      // setCurrentPage(currentPage+1);
      //console.log("next")
      // setisLoading(true);
    }
  }
  return (
    <div className='home-container'>
      <div className="home-title">
        <h1>Latest</h1>
        <ExtraNavbar />
      </div>
      {
        isLoading ? (
          <Loading LoadingType={"ScaleLoader"} color={"red"}/>
        ):(
          <div className="home-grid">
          {
            anime && anime.length >0?(
              anime.map((anime, i)=>(
                <Link
                key={i}
                to={`/video/${anime.episodeId}/${anime.episodeNum}/${
                  (anime.animeTitle&&encodeURIComponent(anime.animeTitle.english_jp&& anime.animeTitle.english_jp))
                  ||(anime.animeTitle&& encodeURIComponent(anime.animeTitle.japanese&& anime.animeTitle.japanese))
                  ||(anime.animeTitle&& encodeURIComponent(anime.animeTitle.english&& anime.animeTitle.english))
                }/${anime.animeID}`}

                // state={{animeTitleNative:(anime.animeTitle&&encodeURIComponent(anime.animeTitle.english_jp&& anime.animeTitle.english_jp))}}
                >
                <AnimeCard anime={anime}/>
                </Link>
              ))
            ): "Nothing to see here.."
          }
        </div>
        )
      }

      <div className="home-navigation">
        {
              currentPage > 1 &&(
                <button type="button" name='prev' onClick={handleNavigation}>Prev</button>
              )
            }
          <div className="currentPage">
            <p>{currentPage}</p>
          </div>
          { 
            currentPage < totalPage &&(
              <button type="button" name='next' onClick={handleNavigation}>Next</button>
            )
          }
      
      </div>
    </div>
  )
}

export default Home
