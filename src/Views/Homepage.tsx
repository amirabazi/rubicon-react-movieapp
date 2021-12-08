import _ from 'lodash';
import React, { useEffect, useState, useCallback } from 'react'
import './Homepage.css'
import axios from 'axios'
import MovieWrapper from '../Components/MovieWrapper/MovieWrapper';

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
    const [searchedMovies, setSearchedMovies] = useState<MovieAndSeriesData[]>([]);
    const [search, setSearch] = useState("");
    const debounceSearchMovies = useCallback(_.debounce(doSearchMovies, 1000), []);
    const debounceSearchTV = useCallback(_.debounce(doSearchTV, 1000), []);

    // Movies tab api calls
    function doSearchMovies(inputvalue: string): void {
        if (inputvalue.length < 3) {
            axios.get("https://api.themoviedb.org/3/movie/top_rated?api_key=" + apiKey + "&language=en-US&page=1")
                .then((response) => {
                    setSearchedMovies(response.data.results)
                    console.log('MOVIES', searchedMovies)
                }).catch((error) => {
                    console.log(error);
                })
        } else {

            axios.get("https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&language=en-US&query=" + inputvalue + "&page=1&include_adult=false")
                .then((res) => {
                    setSearchedMovies(res.data.results);
                }).catch((error) => {
                    console.log(error);
                })
        }
    }

    function searchEventMovies(event: any): void {
        setSearch(event.target.value);
        debounceSearchMovies(event.target.value);
    }

    // TV shows api calls
    function doSearchTV(inputvalue: string): void {
        if (inputvalue.length < 3) {
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
                        setSearchedMovies(series);
                    }
                }).catch((error) => {
                    console.log(error);
                })
        } else {

            axios.get("https://api.themoviedb.org/3/search/tv?api_key=" + apiKey + "&language=en-US&query=" + inputvalue + "&page=1&include_adult=false")
                .then((res) => {
                    setSearchedMovies(res.data.results);
                }).catch((error) => {
                    console.log(error);
                })
            console.log('inputVal', inputvalue)
        }
    }

    function searchEventTV(event: any): void {
        setSearch(event.target.value);
        debounceSearchTV(event.target.value);
    }

    // Defaultni poziv pri prvom loadanju stranice
    function moviesApiCall() {
        axios.get("https://api.themoviedb.org/3/movie/top_rated?api_key=" + apiKey + "&language=en-US&page=1")
            .then((response) => {
                setSearchedMovies(response.data.results)
            }).catch((error) => {
                console.log(error);
            })
    }

    useEffect(() => {
        moviesApiCall();
    }, [])

    return (
        <div className="homepage">
            <div className="homepage__navigate">
                <div className="navigate__buttons">
                    <button className="btn"
                        onClick={() => {
                            doSearchMovies(search);
                        }}>Movies</button>
                    <button className="btn"
                        onClick={() => {
                            doSearchTV(search);
                        }}>TV Shows</button>
                </div>
                <form className="homepage__form">
                    <input type="text"
                        className="search"
                        placeholder="search a movie..."
                        onChange={searchEventMovies || searchEventTV} />
                </form>
            </div>
            <div className="homepage__content">
                <div className="movies__page">
                    {
                        searchedMovies.slice(0, 10).map((movie, index) => {
                            return (
                                <MovieWrapper key={index}
                                    id={movie.id}
                                    vote_average={movie.vote_average || 0}
                                    title={movie.title as string || "TBA"}
                                    image={"https://image.tmdb.org/t/p/original" + movie.backdrop_path}
                                    overview={movie.overview || "TBA"}
                                    apiKey={apiKey}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Homepage
