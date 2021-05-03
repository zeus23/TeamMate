import React, { useState } from 'react';

import './createBoard.style.css';

import { FaCheckCircle } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { MdDashboard } from 'react-icons/md'

import firebase from '../../../config/firebaseConfig';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Lottie from 'lottie-react-web'
import loadingAnimation from '../../assets/lottie/loading.json';

const CreateBoard = (props) => {
    const [color, setColor] = useState('#0079bf');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSetTitle = (e) => {
        setTitle(e.target.value);
    }

    const handleCreate = () => {
        setLoading(true);
        var background = {};
        background.type = 'color';
        background.value = color;
        firebase.firestore().collection('boards').add({
            title: title,
            description: '',
            owner: props.currentUserEmail,
            participants: [props.currentUserEmail],
            chatId: null,
            list: [
                {
                    title: 'To Do',
                    Cards: [],
                    color: '#EBECF0'
                },
                {
                    title: 'Doing',
                    Cards: [],
                    color: '#EBECF0'
                },
                {
                    title: 'Completed',
                    Cards: [],
                    color: '#EBECF0'
                },
            ],
            background: background
        })
            .then((result) => {
                toast.success(title + ' Board Created');
                firebase.firestore().collection('users').where('email', '==', props.currentUserEmail).get()
                    .then((querySnapshot) => {
                        if (querySnapshot.size > 0) {
                            querySnapshot.forEach((doc) => {
                                var array = doc.data().boards;
                                var boardOb = {};
                                boardOb.id = result.id;
                                boardOb.isFavourite = false;
                                array.push(boardOb);

                                firebase.firestore().collection('users').doc(doc.id).update({
                                    boards: array
                                })
                                    .then(() => {
                                        console.log("Updated");
                                        setLoading(false);
                                        window.location.href = "/board/" + result.id;
                                    })
                                    .catch((error) => {
                                        console.error(error);
                                        setLoading(false);
                                    })
                            })
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        setLoading(false);
                    })
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            })
    }

    return (
        <>
            <ToastContainer />
            <div className="create-overlay">
                <div className="create-container">
                    <div className="create-head">
                        <div className="create-title">
                            <div className="box" style={{ backgroundColor: color }}>
                                <input type="text" placeholder="Add board title" onChange={handleSetTitle} value={title} />
                                <IoClose size={20} color="#fff" style={{ cursor: 'pointer' }} onClick={() => props.goBack()} />
                            </div>
                        </div>
                        <div className="create-grid">
                            <div className="box" style={{ backgroundColor: '#0079bf' }} onClick={() => setColor('#0079bf')}>
                                {
                                    color === '#0079bf'
                                        ?
                                        <FaCheckCircle color="#fff" />
                                        :
                                        null
                                }
                            </div>
                            <div className="box" style={{ backgroundColor: '#d29034' }} onClick={() => setColor('#d29034')}>
                                {
                                    color === '#d29034'
                                        ?
                                        <FaCheckCircle color="#fff" />
                                        :
                                        null
                                }
                            </div>
                            <div className="box" style={{ backgroundColor: '#519839' }} onClick={() => setColor('#519839')}>
                                {
                                    color === '#519839'
                                        ?
                                        <FaCheckCircle color="#fff" />
                                        :
                                        null
                                }
                            </div>
                            <div className="box" style={{ backgroundColor: '#b04632' }} onClick={() => setColor('#b04632')}>
                                {
                                    color === '#b04632'
                                        ?
                                        <FaCheckCircle color="#fff" />
                                        :
                                        null
                                }
                            </div>
                            <div className="box" style={{ backgroundColor: '#89609e' }} onClick={() => setColor('#89609e')}>
                                {
                                    color === '#89609e'
                                        ?
                                        <FaCheckCircle color="#fff" />
                                        :
                                        null
                                }
                            </div>
                            <div className="box" style={{ backgroundColor: '#cd5a91' }} onClick={() => setColor('#cd5a91')}>
                                {
                                    color === '#cd5a91'
                                        ?
                                        <FaCheckCircle color="#fff" />
                                        :
                                        null
                                }
                            </div>

                        </div>
                    </div>
                    <div className="create-foot">
                        <button
                            type="button"
                            style={title.length > 0 ? { backgroundColor: '#5AAC44', color: '#fff' } : null}
                            disabled={title.length > 0 ? false : true}
                            onClick={handleCreate}
                        >
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
                                    "Create Board"
                            }
                        </button>
                        {
                            loading
                                ?
                                null
                                :
                                <button type="button" onClick={() => window.location.href = "/templates"}><MdDashboard color="#fff" size={20} style={{ marginRight: '10px' }} /> Start with a template</button>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateBoard;
