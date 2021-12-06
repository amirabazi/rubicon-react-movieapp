import React from 'react'
import './MovieWrapper.css'

interface IProps {
    image: string,
    overview: string,
    title: string,
    vote_average: number

}

function MovieWrapper({ image, title, vote_average, overview }: IProps) {
    return (
        <div className="moviewrapper">
            <div className="img__wrapper">
                <img className="img" src={image} alt="movieImg" />
            </div>
            <div className="about__wrapper">
                <p className="score">{vote_average}</p>
                <h3 className="title">{title}</h3>
                <p className="overview">{overview}</p>
            </div>
        </div>
    )
}

export default MovieWrapper
