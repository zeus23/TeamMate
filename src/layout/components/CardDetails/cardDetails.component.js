import React from 'react'

import './cardDetails.style.css';

import { IoCard, IoClose } from 'react-icons/io5'
import { MdDescription, MdVideoLabel } from 'react-icons/md';
import { BiCommentDetail } from 'react-icons/bi';
import { BsCheckBox, BsClockHistory } from 'react-icons/bs';
import { RiDeleteBin6Line } from 'react-icons/ri'
import { FiCheckSquare } from 'react-icons/fi';

import { SketchPicker } from 'react-color';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import firebase from '../../../config/firebaseConfig';
import moment from 'moment';
import CommentCard from '../CommentCard/commentCard.component';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CardDetails = (props) => {
    var { card, cardPosition, boardId, columnPosition } = props;
    const [comments, setComments] = React.useState(card.comments);
    const [checklist, setChecklist] = React.useState(card.checklist);
    const [showSaveBtn, setShowSaveBtn] = React.useState(false);
    const [description, setDescription] = React.useState(card.description);

    const [comment, setComment] = React.useState('');
    const [showCommentSave, setShowCommentSave] = React.useState(false);

    const [color, setColor] = React.useState(card.cover);
    const [showColorPicker, setShowColorPicker] = React.useState(false);

    const [showDatepicker, setShowDatePicker] = React.useState(false);
    const [date, setDate] = React.useState(card.due.date ? card.due.date.seconds * 1000 : null);

    const [checked, setChecked] = React.useState(card.due.isCompleted);

    const [showAddChecklist, setShowAddChecklist] = React.useState(false);
    const [checklistTitle, setChecklistTitle] = React.useState('');

    const [showAddItem, setShowAddItem] = React.useState(false);
    const [checklistItem, setChecklistItem] = React.useState('');

    React.useEffect(() => {
        firebase.firestore().collection('boards').doc(boardId).get()
            .then((doc) => {
                var newList = doc.data().list;
                var view = newList[columnPosition].Cards[cardPosition].view;
                newList[columnPosition].Cards[cardPosition].view = view + 1;

                firebase.firestore().collection('boards').doc(boardId).update({
                    list: newList
                })
                    .then(() => {
                        console.log("Saved")
                    })
                    .catch((error) => {
                        console.error(error);
                    })
            })
    }, [card.view])

    const handleDescription = (e) => {
        setDescription(e.target.value);
    }

    const handleStoreDescription = () => {
        setShowSaveBtn(false);
        firebase.firestore().collection('boards').doc(boardId).get()
            .then((doc) => {
                var newList = doc.data().list;
                newList[columnPosition].Cards[cardPosition].description = description;

                firebase.firestore().collection('boards').doc(boardId).update({
                    list: newList
                })
                    .then(() => {
                        console.log("Saved")

                    })
                    .catch((error) => {
                        console.error(error);
                    })
            })
    }

    const handleComment = (e) => {
        setComment(e.target.value);
    }

    const handleStoreComment = () => {
        setShowCommentSave(false);
        var commentOb = {};
        commentOb.comment = comment;
        commentOb.time = new Date();

        commentOb.owner = firebase.auth().currentUser.email;
        var oldComments = comments;
        oldComments.push(commentOb);
        setComments(oldComments);

        firebase.firestore().collection('boards').doc(boardId).get()
            .then((doc) => {
                var newList = doc.data().list;
                var newComments = newList[columnPosition].Cards[cardPosition].comments;

                newComments.push(commentOb);
                newList[columnPosition].Cards[cardPosition].comments = newComments;
                firebase.firestore().collection('boards').doc(boardId).update({
                    list: newList
                })
                    .then(() => {
                        console.log("Saved")
                        setComment('');
                    })
                    .catch((error) => {
                        console.error(error);
                        setComment('');
                    })
            })
    }

    const handleDeleteComment = (commentPosition) => {
        var oldComments = comments;
        oldComments.splice(commentPosition, 1);
        setComments(oldComments);
        firebase.firestore().collection('boards').doc(boardId).get()
            .then((doc) => {
                var newList = doc.data().list;
                var newComments = newList[columnPosition].Cards[cardPosition].comments;
                newComments.splice(commentPosition, 1);
                newList[columnPosition].Cards[cardPosition].comments = newComments;
                firebase.firestore().collection('boards').doc(boardId).update({
                    list: newList
                })
                    .then(() => {
                        // props.goBack();
                        console.log("Deleted")
                    })
                    .catch((error) => {
                        // props.goBack();
                        console.error(error);
                    })
            })
    }


    const handleChangeComplete = (color) => {
        setColor(color.hex);
        setShowColorPicker(false);
        handleStoreColor(color.hex); //save color to database
    };

    const handleStoreColor = (value) => {
        firebase.firestore().collection('boards').doc(boardId).get()
            .then((doc) => {
                var newList = doc.data().list;
                newList[columnPosition].Cards[cardPosition].cover = value;
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

    const handleRemoveColor = () => {
        setColor('');
        firebase.firestore().collection('boards').doc(boardId).get()
            .then((doc) => {
                var newList = doc.data().list;
                newList[columnPosition].Cards[cardPosition].cover = '';
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

    const handleDate = (e) => {
        setDate(e);
        handleStoreDate(e);
    }

    const handleDeleteCard = () => {
        firebase.firestore().collection('boards').doc(boardId).get()
            .then((doc) => {
                var newList = doc.data().list;

                newList[columnPosition].Cards.splice(cardPosition, 1);
                // Update the list
                firebase.firestore().collection('boards').doc(boardId).update({
                    list: newList
                })
                    .then(() => {
                        props.goBack()
                        console.log("Color stored");
                    })
                    .catch((error) => {
                        console.error(error);
                    })
            })
    }

    const handleStoreDate = (value) => {
        firebase.firestore().collection('boards').doc(boardId).get()
            .then((doc) => {
                var newList = doc.data().list;
                newList[columnPosition].Cards[cardPosition].due.date = value;
                newList[columnPosition].Cards[cardPosition].due.isCompleted = false;
                // Update the list
                firebase.firestore().collection('boards').doc(boardId).update({
                    list: newList
                })
                    .then(() => {
                        console.log("due date stored");
                    })
                    .catch((error) => {
                        console.error(error);
                    })
            })
    }

    const handleCompleteDueDate = () => {
        setChecked(!checked);
        firebase.firestore().collection('boards').doc(boardId).get()
            .then((doc) => {
                var newList = doc.data().list;
                var res = newList[columnPosition].Cards[cardPosition].due.isCompleted;
                newList[columnPosition].Cards[cardPosition].due.isCompleted = !res;
                // Update the list
                firebase.firestore().collection('boards').doc(boardId).update({
                    list: newList
                })
                    .then(() => {
                        console.log("due date stored");
                    })
                    .catch((error) => {
                        console.error(error);
                    })
            })
    }

    const handleChecklistTitle = (e) => {
        setChecklistTitle(e.target.value);
    }

    const handleCreateChecklist = () => {

        if (checklistTitle === '') {
            toast.error('Please provide a title');
        }
        else {
            var oldChecklist = checklist;
            oldChecklist.title = checklistTitle;
            setChecklist(oldChecklist);

            setShowAddChecklist(false);
            firebase.firestore().collection('boards').doc(boardId).get()
                .then((doc) => {
                    var newList = doc.data().list;
                    var newcheckList = newList[columnPosition].Cards[cardPosition].checklist;
                    newcheckList.title = checklistTitle;

                    newList[columnPosition].Cards[cardPosition].checklist = newcheckList;
                    // Update the list
                    firebase.firestore().collection('boards').doc(boardId).update({
                        list: newList
                    })
                        .then(() => {
                            setChecklistTitle('');
                            console.log("checklist created");
                        })
                        .catch((error) => {
                            setChecklistTitle('');
                            console.error(error);
                        })
                })
        }
    }

    const handleChecklistItem = (e) => {
        setChecklistItem(e.target.value);
    }

    const handleSaveChecklistItem = () => {
        setShowAddItem(false);
        var itemOb = {};
        itemOb.title = checklistItem;
        itemOb.isDone = false;

        var oldChecklist = checklist;
        oldChecklist.items.push(itemOb);
        setChecklist(oldChecklist);

        firebase.firestore().collection('boards').doc(boardId).get()
            .then((doc) => {
                var newList = doc.data().list;
                var newcheckList = newList[columnPosition].Cards[cardPosition].checklist;
                newcheckList.items.push(itemOb);

                newList[columnPosition].Cards[cardPosition].checklist = newcheckList;

                firebase.firestore().collection('boards').doc(boardId).update({
                    list: newList
                })
                    .then(() => {
                        console.log("Saved")
                        setChecklistItem('');
                    })
                    .catch((error) => {
                        console.error(error);
                        setChecklistItem('');
                    })

            })
    }

    const handleCompleteChecklist = (position) => {
        var oldchecklist = checklist;
        oldchecklist.items[position].isDone = !oldchecklist.items[position].isDone;
        setChecklist(oldchecklist);

        firebase.firestore().collection('boards').doc(boardId).get()
            .then((doc) => {
                var newList = doc.data().list;
                var newcheckList = newList[columnPosition].Cards[cardPosition].checklist;
                newcheckList.items[position].isDone = !newcheckList.items[position].isDone;

                newList[columnPosition].Cards[cardPosition].checklist = newcheckList;

                firebase.firestore().collection('boards').doc(boardId).update({
                    list: newList
                })
                    .then(() => {
                        console.log("Saved")
                        setChecklistItem('');
                    })
                    .catch((error) => {
                        console.error(error);
                        setChecklistItem('');
                    })

            })
    }

    return (
        <>
            <ToastContainer />
            <div className="carddetails-overlay">
                <div className="carddetails-wrapper">
                    {
                        color !== ''
                            ?
                            <div className="cover" style={{ backgroundColor: color }}>
                                <button type="button" onClick={handleRemoveColor}>Remove cover</button>
                            </div>
                            :
                            null
                    }
                    <div className="carddetails-head">
                        <div>
                            <IoCard size={20} color="#172b4d" />
                            <p>{card.title}</p>
                            <p className="column-name">In list {props.columnTitle}</p>
                        </div>
                        <span onClick={() => props.goBack()}><IoClose size={20} color="#172b4d" /></span>
                    </div>

                    <div className="carddetails-body">
                        <div className="carddetails-left">
                            {
                                date
                                    ?
                                    <div className="carddetails-due">
                                        <p>DUE DATE</p>
                                        <div className="due-check">
                                            <input type="checkbox" checked={checked} onClick={handleCompleteDueDate} />
                                            <p>{moment(date).fromNow()} &nbsp; {moment(date).format('LL')} &nbsp;
                                            {
                                                    checked
                                                        ?
                                                        <span style={{ backgroundColor: 'green', color: '#fff' }}>COMPLETED</span>
                                                        :
                                                        <span style={{ backgroundColor: '#EBEB00' }}>PENDING</span>
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    :
                                    null
                            }
                            <div className="carddetails-description">
                                <div className="carddetails-desc-head">
                                    <MdDescription size={20} color="#172b4d" />
                                    <p>Description</p>
                                </div>
                                <div className="carddetails-desc-body">
                                    <textarea
                                        placeholder="Add a more detailed description"
                                        onClick={() => setShowSaveBtn(true)}
                                        onChange={handleDescription}
                                        value={description}
                                    />
                                    {
                                        showSaveBtn
                                            ?
                                            <div>
                                                <button type="button" onClick={handleStoreDescription}>Save</button>
                                                <span onClick={() => setShowSaveBtn(false)}><IoClose size={30} color="#172b4d" /></span>
                                            </div>
                                            :
                                            null
                                    }
                                </div>
                            </div>

                            {/* Checklist */}
                            {
                                checklist.title === ''
                                    ?
                                    null
                                    :
                                    <div className="carddetails-description">
                                        <div className="carddetails-desc-head">
                                            <FiCheckSquare size={20} color="#172b4d" />
                                            <p>{checklist.title}</p>
                                        </div>
                                        <div className="carddetails-desc-body">
                                            {
                                                checklist.items.map((x, index) => {
                                                    return (
                                                        <div className="item">
                                                            <input type="checkbox" checked={x.isDone} onClick={() => handleCompleteChecklist(index)} />
                                                            <p style={{ textDecoration: x.isDone ? 'line-through' : null }}>{x.title}</p>
                                                        </div>

                                                    );
                                                })
                                            }
                                        </div>
                                        {
                                            showAddItem
                                                ?
                                                <div className="carddetails-desc-btn">
                                                    <input type="text" placeholder="Enter a checklist item" onChange={handleChecklistItem} value={checklistItem} />
                                                    <div>
                                                        <button type="button" onClick={handleSaveChecklistItem}>Save</button>
                                                        <span onClick={() => setShowAddItem(false)}><IoClose size={30} color="#172b4d" /></span>
                                                    </div>
                                                </div>
                                                :
                                                <div className="carddetails-desc-btn">
                                                    <button type="button" onClick={() => setShowAddItem(true)}>Add an item</button>
                                                </div>
                                        }
                                    </div>
                            }

                            <div className="carddetails-comments">
                                <div className="comment-head">
                                    <BiCommentDetail size={20} color="#172b4d" />
                                    <p>Comments</p>
                                </div>
                                <div className="comment-body">
                                    <input placeholder="Write a comment" value={comment} onChange={handleComment} onClick={() => setShowCommentSave(true)} />
                                    {
                                        showCommentSave
                                            ?
                                            <div className="cmt-btn">
                                                <button type="button" onClick={handleStoreComment}>Save</button>
                                                <span onClick={() => setShowCommentSave(false)}><IoClose size={30} color="#172b4d" /></span>
                                            </div>
                                            :
                                            null
                                    }

                                    {/* Display comments list */}
                                    {
                                        comments.length > 0
                                            ?
                                            <div className="comment-list">
                                                {
                                                    comments.map((comment, index) => {
                                                        return <CommentCard
                                                            comment={comment}
                                                            commentPosition={index}
                                                            deleteComment={(cardPosition) => handleDeleteComment(cardPosition)}
                                                        />
                                                    })
                                                }
                                            </div>
                                            :
                                            null
                                    }

                                </div>
                            </div>
                        </div>
                        <div className="carddetails-right">
                            <div className="menu1">
                                <p>ADD TO CARD</p>
                                {
                                    checklist.title === '' && checklist.items.length === 0
                                        ?
                                        <div className="menu-box" onClick={() => setShowAddChecklist(true)}>
                                            <BsCheckBox />
                                            <p>Checklist</p>
                                        </div>
                                        :
                                        null
                                }
                                {/* Add checklist modal */}
                                {
                                    showAddChecklist
                                        ?
                                        <div className="checklist-modal">
                                            <div className="checklist-modal-head">
                                                <p>Add checklist</p>
                                                <span onClick={() => setShowAddChecklist(false)}><IoClose color="#172b4d" /></span>
                                            </div>
                                            <div className="checklist-modal-body">
                                                <input placeholder="Enter title" value={checklistTitle} onChange={handleChecklistTitle} />
                                                <button type="button" onClick={handleCreateChecklist}>Add</button>
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                                <div className="menu-box" onClick={() => setShowDatePicker(true)}>
                                    <BsClockHistory />
                                    <p>Due Date</p>
                                </div>
                                {/* Show date and time picker */}
                                {
                                    showDatepicker
                                        ?
                                        <div className="date-modal">
                                            <div className="date-modal-head">
                                                <p>Change due date</p>
                                                <span onClick={() => setShowDatePicker(false)}><IoClose color="#172b4d" /></span>
                                            </div>
                                            <Calendar
                                                onChange={handleDate}
                                                value={new Date(date)}
                                            />
                                        </div>
                                        :
                                        null
                                }
                                <div className="menu-box" onClick={() => setShowColorPicker(!showColorPicker)}>
                                    <MdVideoLabel />
                                    <p>Cover</p>
                                </div>


                                {/* show color picker */}
                                {
                                    showColorPicker
                                        ?
                                        <SketchPicker color={color} onChangeComplete={handleChangeComplete} />
                                        :
                                        null
                                }
                            </div>
                            <div className="menu1">
                                <p>ACTIONS</p>
                                <div className="menu-box" onClick={handleDeleteCard}>
                                    <RiDeleteBin6Line />
                                    <p>Delete</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default CardDetails;
