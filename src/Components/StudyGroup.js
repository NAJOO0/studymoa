import React, { useState, useEffect } from "react";
import { Route, Routes, Link, useNavigate, useParams } from "react-router-dom";
import StudyGroupForm from "./StudyGroupForm";
import StudyGroupList from "./StudyGroupList";
import StudyGroupDetail from "./StudyGroupDetail";
import "../styles/StudyGroup.css";

const StudyGroup = () => {
  const { userId } = useParams();
  const [groups, setGroups] = useState([]);
  const [editingGroup, setEditingGroup] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (groups.length === 0) {
      const storedGroups = localStorage.getItem("studyGroups");
      if (storedGroups) {
        setGroups(JSON.parse(storedGroups));
      }
    }
  }, [userId]);

  useEffect(() => {
    if (groups.length > 0) {
      localStorage.setItem("studyGroups", JSON.stringify(groups));
    }
  }, [groups, userId]);

  const handleSaveGroup = (newGroup) => {
    if (editingGroup) {
      setGroups(
        groups.map((group) => (group.id === editingGroup.id ? newGroup : group))
      );
      setEditingGroup(null);
    } else {
      setGroups([...groups, newGroup]);
    }
    navigate(`/study-group/${userId}`);
  };

  const handleDeleteGroup = (groupId) => {
    const updatedGroups = groups.filter((group) => group.id !== groupId);
    setGroups(updatedGroups);
    localStorage.setItem("studyGroups", JSON.stringify(updatedGroups));
    navigate(`/study-group/${userId}`);
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
    navigate(`/study-group/${userId}/edit/${group.id}`);
  };

  const handleAcceptApplicant = (groupId, applicant) => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            currentMembers: group.currentMembers + 1,
            applicants: group.applicants.filter((app) => app !== applicant),
            members: [...group.members, applicant],
          };
        }
        return group;
      })
    );
  };

  const handleRejectApplicant = (groupId, applicant) => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            applicants: group.applicants.filter((app) => app !== applicant),
          };
        }
        return group;
      })
    );
  };

  return (
    <div className="study-group">
      <div className="button-container">
        <Link to={`/study-group/${userId}/new`}>
          <button>Create Study Group</button>
        </Link>
      </div>
      <Routes>
        <Route path="/" element={<StudyGroupList groups={groups} />} />
        <Route
          path="/new"
          element={<StudyGroupForm onSave={handleSaveGroup} />}
        />
        <Route
          path="/edit/:id"
          element={
            <StudyGroupForm
              onSave={handleSaveGroup}
              editingGroup={editingGroup}
            />
          }
        />
        <Route
          path="/detail/:id"
          element={
            <StudyGroupDetail
              groups={groups}
              onAccept={handleAcceptApplicant}
              onReject={handleRejectApplicant}
              onEdit={handleEditGroup}
              onDelete={handleDeleteGroup}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default StudyGroup;
