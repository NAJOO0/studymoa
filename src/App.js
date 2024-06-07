import React, { useState, useEffect } from "react";
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
import StudyHome from "./Components/StudyHome";
import GoalList from "./Components/GoalList";
import GoalDetail from "./Components/GoalDetail";
import SetGoals from "./Components/SetGoals";
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
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const storedGroups = localStorage.getItem("studyGroups");
    if (storedGroups) {
      setGroups(JSON.parse(storedGroups));
    }
  }, []);

  useEffect(() => {
    if (groups.length > 0)
      localStorage.setItem("studyGroups", JSON.stringify(groups));
  }, [groups]);

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
                  <StudyGroup groups={groups} setGroups={setGroups} />
                </>
              }
            />
            <Route
              path="/my-study-groups/:userId"
              element={
                <>
                  <Navigation />
                  <MyStudyGroups groups={groups} setGroups={setGroups} />
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
            <Route
              path="/study-home/:userId/:groupId"
              element={<StudyHome groups={groups} setGroups={setGroups} />}
            />
            <Route
              path="/study-home/:userId/:groupId/goals"
              element={<GoalList groups={groups} setGroups={setGroups} />}
            />
            <Route
              path="/study-home/:userId/:groupId/goal-detail/:goalIndex"
              element={<GoalDetail groups={groups} setGroups={setGroups} />}
            />
            <Route
              path="/study-home/:userId/:groupId/set-goals"
              element={<SetGoals groups={groups} setGroups={setGroups} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
