import React from 'react'
import './column.style.css';

import { SketchPicker } from 'react-color';

import { GoKebabHorizontal } from 'react-icons/go'
import { BiPlus, BiPencil, BiCommentDetail } from 'react-icons/bi'
import { IoClose } from 'react-icons/io5'
import { BsClock, BsEye } from 'react-icons/bs';
import { MdDescription } from 'react-icons/md';

import firebase from '../../../config/firebaseConfig';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CardDetails from '../CardDetails/cardDetails.component';
import moment from 'moment';

const Column = (props) => {
    const columnData = props.column;
    const columnTitle = props.column.title;
    const boardId = props.boardId;
    const position = props.position;

    const [showInput, setShowInput] = React.useState(false);
    const [showListMenu, setShowListMenu] = React.useState(false);
    const [showColorPicker, setShowColorPicker] = React.useState(false);
    const [showDetailsModal, setShowDetailsModal] = React.useState(false);
    const [activeCard, setActiveCard] = React.useState(null);
    const [cardPosition, setCardPosition] = React.useState(null);

    const [color, setColor] = React.useState(props.column.color);
    const [title, setTitle] = React.useState('');

    const handleTitle = (e) => {
        setTitle(e.target.value);
    }

    const handleChangeComplete = (color) => {
        setColor(color.hex);
        setShowColorPicker(false);
        setShowListMenu(false);
        handleStoreColor(color.hex); //save color to database
    };

    const handleStoreColor = (value) => {
        firebase.firestore().collection('boards').doc(boardId).get()
            .then((doc) => {
                var newList = doc.data().list;
                newList[position].color = value;
                // Update the list
                firebase.firestore().collection('boards').doc(boardId).update({
                    list: newList
                })
                    .then(() => {
                        console.log("Color stored");
                    })
                    .catch((error) => {
                        console.error(error);
                    })
            })
    }

    const handleAddCard = () => {
        setShowInput(false);
        setTitle('');
        firebase.firestore().collection('boards').doc(boardId).get()
            .then((doc) => {
                var newList = doc.data().list;

                var newOb = newList[position];
                var cardOb = {};
                cardOb.title = title;
                cardOb.description = '';
                cardOb.comments = [];
                cardOb.due = {
                    date: '',
                    isCompleted: false
                };
                cardOb.view = 0;
                cardOb.checklist = {
                    items: [],
                    title: ''
                };
                cardOb.cover = '';
                newOb.Cards.push(cardOb);
                // replacing with new data
                newList.splice(position, 1, newOb);

                // storing back in database
                firebase.firestore().collection('boards').doc(boardId).update({
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

    const handleShowCardDetails = (cardInfo, position) => {
        setActiveCard(cardInfo);
        setCardPosition(position);
        setShowDetailsModal(true);
    }

    const handleDeleteColumn = () => {
        setShowListMenu(false);
        firebase.firestore().collection('boards').doc(boardId).get()
            .then((doc) => {
                var newList = doc.data().list;

                var newOb = newList[position];

                newList = newList.filter((item) => item !== newOb);

                console.log(newList);

                // storing back in database
                firebase.firestore().collection('boards').doc(boardId).update({
                    list: newList
                })
                    .then(() => {
                        console.log("Deleted");
                    })
                    .catch((error) => {
                        console.error(error);
                    })
            })
    }

    return (
        <>
            <ToastContainer />
            <div className="column-wrapper" style={{ width: window.innerWidth * .2, height: props.column.Cards.length === 0 ? '100px' : null }}>
                <div className="column-head" style={{ background: `${color}` }}>
                    <h5>{columnData.title}</h5>
                    <GoKebabHorizontal color="#616161" onClick={() => setShowListMenu(!showListMenu)} />
                </div>

                {/* Display all the cards */}
                <div className="column-body">

                    {
                        columnData && columnData.Cards.length > 0
                            ?
                            <>
                                {
                                    columnData.Cards.map((card, index) => {
                                        return (
                                            <div
                                                className="card-div"
                                                onClick={() => handleShowCardDetails(card, index)}
                                            >
                                                {
                                                    card.cover !== ''
                                                        ?
                                                        <div className="card-cover" style={{ backgroundColor: card.cover }}></div>
                                                        :
                                                        null
                                                }
                                                <div className="card-info">
                                                    <p>{card.title}</p>
                                                    <span><BiPencil color="#616161" /></span>
                                                </div>
                                                {
                                                    card.view > 0
                                                        ?
                                                        <div style={{ width: '100%', padding: '0 0.5rem', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                                            <>
                                                                <BsEye size={15} color="#616161" style={{ marginRight: '5px' }} />
                                                                <p style={{ marginRight: '10px', fontSize: '12px', color: '#616161' }}>{card.view}</p>
                                                            </>
                                                            {
                                                                card.description !== ''
                                                                    ?
                                                                    <MdDescription size={15} color="#616161" style={{ marginRight: '10px' }} />
                                                                    :
                                                                    null
                                                            }
                                                            {
                                                                card.due.date
                                                                    ?
                                                                    <>
                                                                        <BsClock size={15} color="#616161" style={{ marginRight: '5px' }} />
                                                                        {
                                                                            card.due.isCompleted
                                                                                ?
                                                                                <p style={{ marginRight: '10px', fontSize: '12px', color: 'green' }}>{moment(card.due.date.seconds * 1000).format('LL')}</p>
                                                                                :
                                                                                <p style={{ marginRight: '10px', fontSize: '12px', color: '#616161' }}>{moment(card.due.date.seconds * 1000).format('LL')}</p>
                                                                        }
                                                                    </>
                                                                    :
                                                                    null
                                                            }
                                                            {
                                                                card.comments.length > 0
                                                                    ?
                                                                    <>
                                                                        <BiCommentDetail size={15} color="#616161" style={{ marginRight: '5px' }} />
                                                                        <p style={{ marginRight: '10px', fontSize: '12px', color: '#616161' }}>{card.comments.length}</p>
                                                                    </>
                                                                    :
                                                                    null
                                                            }
                                                        </div>
                                                        :
                                                        null
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </>
                            :
                            null
                    }
                </div>

                <div className="column-footer">
                    {/* Adding new card */}
                    {
                        showInput
                            ?
                            <div className="add-form">
                                <input placeholder="Enter a title for this card" type="text" value={title} onChange={handleTitle} />
                                <div>
                                    <button type="button" onClick={handleAddCard}>Add Card</button>
                                    <IoClose size={25} color="#616161" style={{ cursor: 'pointer' }} onClick={() => setShowInput(false)} />
                                </div>
                            </div>
                            :
                            <button type="button" className="add-card" onClick={() => setShowInput(true)}>
                                <BiPlus color="#616161" />
                            Add new card
                        </button>
                    }
                </div>

                {/* Column menu modal */}
                {
                    showListMenu
                        ?
                        <div className="menu-wrapper">
                            <div className="menu-head">
                                <p>List actions</p>
                                <IoClose color="#616161" style={{ cursor: 'pointer' }} onClick={() => setShowListMenu(false)} />
                            </div>
                            <div className="menu-body">
                                <div className="menu-list" onClick={() => setShowColorPicker(true)}>
                                    <p>Change header color</p>
                                </div>
                                <div className="menu-list" onClick={() => { setShowListMenu(false); setShowInput(true) }}>
                                    <p>Add Card</p>
                                </div>
                                <div className="menu-list" onClick={handleDeleteColumn}>
                                    <p>Delete list</p>
                                </div>
                                {
                                    showColorPicker
                                        ?
                                        <div className="menu-list">
                                            <SketchPicker color={color} onChangeComplete={handleChangeComplete} />
                                        </div>
                                        :
                                        null
                                }
                            </div>
                        </div>
                        :
                        null
                }

            </div>
            {/* Call card details */}
            {
                showDetailsModal
                    ?
                    <CardDetails
                        card={activeCard}
                        cardPosition={cardPosition}
                        boardId={boardId}
                        columnPosition={position}
                        columnTitle={columnTitle}
                        goBack={() => setShowDetailsModal(false)}
                    />
                    :
                    null
            }
        </>
    )
}

export default Column
