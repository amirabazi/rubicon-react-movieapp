import React, { useEffect, useState } from 'react'

import './Homepage.css'
import axios from 'axios'
import MovieWrapper from '../Components/MovieWrapper/MovieWrapper';
import TvShowsWrapper from '../Components/TvShowsWrapper/TvShowsWrapper';

interface IApiCall {
    movies: {
        backdrop_path: string,
        overview: string,
        title: string,
        vote_average: number

    }[],
    series: {
        backdrop_path: string,
        overview: string,
        name: string,
        vote_average: number
    }[],
    searchedMovies: {
        backdrop_path: string,
        original_title: string,
        overview: string,
        vote_average: number
    }[],

}


function Homepage() {
    const apiKey = "1a049c4595923c5bcca0118888ab8aea";
    const [movies, setMovies] = useState<IApiCall["movies"]>([]);
    const [series, setSeries] = useState<IApiCall["series"]>([]);
    const [searchedMovies, setSearchedMovies] = useState<IApiCall["searchedMovies"]>([]);
    const [movieToggle, setMovieToggle] = useState(false);
    const [search, setSearch] = useState("");
    const [seriesToggle, setSeriesToggle] = useState(false);


    useEffect(() => {
        axios.get("https://api.themoviedb.org/3/movie/top_rated?api_key=" + apiKey + "&language=en-US&page=1")
            .then((response) => {
                setMovies(response.data.results)
            }).catch((error) => {
                console.log(error);
            })

        axios.get("https://api.themoviedb.org/3/tv/top_rated?api_key=" + apiKey + "&language=en-US&page=1")
            .then((result) => {
                setSeries(result.data.results)
            }).catch((error) => {
                console.log(error);
            })
    }, [movieToggle, seriesToggle])

    useEffect(() => {
        axios.get("https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&language=en-US&query=" + search + "&page=1&include_adult=false")
            .then((res) => {
                setSearchedMovies(res.data.results);
            }).catch((error) => {
                console.log(error);
            })
    }, [search])
    console.log(searchedMovies)

    return (
        <div className="homepage">
            <div className="homepage__navigate">
                <div className="navigate__buttons">
                    <button className="btn"
                        onClick={() => {
                            setMovieToggle(true);
                            setSeriesToggle(false);
                            console.log(movieToggle, seriesToggle)
                        }}>Movies</button>
                    <button className="btn"
                        onClick={() => {
                            setSeriesToggle(true);
                            setMovieToggle(false);
                            console.log(seriesToggle, movieToggle)
                        }}>TV Shows</button>
                </div>
                <form className="homepage__form">
                    <input type="text"
                        className="search"
                        placeholder="search a movie..."
                        onChange={(e) => {
                            setSearch(e.target.value)
                        }} />
                </form>
            </div>
            <div className="homepage__content">
                {movieToggle ?
                    <div className="movies__page">

                        {
                            movies.slice(0, 10).map((movie, index) => {
                                return (
                                    <MovieWrapper key={index} vote_average={movie.vote_average} title={movie.title} image={"https://image.tmdb.org/t/p/original" + movie.backdrop_path} overview={movie.overview} />
                                )
                            })
                        }
                    </div>
                    : <div className="tvshows__page">
                        {
                            series.slice(0, 10).map((series, index) => {
                                return (
                                    <TvShowsWrapper key={index} vote_average={series.vote_average} name={series.name} image={"https://image.tmdb.org/t/p/original" + series.backdrop_path} title={series.overview || "TBA"} />
                                )
                            })
                        }
                    </div>
                }

            </div>
        </div>
    )
}

export default Homepage
