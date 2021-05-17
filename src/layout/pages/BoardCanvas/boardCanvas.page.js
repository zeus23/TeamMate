import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/navbar.component';

import './boardCanvas.style.css';

import firebase from '../../../config/firebaseConfig';

import LoadingScreen from '../../components/LoadingScreen/loadingScreen.component';
import MiniNav from '../../components/MiniNav/miniNav.component';
import Column from '../../components/Column/column.component';

import { BiPlus } from 'react-icons/bi'
import { IoClose } from 'react-icons/io5'

const BoardCanvas = (props) => {

    const [currentUser, setCurrentUser] = useState(null);
    const [owner, setOwner] = useState(null);
    const [boardInfo, setBoardInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddList, setShowAddList] = React.useState(false);
    const [isFavourite, setIsFavourite] = React.useState(false);

    const [title, setTitle] = React.useState('');

    useEffect(() => {

        // Check for authentication
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                window.location.href = "/login"
            }
            else {
                firebase.firestore().collection('users').where('email', '==', user.email)
                    .onSnapshot((querySnapshot) => {
                        if (querySnapshot.size > 0) {
                            querySnapshot.forEach((documentSnapshot) => {
                                var user = documentSnapshot.data();
                                user.id = documentSnapshot.id;
                                // store user data
                                setCurrentUser(user);
                                documentSnapshot.data().boards.map((item) => {
                                    if (item.id === props.match.params.boardId && item.isFavourite) {
                                        setIsFavourite(true);
                                    }
                                })
                            })
                        }
                    })
            }
        })
    }, []);

    useEffect(() => {
        // get board data using id and store in state and change loading to false
        firebase.firestore().collection('boards').doc(props.match.params.boardId)
            .onSnapshot((doc) => {
                setBoardInfo(doc.data());

                firebase.firestore().collection('users').where('email', '==', doc.data().owner).get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((documentSnapshot) => {
                            setOwner(documentSnapshot.data().name);
                            setLoading(false);
                        })
                    })
            })

    }, []);

    const handleTitle = (e) => {
        setTitle(e.target.value);
    }

    const handleAddList = () => {
        setShowAddList(false);
        setTitle('');
        firebase.firestore().collection('boards').doc(props.match.params.boardId).get()
            .then((doc) => {
                var newList = doc.data().list;

                var listOb = {};
                listOb.title = title;
                listOb.color = '#EBECF0'
                listOb.Cards = [];
                newList.push(listOb);

                // storing back in database
                firebase.firestore().collection('boards').doc(props.match.params.boardId).update({
                    list: newList
                })
                    .then(() => {
                        console.log("Added");
                    })
                    .catch((error) => {
                        console.error(error);
                    })
            })
    }

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <>
            {
                boardInfo && boardInfo.background.type === 'image'
                    ?
                    <div className="canvas-container" style={{ backgroundImage: `url(${boardInfo.background.value})` }}>
                        <Navbar />
                        {
                            loading
                                ?
                                null
                                :
                                <MiniNav
                                    boardInfo={boardInfo}
                                    boardId={props.match.params.boardId}
                                    isFavourite={isFavourite}
                                    currentUser={currentUser}
                                    owner={owner}
                                />
                        }
                        <div className="canvas-boards">
                            <div className="column-container">
                                {
                                    boardInfo && boardInfo.list.map((item, index) => {
                                        return <Column key={index} position={index} column={item} boardId={props.match.params.boardId} />
                                    })
                                }
                                {
                                    boardInfo && boardInfo.list.length < 5
                                        ?
                                        <>
                                            {
                                                showAddList
                                                    ?
                                                    <div className="add-form" style={{ width: window.innerWidth * .2 }}>
                                                        <input placeholder="Enter a title for this List" type="text" value={title} onChange={handleTitle} />
                                                        <div>
                                                            <button type="button" onClick={handleAddList}>Add List</button>
                                                            <IoClose size={25} color="#616161" style={{ cursor: 'pointer' }} onClick={() => setShowAddList(false)} />
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className="add-list-btn" style={{ width: window.innerWidth * .2 }} onClick={() => setShowAddList(true)}>
                                                        <div className="add-list-head">
                                                            <BiPlus color="#fff" size={20} />
                                                            <p>Add another list</p>
                                                        </div>
                                                    </div>

                                            }
                                        </>
                                        :
                                        null
                                }
                            </div>
                        </div>
                    </div>
                    :
                    <div className="canvas-container" style={{ backgroundColor: boardInfo.background.value }}>
                        <Navbar />
                        {
                            loading
                                ?
                                null
                                :
                                <MiniNav
                                    boardInfo={boardInfo}
                                    boardId={props.match.params.boardId}
                                    isFavourite={isFavourite}
                                    currentUser={currentUser}
                                    owner={owner}
                                />
                        }
                        <div className="canvas-boards">
                            <div className="column-container">
                                {
                                    boardInfo && boardInfo.list.map((item, index) => {
                                        return <Column key={index} position={index} column={item} boardId={props.match.params.boardId} />
                                    })
                                }
                                {
                                    boardInfo && boardInfo.list.length < 5
                                        ?
                                        <>
                                            {
                                                showAddList
                                                    ?
                                                    <div className="add-form" style={{ width: window.innerWidth * .2 }}>
                                                        <input placeholder="Enter a title for this List" type="text" value={title} onChange={handleTitle} />
                                                        <div>
                                                            <button type="button" onClick={handleAddList}>Add List</button>
                                                            <IoClose size={25} color="#616161" style={{ cursor: 'pointer' }} onClick={() => setShowAddList(false)} />
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className="add-list-btn" style={{ width: window.innerWidth * .2 }} onClick={() => setShowAddList(true)}>
                                                        <div className="add-list-head">
                                                            <BiPlus color="#fff" size={20} />
                                                            <p>Add another list</p>
                                                        </div>
                                                    </div>

                                            }
                                        </>
                                        :
                                        null
                                }
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default BoardCanvas;
