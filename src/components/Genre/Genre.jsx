import React, { useState, useEffect } from 'react'
import axios from 'axios';

import { Link, useParams } from 'react-router-dom';

import AnimeCard from "../AnimeCard/AnimeCard";
import Loading from '../Loading/Loading';

import './Genre.css';

const Genre = () => {
    const { genre } = useParams();
    const [anime, setAnime] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(null);
    const [isLoading, setisLoading] = useState(false);

    const fetchData = async (Title, page = 1) => {
        try {
            setisLoading(true);

            const result = await axios.get(`https://ani-short.vercel.app/genre/${encodeURIComponent(Title)}/${page}`);
            //console.log({ result1_Data: "result1_Data" }, result.data);
            setAnime(result.data.list);
            setTotalPage(result.data.totalPages);
            setisLoading(false)
        } catch (error) {
            console.log(error);
            setisLoading(false)
        }
    }

    useEffect(() => {
        if(genre || genre !== ""){
            fetchData(genre, 1);
        }
    }, [genre])
    useEffect(() => {
        fetchData(genre, currentPage);
    }, [currentPage])

    const handleNavigation = (e) => {
        if (e.target.name === "prev") {
            if (currentPage < 1) return;

            setCurrentPage(currentPage - 1);
        }
        if (e.target.name === "next") {
            if (currentPage < 1 || currentPage >= totalPage)
                return;
            setCurrentPage(currentPage + 1);
        }
    }
    
return (
    <div className='genre-container'>
        <h1 className='btn-genre'>{genre}</h1>
        {
            isLoading ? (<Loading LoadingType={"ScaleLoader"} color={"red"} />) : 
            (
                <div className="genre-results">
                { 
                anime?.length > 0 ? (
                anime.map((anime, i) => (
                    <Link to={`/anime-details/${anime.animeID}`} key={i}>
                        <AnimeCard anime={anime} />
                    </Link>)))
                    :(<div className="text"><p>Not Found</p></div>)
                }
                </div>
            )
        }
        {
        anime?.length > 0 ? (
            <div className="genre-navigation">
                {
                    currentPage > 1 && (<button type="button" name='prev' onClick={handleNavigation}>Prev</button>)
                }
                <div className="currentPage"> <p>{currentPage}</p> </div>
                {
                    currentPage < totalPage && (<button type="button" name='next' onClick={handleNavigation}>Next</button>)
                }
            </div>) : null
        }
    </div>
)
}

export default Genre
