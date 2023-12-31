import React, { useState, useEffect } from 'react'
import axios from 'axios';

import { Link, useParams } from 'react-router-dom';

import AnimeCard from "../AnimeCard/AnimeCard";
import Loading from '../Loading/Loading';

import './Genre.css';

const Genre = () => {
    const { genre } = useParams();
    console.log(genre)
    const [anime, setAnime] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(null);
    const [title, settitle] = useState('');
    const [isLoading, setisLoading] = useState(false);

    const fetchData = async (titlte, page) => {
        try {
            setisLoading(true);
            const result = await axios.get(`https://gogo-server.vercel.app/genre/${encodeURIComponent(titlte)}?page=${page}`)
            if (result.data) {
                console.log({ result1_Data: "result1_Data" }, result.data);
                setAnime(result.data.list);
                setTotalPage(result.data.totalPages);
            }
            setisLoading(false)
        } catch (error) {
            console.log(error);
            setisLoading(false)
        }
    }

    useEffect(()=>{
      fetchData(genre,1)
      settitle(genre);
    },[genre])
    useEffect(() => {
        setTimeout(() => {
            fetchData(title, currentPage);
        }, 200);
        // window.scroll({behavior:"instant"})
        // window.scroll(0,0)
    }, [currentPage])

    useEffect(() => {
        setTimeout(() => {
            fetchData(title, 1);
        }, 200);
    }, [title])


    const handleNavigation = (e) => {
        if (e.target.name === "prev") {
            if (currentPage < 1) return;

            console.log("prev");
            // fetchData(currentPage-1);
            // navigate(`/${currentPage - 1}`)
            setCurrentPage(currentPage - 1);
            // setisLoading(true);
        }
        if (e.target.name === "next") {
            if (currentPage < 1 || currentPage >= totalPage)
                return;
            // fetchData(currentPage+1);
            // navigate(`/${currentPage + 1}`)
            setCurrentPage(currentPage + 1);
            console.log("next")
            // setisLoading(true);
        }
    }
    return (
        <div className='genre-container'>
            <h1 className='btn-genre'>{genre}</h1>
            {/* <div className="text"><p>{genre}</p></div> */}
            {
                isLoading ? (
                    <Loading LoadingType={"ScaleLoader"} color={"red"} />
                ) : (
                    <div className="genre-results">
                        {
                            anime && anime.length > 0 ? (
                                <>
                                    {
                                        anime.map((anime, i) => (
                                            <Link
                                                to={`/anime-details/${anime.animeID}`}
                                                key={i}>
                                                <AnimeCard anime={anime} />
                                            </Link>
                                        ))
                                    }
                                </>
                            ) : <div className="text"><p>Not Found</p></div>
                        }
                    </div>
                )
            }
            {
                anime && anime.length > 0 ? (
                    <div className="genre-navigation">
                        {
                            currentPage > 1 && (
                                <button type="button" name='prev' onClick={handleNavigation}>Prev</button>
                            )
                        }
                        <div className="currentPage">
                            <p>{currentPage}</p>
                        </div>
                        {
                            currentPage < totalPage && (
                                <button type="button" name='next' onClick={handleNavigation}>Next</button>
                            )
                        }
                    </div>

                ) : ""
            }

        </div>
    )
}

export default Genre
