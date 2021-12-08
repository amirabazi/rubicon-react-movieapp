import React, { useEffect, useState } from 'react'
import Modal from 'react-modal';
import './MovieWrapper.css'
import { FiArrowLeft } from "react-icons/fi";
import axios from 'axios'
interface IProps {
    id: number,
    image: string,
    overview: string,
    title: string,
    vote_average: number,
    apiKey: string,
}
interface ITrailer {
    trailer: {
        id: string,
        key: string,
        name: string,
    }[],
}

function MovieWrapper({ image, title, vote_average, overview, apiKey, id, }: IProps) {
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [videoFetch, setVideoFetch] = useState<ITrailer["trailer"]>([])

    function openModal(): void {
        setModalIsOpen(true);
        getVideo();
    }

    function closeModal(): void {
        setModalIsOpen(false);
    }

    function getVideo(): void {
        axios.get("https://api.themoviedb.org/3/movie/" + id + "/videos?api_key=" + apiKey + "&language=en-US")
            .then((res) => {
                setVideoFetch(res.data.results[0].key)
            }).catch((error) => {
                console.log(error);
            })
    }
    return (
        <div className="moviewrapper">
            <div className="img__wrapper" onClick={openModal}>
                <img className="img" src={image} alt="movieImg" />
            </div>
            <div className="about__wrapper">
                <p className="score">{vote_average}</p>
                <h3 className="title">{title}</h3>
            </div>
            <Modal
                isOpen={modalIsOpen}
                style={customStyles}
            >
                <div className="modalDiv">
                    <div className="backBtn" onClick={closeModal}>
                        <FiArrowLeft className="icon" />
                        <p >Back</p>
                    </div>
                    <div className="modalImg">
                        <iframe width="100%" height="315"
                            src={"https://www.youtube.com/embed/" + videoFetch}>
                        </iframe>
                    </div>
                    <h2 className="modalTitle">{title}</h2>
                    <p className="modalOverview">{overview}</p>
                </div>
            </Modal>
        </div>
    )
}

export default MovieWrapper
