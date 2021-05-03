import React, { useState, useEffect } from 'react'

import './navbar.style.css'

import logo from '../../assets/logo2.png';
import { BsGrid } from 'react-icons/bs'
import { BiHomeAlt, BiClipboard, BiSearch, BiPlus, BiInfoCircle, BiBell } from 'react-icons/bi'
import { FaUserCircle } from 'react-icons/fa'

import firebase from '../../../config/firebaseConfig';

const Navbar = (props) => {

    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setUserEmail(user.email);
            }
        })
    }, [])

    const handleLogout = () => {
        firebase.auth().signOut()
            .then(() => {
                console.log("Signed Out")
            })
            .catch((error) => {
                console.error(error);
            })
    }

    return (
        <nav className="nav-container">
            <div className="nav-section">
                <div className="menu-box">
                    <BsGrid color="#fff" size={20} />
                </div>
                <div className="menu-box" onClick={() => window.location.href = "/home"}>
                    <BiHomeAlt color="#fff" size={20} />
                </div>
                <div className="menu-box" onClick={() => window.location.href = "/" + userEmail + "/boards"}>
                    <BiClipboard color="#fff" size={20} />
                    <p>Boards</p>
                </div>
                <div className="menu-box">
                    <input type="text" placeholder="Search..." />
                    <BiSearch color="#fff" size={20} />
                </div>
            </div>
            <div className="nav-section">
                <div className="logo-container">
                    <img src={logo} />
                    <h1>TeamMate</h1>
                </div>
            </div>
            <div className="nav-section">
                <div className="menu-box">
                    <BiPlus color="#fff" size={20} />
                </div>
                <div className="menu-box">
                    <BiInfoCircle color="#fff" size={20} />
                </div>
                <div className="menu-box">
                    <BiBell color="#fff" size={20} />
                </div>
                <div className="menu-box" onClick={handleLogout}>
                    <FaUserCircle color="#fff" size={20} />
                </div>
            </div>
        </nav>
    )
}

export default Navbar;