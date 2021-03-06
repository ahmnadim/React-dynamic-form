import './App.css';
import { useEffect } from 'react';
import { Link, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Form from './pages/form';
import List from './pages/list';
import Update from './pages/update';

function App() {
	return (
		<div className='container'>
			<Router>
				<div className='header'>
					<nav className='navbar navbar-expand-lg navbar-light bg-light'>
						<span className='navbar-brand' >
							XpeedStudio
						</span>
						<button
							className='navbar-toggler'
							type='button'
							data-toggle='collapse'
							data-target='#navbarNav'
							aria-controls='navbarNav'
							aria-expanded='false'
							aria-label='Toggle navigation'
						>
							<span className='navbar-toggler-icon'></span>
						</button>
						<div className='collapse navbar-collapse' id='navbarNav'>
							<ul className='navbar-nav'>
								<li className='nav-item active'>
									<Link to={'/list'} className='nav-link' >
										List 
									</Link>
								</li>
								<li className='nav-item'>
									<Link to={'/form'} className='nav-link' >
										Form
									</Link>
								</li>
								{/* <li className='nav-item'>
									<Link to={'/update'} className='nav-link' >
										Update
									</Link>
								</li> */}
							
							</ul>
						</div>
					</nav>
				</div>
				<Routes>
					<Route path='/form' element={<Form />}></Route>
					<Route path='/list' element={<List />}></Route>
					<Route path='/update/:id' element={<Update />}></Route>
					<Route path='/' element={<h1>Home page</h1>}></Route>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
