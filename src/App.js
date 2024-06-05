import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams,
} from "react-router-dom";
import Profile from "./Components/Profile";
import StudyGroup from "./Components/StudyGroup";
import MyStudyGroups from "./Components/MyStudyGroups";
import Home from "./Components/Home";
import ViewProfile from "./Components/ViewProfile";
import UserList from "./Components/UserList";
import "./styles/App.css";

const Navigation = () => {
  const { userId } = useParams();
  return (
    <nav>
      <ul>
        <li>
          <Link to={`/profile/${userId}`}>Profile</Link>
        </li>
        <li>
          <Link to={`/users/${userId}`}>User Profiles</Link>
        </li>
        <li>
          <Link to={`/my-study-groups/${userId}`}>My Study Groups</Link>
        </li>
        <li>
          <Link to={`/study-group/${userId}`}>Study Groups</Link>
        </li>
      </ul>
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <div className="app">
        <header>
          <h1>Study Management App</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/profile/:userId"
              element={
                <>
                  <Navigation />
                  <Profile />
                </>
              }
            />
            <Route
              path="/study-group/:userId/*"
              element={
                <>
                  <Navigation />
                  <StudyGroup />
                </>
              }
            />
            <Route
              path="/my-study-groups/:userId"
              element={
                <>
                  <Navigation />
                  <MyStudyGroups />
                </>
              }
            />
            <Route
              path="/profile/:userId/view/:viewUserId"
              element={
                <>
                  <Navigation />
                  <ViewProfile />
                </>
              }
            />
            <Route
              path="/users/:userId"
              element={
                <>
                  <Navigation />
                  <UserList />
                </>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
