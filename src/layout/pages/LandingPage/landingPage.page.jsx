import React, { useEffect, useState } from 'react'

import './landingPage.stye.css';

import bannerImg from '../../assets/banner.png';
import logo from '../../assets/logo2.png';

import firebase from '../../../config/firebaseConfig';

const LandingPage = () => {

    const [showBtn, setShowBtn] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setUserEmail(user.email);
                setShowBtn(true);
            }
        })
    }, [])

    return (
        <div className="landingPage-container">
            {/* Navbar */}
            <nav className="landing-navbar">
                <div className="navbar-container">
                    <div>
                        <img className="logo" src={logo} />
                        <h1>TeamMate</h1>
                    </div>
                    {
                        showBtn
                            ?
                            <button type="button" onClick={() => window.location.href = userEmail + "/boards"}>Visit Boards</button>
                            :
                            <button type="button" onClick={() => window.location.href = "/login"}>Log In</button>
                    }
                </div>
            </nav>
            {/* Banner section */}
            <section className="banner-section">
                <div className="banner-left-section">
                    <div className="banner-tag">Discover new ways to collaborate with your team.</div>
                    <h1>TeamMate helps teams move work forward.</h1>
                    <p>Collaborate, manage projects, and reach new productivity peaks. From high rises to the home office, the way your team works is unique—accomplish it all with TeamMate.</p>
                    <button type="button" onClick={() => window.location.href = "/signup"}>Sign up - it's free !</button>
                </div>
                <div className="banner-right-section">
                    <img className="banner-img" src={bannerImg} />
                </div>
            </section>
        </div>
    )
}

export default LandingPage;
