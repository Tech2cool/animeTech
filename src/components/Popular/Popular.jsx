import React, { useEffect,useState } from 'react'
import axios from "axios";
import {Link} from "react-router-dom";
import AnimeCard from '../AnimeCard/AnimeCard';
import Loading from '../Loading/Loading';

import "./Popular.css";

const Popular = () => {
  // const {page}= useParams();

  const [anime, setAnime] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(null);
  const [isLoading, setisLoading] = useState(false);

    const fetchPupular= async(page)=>{
        const result = await axios.get(`https://gogo-server.vercel.app/popular?page=${page}`)

        console.log({msg:"popular"},result.data);
        if(result.data.list&& result.data.list.length>0){
          setAnime(result.data.list);
          setTotalPage(result.data.totalPages);
          setisLoading(false);
        }
    }

    useEffect(()=>{
        fetchPupular();
        setisLoading(true);
    },[])

    const handleNavigation= (e)=>{
      if(e.target.name === "prev"){
        if(currentPage < 1) return;
  
          console.log("prev");
          fetchPupular(currentPage-1);
          // navigate(`/${currentPage - 1}`)
          setCurrentPage(currentPage-1);
          setisLoading(true);
          // setisLoading(true);
      }
      if(e.target.name === "next"){
        if(currentPage < 1 || currentPage > totalPage) 
        return;
        fetchPupular(currentPage+1);
        // navigate(`/${currentPage + 1}`)
        setCurrentPage(currentPage+1);
        setisLoading(true);
        console.log("next")
        // setisLoading(true);
      }
    }
  
  return (
    <div className='popular-container'>
      <h1>Popular Anime</h1>
      {
        isLoading?(
          <Loading LoadingType={"ScaleLoader"} color={"red"}/>
        ):(
          <div className="popular-results">
          {
            anime && anime.length>0?(
              anime.map((anime,i)=>(
                <Link
                to={`/anime-details/${anime.animeId}`} 
                key={i}>
                <AnimeCard anime={anime}/>
                </Link>
              ))
            ):""
          }
        </div>
        )
      }

      <div className="popular-navigation">
        <button type="button" name='prev'onClick={handleNavigation}>Prev</button>
        <div className="currentPage">
          <p>{currentPage}</p>
        </div>
        <button type="button" name='next'onClick={handleNavigation}>Next</button>
      </div>
      
    </div>
  )
}

export default Popular
