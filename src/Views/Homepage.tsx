import _ from 'lodash';
import React, { useEffect, useState, useCallback } from 'react'
import './Homepage.css'
import axios from 'axios'
import MovieWrapper from '../Components/MovieWrapper/MovieWrapper';
import { apiClient } from '../ApiClient';

type MovieAndSeriesData = {
    id: number;
    backdrop_path: string;
    overview: string;
    title: string;
    vote_average: number;
}
interface IHooks {
    onClick: () => void;
}

function Homepage() {
    const apiKey = "1a049c4595923c5bcca0118888ab8aea";
    const [movies, setMovies] = useState<MovieAndSeriesData[]>([]);
    const [series, setSeries] = useState<MovieAndSeriesData[]>([]);
    const [searchedMovies, setSearchedMovies] = useState<MovieAndSeriesData[]>([]);
    const [movieToggle, setMovieToggle] = useState(false);
    const [search, setSearch] = useState("");
    const [seriesToggle, setSeriesToggle] = useState(false);
    const debounceSearch = useCallback(_.debounce(doSearch, 3000), []);

    function doSearch(inputvalue: string): void {
        if (inputvalue.length < 3) {
            return;
        }

        axios.get("https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&language=en-US&query=" + inputvalue + "&page=1&include_adult=false")
            .then((res) => {
                setSearchedMovies(res.data.results);
                console.log('search api', searchedMovies)
            }).catch((error) => {
                console.log(error);
            })
        console.log('inputVal', inputvalue)
    }

    function searchEvent(event: any): void {
        setSearch(event.target.value);
        debounceSearch(event.target.value);
    }

    useEffect(() => {
        axios.get("https://api.themoviedb.org/3/movie/top_rated?api_key=" + apiKey + "&language=en-US&page=1")
            .then((response) => {
                setMovies(response.data.results)
                console.log(movies)
            }).catch((error) => {
                console.log(error);
            })

        axios.get("https://api.themoviedb.org/3/tv/top_rated?api_key=" + apiKey + "&language=en-US&page=1")
            .then((result) => {
                if (result.data.results !== undefined) {
                    const series: MovieAndSeriesData[] = result.data.results.map((res: any) => {
                        return {
                            id: res.id,
                            backdrop_path: res.backdrop_path,
                            overview: res.title,
                            title: res.name,
                            vote_average: res.vote_average,
                        }
                    });
                    setSeries(series);
                }
            }).catch((error) => {
                console.log(error);
            })
    }, [])



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
                        onChange={searchEvent} />
                </form>
            </div>
            <div className="homepage__content">
                {movieToggle ?
                    <div className="movies__page">
                        {
                            movies.slice(0, 10).map((movie, index) => {
                                return (
                                    <MovieWrapper key={index}
                                        id={movie.id}
                                        vote_average={movie.vote_average}
                                        title={movie.title as string}
                                        image={"https://image.tmdb.org/t/p/original" + movie.backdrop_path}
                                        overview={movie.overview}
                                        apiKey={apiKey}
                                    />
                                )
                            })
                        }
                    </div>
                    :  /* <- or */
                    <div className="tvshows__page">
                        {
                            series.slice(0, 10).map((series, index) => {
                                return (
                                    <MovieWrapper key={index}
                                        id={series.id}
                                        vote_average={series.vote_average}
                                        title={series.title as string}
                                        apiKey={apiKey}
                                        image={"https://image.tmdb.org/t/p/original" + series.backdrop_path}
                                        overview={series.overview} />
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
