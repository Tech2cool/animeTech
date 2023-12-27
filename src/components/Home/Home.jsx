import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom";
import axios from 'axios';
import AnimeCard from '../AnimeCard/AnimeCard';
import Loading from '../Loading/Loading';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {page} = useParams();

  const [anime, setAnime] = useState([]);
  const [totalPage, setTotalPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setisLoading] = useState(false);

  const fetchLatest= async(pageNum=1,perPage=12)=>{
    try {
      const result = await axios.get(`https://gogo-server.vercel.app/recent?page=${pageNum}&perPage=${perPage}`);

      //console.log({result:"result 1"},result.data);
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
      if(currentPage < 1) return;

        //console.log("prev");
        // fetchLatest(currentPage-1);
        navigate(`/${currentPage - 1}`)
        // setCurrentPage(currentPage-1);
        // setisLoading(true);
    }
    if(e.target.name === "next"){
      if(currentPage < 1 || currentPage > totalPage) 
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
                to={`/video/${anime.episodeId}/${anime.episodeNum}/${
                  anime.animeTitle&& encodeURIComponent(anime.animeTitle[0].english&& anime.animeTitle[0].english?anime.animeTitle[0].english
                    :anime.animeTitle[0].english_jp&& anime.animeTitle[0].english_jp)}/${anime.animeID}`}
                state={{animeTitleNative: anime.animeTitle[0].english_jp&& encodeURIComponent(anime.animeTitle[0].english_jp)}}
                key={i}>
                <AnimeCard anime={anime}/>
                </Link>
              ))
            ): "Not found OR Loading"
          }
        </div>
        )
      }

      <div className="home-navigation">
        <button type="button" name='prev'onClick={handleNavigation}>Prev</button>
        <div className="currentPage">
          <p>{currentPage}</p>
        </div>
        <button type="button" name='next'onClick={handleNavigation}>Next</button>
      </div>
    </div>
  )
}

export default Home
