import React, { useEffect, useState } from 'react';

import './signupPage.style.css';

import loginImg from '../../assets/login.png';
import logo from '../../assets/logo.png'
import googleIcon from '../../assets/google.svg';

import { FiEye, FiEyeOff } from 'react-icons/fi'

import firebase from '../../../config/firebaseConfig';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Lottie from 'lottie-react-web'
import loadingAnimation from '../../assets/lottie/loading.json';

const SignupPage = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                window.location.href = "/home";
            }
        })
    }, []);

    const handleText = (e) => {
        if (e.target.id === 'email') {
            setEmail(e.target.value)
        }
        else if (e.target.id === 'name') {
            setName(e.target.value);
        }
        else {
            setPassword(e.target.value);
        }
    }

    const handleSignup = () => {
        setLoading(true);
        if (email === '') {
            toast.error('Please provide valid email');
        }
        else if (name === '') {
            toast.error('Please provide your name');
        }
        else if (password === '') {
            toast.error('Please provide password');
        }
        else {
            firebase.firestore().collection('users').where('email', '==', email).get()
                .then((querySnapshot) => {
                    if (querySnapshot.size === 0) {
                        firebase.firestore().collection('users').add({
                            name: name,
                            email: email,
                            boards: [],
                            templates: []
                        })
                            .then(() => {
                                firebase.auth().createUserWithEmailAndPassword(email, password)
                                    .then(() => {
                                        window.location.href = "/home";
                                        setLoading(false);
                                    })
                                    .catch((error) => {
                                        setLoading(false);
                                        if (error.code === 'auth/email-already-in-use') {
                                            toast.error('That email address is already in use!');
                                        }

                                        if (error.code === 'auth/invalid-email') {
                                            toast.error('That email address is invalid!');
                                        }

                                    })
                            })
                    }
                    else {
                        toast.error('User with this email already exists !');
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false);
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
                                <h4>Sign up for your account</h4>
                            </div>
                            <div className="form-group">
                                <input type="email" id="email" className="form-input" placeholder="Enter email" onChange={handleText} />
                            </div>
                            <div className="form-group">
                                <input type="text" id="name" className="form-input" placeholder="Enter name" onChange={handleText} />
                            </div>
                            <div className="form-group">
                                <input type={showPassword ? "text" : "password"} id="password" className="form-input" placeholder="Enter password" onChange={handleText} />
                                {
                                    showPassword
                                        ?
                                        <div className="eye-container" onClick={handleTogglePassword}>
                                            <FiEyeOff />
                                        </div>
                                        :
                                        <div className="eye-container" onClick={handleTogglePassword}>
                                            <FiEye />
                                        </div>
                                }
                            </div>
                            <div className="form-group">
                                <p>By signing up, I accept the TeamMate Terms of Service and acknowledge the Privacy Policy.</p>
                            </div>
                            <div className="form-group">
                                <button type="button" className="login-btn" onClick={handleSignup}>
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
                                            "Sign up"
                                    }
                                </button>
                            </div>
                            {/* <div className="form-group">
                                <p>OR</p>
                            </div>

                            <div className="form-group">
                                <button type="button" className="google-btn"><img src={googleIcon} />Continue with Google</button>
                            </div> */}

                            <div className="form-group">
                                <a href="/login">Already have an account ? Click to Log in</a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default SignupPage;