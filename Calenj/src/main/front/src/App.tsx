import React from 'react';
import Home from './Home';
import SignUp from './components/Auth/Sign_up';
import Sign from './components/Auth/Sign';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import GroupDetail from "./components/Group/GroupDetail";
import Chatting from "./Test/Chatting";
import NoticeDetail from './Test/NoticeDetail';
// import GroupList from "./components/Group/GroupList";

const App: React.FC = () => {

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<Home/>}/>
                    <Route path={"/signup"} element={<SignUp/>}/>
                    <Route path={"/sign"} element={<Sign/>}/>
                    <Route path={"/details"} element={<GroupDetail/>}/>
                    <Route path={"/chat"} element={<Chatting/>}/>
                    <Route path={"/notice/detail"} element={<NoticeDetail/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
export default App;

