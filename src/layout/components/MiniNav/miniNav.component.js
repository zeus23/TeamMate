import React from 'react'

import './miniNav.style.css';

import { BsStar, BsStarFill } from 'react-icons/bs';
import { BiNetworkChart, BiUserPlus, BiLockOpen, BiMenu } from 'react-icons/bi'
import { MdTitle } from 'react-icons/md'

import firebase from '../../../config/firebaseConfig';

const MiniNav = (props) => {

    const handleToggleFavourite = () => {
        firebase.firestore().collection('users').doc(props.currentUser.id).get()
            .then((res) => {
                var newBoards = res.data().boards;
                newBoards.map((item) => {
                    if (item.id === props.boardId) {
                        item.isFavourite = !props.isFavourite
                    }
                })
                firebase.firestore().collection('users').doc(props.currentUser.id).update({
                    boards: newBoards
                })
            })
    }

    return (
        <nav className="mininav-container">
            <div className="mininav-section">
                <div className="menu-box">
                    <BiNetworkChart color="#fff" style={{ margin: "0 0.3rem" }} />
                    <p>Zohaib Kibria's workspace</p>

                </div>
                <div className="midline"></div>
                <div className="menu-box">
                    <MdTitle color="#fff" style={{ margin: "0 0.2rem" }} />
                    <p>{props.boardInfo.title}</p>
                </div>
                <div className="midline"></div>
                <div className="menu-box">
                    <BiLockOpen color="#fff" style={{ margin: "0 0.2rem" }} />
                    <p>Workspace visible</p>
                </div>
                <div className="midline"></div>
                <div className="menu-box">
                    <BiUserPlus color="#fff" style={{ margin: "0 0.2rem" }} />
                    <p>Invite</p>
                </div>
            </div>
            <div className="mininav-section">
                <div className="menu-box" onClick={handleToggleFavourite}>
                    {
                        props.isFavourite
                            ?
                            <BsStarFill color="#fedf00" />
                            :
                            <BsStar color="#fff" />
                    }
                </div>
                <div className="midline"></div>
                <div className="menu-box">
                    <BiMenu color="#fff" style={{ margin: "0 0.2rem" }} />
                    <p>Show Menu</p>
                </div>
            </div>
        </nav>
    )
}

export default MiniNav;