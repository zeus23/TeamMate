import React from 'react'
import './App.css';

import { BrowserRouter, Route } from "react-router-dom";

import LandingPage from './layout/pages/LandingPage/landingPage.page'
import HomePage from './layout/pages/HomePage/homePage.page';
import LoginPage from './layout/pages/Login/loginPage.page';
import SignupPage from './layout/pages/Signup/signupPage.page';
import TemplatePage from './layout/pages/TemplatePage/templatePage.page';
import BoardPage from './layout/pages/BoardPage/boardPage.page';
import BoardCanvas from './layout/pages/BoardCanvas/boardCanvas.page';

const App = () => {
	return (
		<div className="App">
			<BrowserRouter>
				<Route exact path='/' component={LandingPage} />
				<Route exact path='/login' component={LoginPage} />
				<Route exact path="/signup" component={SignupPage} />
				<Route exact path="/home" component={HomePage} />
				<Route exact path="/templates" component={TemplatePage} />
				<Route exact path="/:email/boards" component={BoardPage} />
				<Route exact path="/board/:boardId" component={BoardCanvas} />
			</BrowserRouter>
		</div>
	)
}

export default App;