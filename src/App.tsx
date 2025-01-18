import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import SearchBox from './components/SearchBox';
import PetitionList from './components/Petitions';
import Register from "./components/Register";
import NavigationBar from "./components/NavigationBar";
// import PetitionDetails from './components/PetitionDetails';
// import UserProfile from './components/UserProfile';
// import Register from './components/Register';
import Login from './components/Login';
import Petition from "./components/Petition";
import CreatePetition from './components/CreatePetition';
import Profile from "./components/Profile";
// import EditProfile from "./components/EditProfile";
// import EditPetition from './components/EditPetition';
// import NotFound from './components/NotFound';

function App() {
    return (
        <div className="App">
            <Router>
                <div>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/petitions" element={<PetitionList />} />
                        <Route path="/petition/:id" element={<Petition/>} />
                        <Route path="/profile" element={<Profile />} />
                        {/*<Route path="/editprofile" element={<EditProfile />} />*/}
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        {/*<Route path="/petition/create" element={<CreatePetition />} />*/}
                        {/*<Route path="/petition/:id/edit" element={<EditPetition />} />*/}
                        {/*<Route path="*" element={<NotFound />} />*/}
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default App;
