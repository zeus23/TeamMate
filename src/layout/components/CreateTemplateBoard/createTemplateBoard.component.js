import React, { useState } from 'react';

import './createTemplateBoard.style.css';

import firebase from '../../../config/firebaseConfig';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Lottie from 'lottie-react-web'
import loadingAnimation from '../../assets/lottie/loading.json';

const CreateTemplateBoard = (props) => {
    var List = [];
    if (props.category === 'business') {
        List = [
            {
                title: 'Customer Segments',
                Cards: [],
                color: '#EBECF0'
            },
            {
                title: 'Channels',
                Cards: [],
                color: '#EBECF0'
            },
            {
                title: 'Revenue',
                Cards: [],
                color: '#EBECF0'
            },
            {
                title: 'Cost Structure',
                Cards: [],
                color: '#EBECF0'
            },
            {
                title: 'Key Partnerships',
                Cards: [],
                color: '#EBECF0'
            },
        ]
    }

    else if (props.category === 'design') {
        List = [
            {
                title: 'Project Brief',
                Cards: [],
                color: '#EBECF0'
            },
            {
                title: 'Brand Identity',
                Cards: [],
                color: '#EBECF0'
            },
            {
                title: 'Product Design',
                Cards: [],
                color: '#EBECF0'
            },
            {
                title: 'Marketing Website',
                Cards: [],
                color: '#EBECF0'
            },
            {
                title: 'Client Reviews',
                Cards: [],
                color: '#EBECF0'
            },
        ]
    }

    else if (props.category === 'engineering') {
        List = [
            {
                title: 'Prototype',
                Cards: [],
                color: '#EBECF0'
            },
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
                title: 'Code Review',
                Cards: [],
                color: '#EBECF0'
            },
            {
                title: 'Done',
                Cards: [],
                color: '#EBECF0'
            },
        ]
    }

    else if (props.category === 'education') {
        List = [
            {
                title: 'Resources',
                Cards: [],
                color: '#EBECF0'
            },
            {
                title: 'Weekly Assignments',
                Cards: [],
                color: '#EBECF0'
            },
            {
                title: 'Lab Projects',
                Cards: [],
                color: '#EBECF0'
            },
            {
                title: 'Exams',
                Cards: [],
                color: '#EBECF0'
            }
        ]
    }

    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSetTitle = (e) => {
        setTitle(e.target.value);
    }

    const handleCreate = () => {
        setLoading(true);
        var background = {};
        background.type = 'image';
        background.value = props.templateURL;
        firebase.firestore().collection('boards').add({
            title: title,
            description: '',
            owner: props.currentUserEmail,
            participants: [props.currentUserEmail],
            chatId: null,
            list: List,
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
            <div className="create-tboard-overlay">
                <div className="create-tboard-container">
                    <div className="create-tboard-head">
                        <div className="create-tboard-title">
                            <div className="box">
                                <img src={props.templateURL} />
                                <input type="text" placeholder="Add board title" onChange={handleSetTitle} value={title} />
                            </div>
                        </div>
                    </div>
                    <div className="create-tboard-foot">
                        <button
                            type="button"
                            style={title.length > 0 ? { backgroundColor: '#5AAC44', color: '#fff' } : { backgroundColor: '#c5c5c5' }}
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
                        <button type="button" onClick={() => props.goBack()}>Cancel</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateTemplateBoard;
