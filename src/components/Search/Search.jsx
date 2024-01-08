import React,{useState, useEffect} from 'react'
import axios from 'axios';

import {Link, useParams, useNavigate} from 'react-router-dom';

import AnimeCard from "../AnimeCard/AnimeCard";
import Loading from '../Loading/Loading';
import useDebounce from '../useDebounce/useDebounce';

import './Search.css';

const Search = () => {
  const { qTitle,qPage } = useParams();
  const navigate = useNavigate();

  const [anime, setAnime] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(null);
  const [title, setTitle] = useState("");
  
  const debouncedSearch = useDebounce(title,500);
  const seturlParms= ()=>{
    navigate(`/search/${debouncedSearch}/${currentPage}`)
  }
  const fetchData = async(sTitle,sPage)=>{
    try {
      setisLoading(true);
      const result = await axios.get(`https://gogo-server.vercel.app/search?title=${encodeURIComponent(sTitle)}&page=${sPage}`)
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
  const handleInput = (e)=>{
    setTitle(e.target.value);
  }
  useEffect(()=>{
    debouncedSearch !== ""&&
    seturlParms();
  },[debouncedSearch,currentPage])
  // const timeoutIdRef = useRef(null);
  useEffect(()=>{
    fetchData(debouncedSearch,currentPage);
  },[qTitle,qPage])


  const handleNavigation= (e)=>{
    if(e.target.name === "prev"){
      if(currentPage < 1) return;
        setCurrentPage(currentPage-1);
    }
    if(e.target.name === "next"){
      if(currentPage < 1 || currentPage >= totalPage) 
      return;
      setCurrentPage(currentPage+1);
    }
  }

  const renderAnimes = ()=>{
    if(qTitle === null || qTitle?.trim() ==="" || debouncedSearch?.trim()==="")
      return(<div className="text"><p>Search your anime ex.(one piece)</p></div>)

    if(anime.length<=0) 
      return(<div className="text"><p>Not Found</p></div>)

    return(
        anime.map((anime,i)=>(
          <Link to={`/anime-details/${anime.animeID}`} key={i}>
          <AnimeCard anime={anime}/>
          </Link>
        ))
    )
  }
  const renderNavigation = ()=>{
    if(anime.length <=0) return null;
    
    return(
      <div className="search-navigation">
        {currentPage > 1 && (<button type="button" name='prev'onClick={handleNavigation}>Prev</button>) }
        <div className="currentPage"> <p>{currentPage}</p> </div>
        {currentPage < totalPage && (<button type="button" name='next'onClick={handleNavigation}>Next</button>) }
      </div>
    )
  }

  return (
    <div className='search-container'>
      <div className="searchbar">
        <input type="text" name="search" id="search" placeholder='search..' value={title} onChange={handleInput}/>
        <i className='fa-solid fa-search'></i>
      </div>
      {
        isLoading?(<Loading LoadingType={"ScaleLoader"} color={"red"}/>):
        (<div className="search-results">{renderAnimes()}</div>)
      }
      {renderNavigation()}
    </div>
  )
}

export default Search
