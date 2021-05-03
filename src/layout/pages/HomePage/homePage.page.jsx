import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/navbar.component';

import './homePage.style.css';

import firebase from '../../../config/firebaseConfig';

import LoadingScreen from '../../components/LoadingScreen/loadingScreen.component';
import Sidebar from '../../components/Sidebar/sidebar.component';

import bannerImg from '../../assets/homeBanner.svg'
import RecentlyViewed from '../../components/RecentlyViewedList/recentlyViewed.component';

import { BiPlus } from 'react-icons/bi'

const HomePage = (props) => {

    const [currentUser, setCurrentUser] = useState(null);
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
        <div className="homepage-container">
            <Navbar />
            <div className="homepage-boards">
                <div className="homepage-sidebar">
                    <Sidebar page={props.location.pathname} currentUserEmail={currentUser.email} />
                </div>
                <div className="homepage-body">
                    <div className="homepage-content">
                        <div className="content-wrapper">
                            <div className="content-img">
                                <img src={bannerImg} />
                            </div>
                            <div className="content-paragraph">
                                <h4>Hello {currentUser ? currentUser.name : null}, stay upto date and on track</h4>
                                <p>Invite people to boards and cards, leave comments, add due dates, and we'll show the most important activity here.</p>
                            </div>
                        </div>
                    </div>
                    <div className="homepage-right-menu">
                        <RecentlyViewed />

                        <div className="create-link-menu">
                            <p>LINKS</p>
                            <div>
                                <div className="add-box">
                                    <BiPlus color="#616161" />
                                </div>
                                <p>Create a board</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage;
