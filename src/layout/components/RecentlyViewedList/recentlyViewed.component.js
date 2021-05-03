import React from 'react';

import './recentlyViewed.style.css'

import { FiClock } from 'react-icons/fi';
import { AiOutlineStar } from 'react-icons/ai'

import bg1 from '../../assets/shutterstock_152461202_thumb.jpg'
import bg2 from '../../assets/shutterstock_574261726_thumb.jpg'

const RecentlyViewed = () => {
    return (
        <div className="recently-viewed-container">
            <div className="recently-header">
                <FiClock color="#616161" />
                <p>RECENTLY VIEWED</p>
            </div>
            <div className="recently-body">
                <div className="recent-li">
                    <div>
                        <img src={bg1} />
                        <div className="recent-name">
                            <h4>Zohaib Kibria</h4>
                            <p>Project Title One</p>
                        </div>
                    </div>
                    <p className="star"><AiOutlineStar color="#616161" /></p>
                </div>
                <div className="recent-li">
                    <div>
                        <img src={bg2} />
                        <div className="recent-name">
                            <h4>Saahil Shaikh</h4>
                            <p>Project Title Two</p>
                        </div>
                    </div>
                    <p className="star"><AiOutlineStar color="#616161" /></p>
                </div>
            </div>
        </div>
    )
}

export default RecentlyViewed;
