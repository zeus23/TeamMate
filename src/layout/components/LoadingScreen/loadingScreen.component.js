import React from 'react'

import './loadingScreen.style.css';

import Lottie from 'lottie-react-web'

import loadingAnimation from '../../assets/lottie/loading.json';

const LoadingScreen = () => {
    return (
        <div className="loading-container">
            <Lottie
                options={{
                    animationData: loadingAnimation
                }}
                width={200}
                height={200}
            />
        </div>
    )
}

export default LoadingScreen;