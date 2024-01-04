import React,{useState, useEffect,useRef} from 'react'
import axios from 'axios';

import {Link} from 'react-router-dom';

import AnimeCard from "../AnimeCard/AnimeCard";
import Loading from '../Loading/Loading';

import './Search.css';

const Search = () => {

  const [anime, setAnime] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(null);
  const [title, settitle] = useState('');
  const [isLoading, setisLoading] = useState(false);

  const fetchData = async(titlte,page)=>{
    try {
      setisLoading(true);
      const result = await axios.get(`http://localhost:8081/search?title=${encodeURIComponent(titlte)}&page=${page}`)
      if(result.data){
        // console.log({result1_Data:"result1_Data"}, result.data);
        setAnime(result.data.list);
        setTotalPage(result.data.totalPages);
      }
      setisLoading(false)
    } catch (error) {
      console.log(error);
      setisLoading(false)
    }
  }

  // useEffect(()=>{
  //   fetchData("one piece",1)
  // },[])
  const timeoutIdRef = useRef(null);

  useEffect(()=>{
    clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = setTimeout(() => {
      fetchData(title,currentPage);
      // console.log("t + c")
    }, 200);
    return () => {
      // Cleanup: clear the timeout when the component is unmounted
      clearTimeout(timeoutIdRef.current);
    };
    // window.scroll({behavior:"instant"})
    // window.scroll(0,0)
  },[currentPage])

  useEffect(()=>{
    clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current= setTimeout(() => {
      fetchData(title,1);
      // console.log("t + 1")
    }, 200);
    return () => {
      // Cleanup: clear the timeout when the component is unmounted
      clearTimeout(timeoutIdRef.current);
    };

  },[title])


  const handleNavigation= (e)=>{
    if(e.target.name === "prev"){
      if(currentPage < 1) return;

        //console.log("prev");
        // fetchData(currentPage-1);
        // navigate(`/${currentPage - 1}`)
        setCurrentPage(currentPage-1);
        // setisLoading(true);
    }
    if(e.target.name === "next"){
      if(currentPage < 1 || currentPage >= totalPage) 
      return;
      // fetchData(currentPage+1);
      // navigate(`/${currentPage + 1}`)
      setCurrentPage(currentPage+1);
      //console.log("next")
      // setisLoading(true);
    }
  }
  return (
    <div className='search-container'>
      <div className="searchbar">
        <input type="text" name="search" id="search" placeholder='search..' value={title} onChange={(e)=> settitle(e.target.value)}/>
        <i className='fa-solid fa-search'></i>
      </div>
      {
        isLoading?(
          <Loading LoadingType={"ScaleLoader"} color={"red"}/>
        ):(
          <div className="search-results">
          {
            title?(
              anime && anime.length>0?(
                <>
              {
                anime.map((anime,i)=>(
                  <Link
                  to={`/anime-details/${anime.animeID}`} 
                  key={i}>
                  <AnimeCard anime={anime}/>
                  </Link>
                ))
              }
                </>
              ): <div className="text"><p>Not Found</p></div>  
            ):(
              <div className="text"><p>Search your anime ex.(one piece)</p></div>
            )
          }
        </div>  
        )
      }
      {
        anime && anime.length >0?(
          <div className="search-navigation">
            {
              currentPage > 1 &&(
                <button type="button" name='prev'onClick={handleNavigation}>Prev</button>
              )
            }
          <div className="currentPage">
            <p>{currentPage}</p>
          </div>
          { 
            currentPage < totalPage &&(
              <button type="button" name='next'onClick={handleNavigation}>Next</button>
            )
          }
        </div>

        ):""
      }

    </div>
  )
}

export default Search
