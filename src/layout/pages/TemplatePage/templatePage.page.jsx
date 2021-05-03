import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/navbar.component';

import './templatePage.style.css';

import firebase from '../../../config/firebaseConfig';

import LoadingScreen from '../../components/LoadingScreen/loadingScreen.component';
import Sidebar from '../../components/Sidebar/sidebar.component';

import business from '../../assets/business.svg'
import design from '../../assets/design.svg'
import engineering from '../../assets/engineering.svg'
import education from '../../assets/education.svg'
import project from '../../assets/project.svg'
import marketing from '../../assets/marketing.svg'
import remote from '../../assets/remote-work.svg'
import popular from '../../assets/popular.svg';
import TemplateCard from '../../components/TemplateCard/templateCard.component';

const TemplatePage = (props) => {

    const [currentUser, setCurrentUser] = useState(null);
    const [templatesArray, setTemplatesArray] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                window.location.href = "/login"
            }
            else {
                setCurrentUser(user);
                var array = [];
                firebase.firestore().collection('templates').get()
                    .then((querySnapshot) => {
                        if (querySnapshot.size > 0) {
                            querySnapshot.forEach((documentSnapshot) => {
                                array.push(documentSnapshot.data());
                            })
                        }
                        setTemplatesArray(array);
                        setLoading(false);
                    })

            }
        })
    }, []);

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <div className="template-container">
            <Navbar />
            <div className="template-boards">
                <div className="template-sidebar">
                    <Sidebar page={props.location.pathname} currentUserEmail={currentUser.email} />
                </div>
                <div className="template-body">
                    <div className="template-section">
                        <div className="section-header">
                            <p>Featured Categories</p>
                        </div>
                        <div className="section-body">
                            <div className="category-box">
                                <img src={business} />
                                <p>Business</p>
                            </div>
                            <div className="category-box">
                                <img src={design} />
                                <p>Design</p>
                            </div>
                            <div className="category-box">
                                <img src={engineering} />
                                <p>Engineering</p>
                            </div>
                            <div className="category-box">
                                <img src={education} />
                                <p>Education</p>
                            </div>
                            <div className="category-box">
                                <img src={marketing} />
                                <p>Marketing</p>
                            </div>
                            <div className="category-box">
                                <img src={project} />
                                <p>Management</p>
                            </div>
                            <div className="category-box">
                                <img src={remote} />
                                <p>Remote Work</p>
                            </div>
                        </div>
                    </div>

                    <div className="template-section">
                        <div className="section-header">
                            <img src={popular} />
                            <p>New and popular templates</p>
                        </div>
                        <div className="section-body">
                            {
                                templatesArray && templatesArray.length > 0
                                    ?
                                    <>
                                        {
                                            templatesArray.map((item) => {
                                                return <TemplateCard template={item} currentUserEmail={currentUser.email} />
                                            })
                                        }
                                    </>
                                    :
                                    null
                            }
                        </div>
                    </div>

                    <div className="template-section">
                        <div className="section-header">
                            <img src={popular} />
                            <p>Business</p>
                        </div>
                        <div className="section-body">
                            {
                                templatesArray && templatesArray.length > 0
                                    ?
                                    <>
                                        {
                                            templatesArray.map((item) => {
                                                if (item.category === 'Business') {
                                                    return <TemplateCard
                                                        template={item}
                                                        currentUserEmail={currentUser.email}
                                                    />
                                                }
                                            })
                                        }
                                    </>
                                    :
                                    null
                            }
                        </div>
                    </div>

                    <div className="template-section">
                        <div className="section-header">
                            <img src={popular} />
                            <p>Design</p>
                        </div>
                        <div className="section-body">
                            {
                                templatesArray && templatesArray.length > 0
                                    ?
                                    <>
                                        {
                                            templatesArray.map((item) => {
                                                if (item.category === 'Design') {
                                                    return <TemplateCard template={item} currentUserEmail={currentUser.email} />
                                                }
                                            })
                                        }
                                    </>
                                    :
                                    null
                            }
                        </div>
                    </div>


                    <div className="template-section">
                        <div className="section-header">
                            <img src={popular} />
                            <p>Engineering</p>
                        </div>
                        <div className="section-body">
                            {
                                templatesArray && templatesArray.length > 0
                                    ?
                                    <>
                                        {
                                            templatesArray.map((item) => {
                                                if (item.category === 'Engineering') {
                                                    return <TemplateCard template={item} currentUserEmail={currentUser.email} />
                                                }
                                            })
                                        }
                                    </>
                                    :
                                    null
                            }
                        </div>
                    </div>

                    <div className="template-section">
                        <div className="section-header">
                            <img src={popular} />
                            <p>Education</p>
                        </div>
                        <div className="section-body">
                            {
                                templatesArray && templatesArray.length > 0
                                    ?
                                    <>
                                        {
                                            templatesArray.map((item) => {
                                                if (item.category === 'Education') {
                                                    return <TemplateCard template={item} currentUserEmail={currentUser.email} />
                                                }
                                            })
                                        }
                                    </>
                                    :
                                    null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TemplatePage;
