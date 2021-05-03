import React, { useState, useEffect } from 'react'

import './boardCard.style.css';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import firebase from '../../../config/firebaseConfig';

const BoardCard = (props) => {
    const [loading, setLoading] = useState(true);
    const [boardInfo, setBoardInfo] = useState(null);

    useEffect(() => {
        firebase.firestore().collection('boards').doc(props.boardId)
            .onSnapshot((doc) => {
                setBoardInfo(doc.data());
                setLoading(false);
            })
    }, []);

    return (
        <div className="board-card" onClick={() => window.location.href = "/board/" + props.boardId}>
            {
                loading
                    ?
                    <div style={{ height: '100%', width: '100%' }}>
                        <Skeleton height={100} />
                    </div>
                    :
                    <>
                        {
                            boardInfo && boardInfo.background.type === 'image'
                                ?
                                <>
                                    <div className="board-card-container">
                                        <img src={boardInfo.background.value} />
                                        <div className="img-overlay">
                                            <p>{boardInfo.title}</p>
                                        </div>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="board-card-container" style={{ backgroundColor: boardInfo.background.value }}>
                                        <div className="img-overlay">
                                            <p>{boardInfo.title}</p>
                                        </div>
                                    </div>
                                </>
                        }
                    </>
            }
        </div>
    )
}

export default BoardCard;
