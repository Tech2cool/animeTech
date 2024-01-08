import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Link } from "react-router-dom";
import AnimeCard from '../AnimeCard/AnimeCard';
import Loading from '../Loading/Loading';

import "./Popular.css";

const Popular = () => {
  // const {page}= useParams();

  const [anime, setAnime] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  const fetchPupular = async (page = 1) => {
    try {
      setisLoading(true);
      const result = await axios.get(`https://gogo-server.vercel.app/popular?page=${page}`)

      //console.log({ msg: "popular" }, result.data);
      if (result.data.list && result.data.list.length > 0) {
        setAnime(result.data.list);
        setTotalPage(result.data.totalPages);
        setisLoading(false);
      }

    } catch (error) {
      console.log(error);
      setisLoading(false);
    }
  }

  useEffect(() => {
    fetchPupular();
  }, [])

  const handleNavigation = (e) => {
    if (e.currentTarget.name === "prev") {
      if(currentPage < 1) return;

      fetchPupular(currentPage - 1);
      setCurrentPage(currentPage - 1);
    }
    if (e.currentTarget.name === "next") {
      if (currentPage < 1 || currentPage >=totalPage)
        return;
      fetchPupular(currentPage + 1);
      setCurrentPage(currentPage + 1);
    }
  }

  return (
    <div className='popular-container'>
      <h1>Popular Anime</h1>
      {
        isLoading ? (<Loading LoadingType={"ScaleLoader"} color={"red"} />)
        :(
          <div className="popular-results">
            {
              anime?.length > 0 ? (
                anime.map((anime, i) => (
                  <Link to={`/anime-details/${anime.animeID && anime.animeID}`} key={i}>
                    <AnimeCard anime={anime} />
                  </Link>))
              ) : null
            }
          </div>
        )
      }

      <div className="popular-navigation">
        {
          currentPage > 1 &&(<button type="button" name='prev' onClick={handleNavigation}>Prev</button>)
        }
        <div className="currentPage"> <p>{currentPage}</p> </div>
        { 
          currentPage < totalPage &&(<button type="button" name='next' onClick={handleNavigation}>Next</button>)
        }
      </div>

    </div>
  )
}

export default Popular
