import React, { useState, useEffect } from 'react';

import './loginPage.style.css';

import loginImg from '../../assets/login.png';
import logo from '../../assets/logo.png'
import googleIcon from '../../assets/google.svg';

import firebase from '../../../config/firebaseConfig';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Lottie from 'lottie-react-web'
import loadingAnimation from '../../assets/lottie/loading.json';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                window.location.href = "/home"
            }
            else {
                console.log("No user found");
            }
        })
    }, []);

    const handleText = (e) => {
        if (e.target.id === 'email') {
            setEmail(e.target.value)
        }
        else {
            setPassword(e.target.value);
        }
    }

    const handleSignIn = () => {
        setLoading(true);
        if (email === '') {
            toast.error('Please provide valid email');
        }
        else if (password === '') {
            toast.error('Please provide password');
        }
        else {
            firebase.firestore().collection('users').where('email', '==', email).get()
                .then((querySnapshot) => {
                    if (querySnapshot.size > 0) {
                        firebase.auth().signInWithEmailAndPassword(email, password)
                            .then(() => {
                                window.location.href = "/home"
                                setLoading(false);
                            })
                            .catch((error) => {
                                toast.error(error.message);
                                setLoading(false);
                            })
                    }
                    else {
                        toast.error('No user found with this email !');
                        setLoading(false);
                    }
                })
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="login-container">
                <div className="login-left-container">
                    <img src={loginImg} />
                </div>
                <div className="login-right-container">
                    <div className="login-head" onClick={() => window.location.href = "/"}>
                        <img className="logo" src={logo} />
                        <h1>TeamMate</h1>
                    </div>
                    <div className="login-body">
                        <div className="login-form">
                            <div className="form-group">
                                <h4>Log in to TeamMate</h4>
                            </div>
                            <div className="form-group">
                                <input type="text" id="email" className="form-input" placeholder="Enter email" onChange={handleText} />
                            </div>
                            <div className="form-group">
                                <input type="password" id="password" className="form-input" placeholder="Enter password" onChange={handleText} />
                            </div>
                            <div className="form-group">
                                <button type="button" className="login-btn" onClick={handleSignIn}>
                                    {
                                        loading
                                            ?
                                            <Lottie
                                                options={{
                                                    animationData: loadingAnimation
                                                }}
                                                height={20}
                                            />
                                            :
                                            "Log in"
                                    }
                                </button>
                            </div>
                            <div className="form-group">
                                <p>OR</p>
                            </div>

                            <div className="form-group">
                                <button type="button" className="google-btn"><img src={googleIcon} />Continue with Google</button>
                            </div>

                            <div className="form-group">
                                <a href="/signup">Can't log in ? Sign up for an account</a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage;