import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from './components/Body';
import Chat from "./components/Chat";
import Connections from "./components/Connections";
import Feed from './components/Feed';
import Login from "./components/Login";
import Profile from "./components/Profile";
import Requests from "./components/Requests";
import appStore from "./utils/appStore";



function App() {
  return (
    <>
    <Provider store = {appStore}>
    <BrowserRouter basename="/">
    <Routes>
      <Route path ="/" element = {<Body/>}>
          <Route path ="/" element = {<Feed/>}/>
          <Route path ="/login" element = {<Login/>}/>
          <Route path ="/profile" element = {<Profile/>}/>
          <Route path ="/connections" element = {<Connections/>}/>
          <Route path ="/requests" element = {<Requests/>}/>
          <Route path ="/chat/:targetUserId" element = {<Chat/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
    </Provider>
      </>
  );
}
export default App;