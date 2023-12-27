import React,{useState, useEffect} from 'react'
import axios from 'axios';

import {Link, useNavigate} from 'react-router-dom';

import AnimeCard from "../AnimeCard/AnimeCard";

import './Search.css';

const Search = () => {

  const [anime, setAnime] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(null);
  const [title, settitle] = useState('');

  const fetchData = async(titlte,page)=>{
    try {
      const result = await axios.get(`https://gogo-server.vercel.app/search?title=${encodeURIComponent(titlte)}&page=${page}`)
      if(result.data){
        console.log({result1_Data:"result1_Data"}, result.data);
        setAnime(result.data.list);
        setTotalPage(result.data.totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    fetchData(title,1)
  },[])
  useEffect(()=>{
    setTimeout(() => {
      fetchData(title,currentPage);
    }, 200);
  },[currentPage, title])

  const handleNavigation= (e)=>{
    if(e.target.name === "prev"){
      if(currentPage < 1) return;

        console.log("prev");
        // fetchData(currentPage-1);
        // navigate(`/${currentPage - 1}`)
        setCurrentPage(currentPage-1);
        // setisLoading(true);
    }
    if(e.target.name === "next"){
      if(currentPage < 1 || currentPage > totalPage) 
      return;
      // fetchData(currentPage+1);
      // navigate(`/${currentPage + 1}`)
      setCurrentPage(currentPage+1);
      console.log("next")
      // setisLoading(true);
    }
  }
  return (
    <div className='search-container'>
      <div className="searchbar">
        <input type="text" name="search" id="search" placeholder='search..' value={title} onChange={(e)=> settitle(e.target.value)}/>
        <i className='fa-solid fa-search'></i>
      </div>
      <div className="search-results">
        {
          title?(
            anime && anime.length>0?(
              anime.map((anime,i)=>(
                <Link
                to={`/anime-details/${anime.animeID}`} 
                key={i}>
                <AnimeCard anime={anime}/>
                </Link>
              ))
            ): <div className="text"><p>Not Found</p></div>  
          ):(
            <div className="text"><p>Search your anime ex.(one piece)</p></div>
          )
        }
      </div>
      <div className="search-navigation">
        <button type="button" name='prev'onClick={handleNavigation}>Prev</button>
        <div className="currentPage">
          <p>{currentPage}</p>
        </div>
        <button type="button" name='next'onClick={handleNavigation}>Next</button>
      </div>
    </div>
  )
}

export default Search
