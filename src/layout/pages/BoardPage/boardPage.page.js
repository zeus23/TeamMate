import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/navbar.component';

import './boardPage.style.css';

import firebase from '../../../config/firebaseConfig';
import Lottie from 'lottie-react-web'

import LoadingScreen from '../../components/LoadingScreen/loadingScreen.component';
import Sidebar from '../../components/Sidebar/sidebar.component';

import empty from '../../assets/lottie/emptyBoard.json';

import { BiPlus } from 'react-icons/bi'
import CreateBoard from '../../components/CreateBoard/createBoard.component';

import userImg from '../../assets/user.svg';
import star from '../../assets/star.svg';
import BoardCard from '../../components/BoardCard/boardCard.component';

import addImg from '../../assets/add.svg';

const BoardPage = (props) => {

    const [currentUser, setCurrentUser] = useState(null);
    const [anyFavourites, setAnyFavourites] = useState(false);
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                window.location.href = "/login"
            }
            else {
                firebase.firestore().collection('users').where('email', '==', user.email).get()
                    .then((querySnapshot) => {
                        if (querySnapshot.size > 0) {
                            querySnapshot.forEach((documentSnapshot) => {
                                setCurrentUser(documentSnapshot.data());
                                documentSnapshot.data().boards.length > 0 && documentSnapshot.data().boards.map((item) => {
                                    if (item.isFavourite === true) {
                                        setAnyFavourites(true);
                                    }
                                })
                            })
                            setLoading(false);
                        }
                    })

            }
        })
    }, []);

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <div className="boards-container">
            <Navbar />
            <div className="boards-boards">
                <div className="boards-sidebar">
                    <Sidebar page={props.location.pathname} currentUserEmail={currentUser.email} />
                </div>
                <div className="boards-body">
                    {
                        currentUser && currentUser.boards.length > 0
                            ?
                            <>
                                <div className="template-section">
                                    <div className="section-header">
                                        <img src={userImg} />
                                        <p>{currentUser.name + "'s workspace"}</p>
                                    </div>
                                    <div className="section-body">
                                        {
                                            currentUser.boards.map((item) => {
                                                return <BoardCard boardId={item.id} />
                                            })
                                        }
                                        <div className="add-card" onClick={() => setShowModal(true)}>
                                            <img src={addImg} />
                                            <p>Create new board</p>
                                        </div>
                                    </div>
                                </div>
                                {
                                    anyFavourites
                                        ?
                                        <div className="template-section">
                                            <div className="section-header">
                                                <img src={star} />
                                                <p>{currentUser.name + "'s starred"}</p>
                                            </div>
                                            <div className="section-body">
                                                {
                                                    currentUser.boards.map((item) => {
                                                        if (item.isFavourite === true) {
                                                            return <BoardCard boardId={item.id} />
                                                        }
                                                    })
                                                }
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                            </>
                            :
                            <div className="empty-boards">
                                <Lottie
                                    options={{
                                        animationData: empty
                                    }}
                                    width={350}
                                    height={350}
                                />
                                <p>Looks like you have not created any boards</p>
                                <div className="add-container" onClick={() => setShowModal(true)}>
                                    <div className="add-box">
                                        <BiPlus color="#616161" />
                                    </div>
                                    <p>Create a board</p>
                                </div>
                            </div>
                    }
                </div>
            </div>

            {
                showModal
                    ?
                    <CreateBoard goBack={() => setShowModal(false)} currentUserEmail={currentUser.email} />
                    :
                    null
            }
        </div >
    )
}

export default BoardPage;
