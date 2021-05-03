import React from 'react'
import './commentCard.style.css';

import firebase from '../../../config/firebaseConfig';
import moment from 'moment';

const CommentCard = (props) => {
    var { commentPosition } = props;
    const [loading, setLoading] = React.useState(true);
    const [name, setName] = React.useState('');

    React.useEffect(() => {
        firebase.firestore().collection('users').where('email', '==', props.comment.owner).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setName(doc.data().name)
                    setLoading(false);
                })
            })
    })

    return (
        <>
            {
                loading
                    ?
                    null
                    :
                    <div className="comment-container">
                        <div className="cmt-head">
                            <p>{name}</p>
                            <span>{moment(props.comment.time.seconds * 1000).fromNow()}</span>
                        </div>
                        <div className="cmt-body">
                            <div>
                                <p>{props.comment.comment}</p>
                            </div>
                        </div>
                        {
                            props.comment.owner === firebase.auth().currentUser.email
                                ?
                                <div className="cmt-foot">
                                    <p onClick={() => props.deleteComment(commentPosition)}>Delete</p>
                                </div>
                                :
                                null
                        }
                    </div>
            }
        </>
    )
}

export default CommentCard;
