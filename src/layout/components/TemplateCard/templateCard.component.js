import React, { useState } from 'react'
import CreateTemplateBoard from '../CreateTemplateBoard/createTemplateBoard.component';
import './templateCard.style.css';

const TemplateCard = (props) => {
    const template = props.template;
    const email = props.currentUserEmail;

    const [showModal, setShowModal] = useState(false);

    return (
        <div className="template-card">
            <div className="template-card-head" onClick={() => setShowModal(true)}>
                <img src={template.item.url} />
                <p>Click to use</p>
            </div>
            <div className="template-card-body">
                <h4>{template.title}</h4>
                <p>by {template.owner.name}</p>
                <p>{template.owner.email}</p>
            </div>

            {
                showModal
                    ?
                    <CreateTemplateBoard
                        goBack={() => setShowModal(false)}
                        currentUserEmail={email}
                        templateURL={template.item.url}
                        category={template.category.toLowerCase()}
                    />
                    :
                    null
            }
        </div>
    )
}

export default TemplateCard;
