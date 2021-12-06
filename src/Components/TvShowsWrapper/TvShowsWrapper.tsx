import React from 'react'
import '../MovieWrapper/MovieWrapper.css'

interface IProps {
    image: string,
    title: string,
    name: string,
    vote_average: number
}

function TvShowsWrapper({ image, title, name, vote_average }: IProps) {
    return (
        <div className="moviewrapper">
            <div className="img__wrapper">
                <img className="img" src={image} alt={"TvShowsImg"} />
            </div>
            <div className="about__wrapper sc3">
                <p className="score">{vote_average}</p>
                <h3 className="title">{name}</h3>
                <p className="overview">{title}</p>
            </div>
        </div>
    )
}

export default TvShowsWrapper
