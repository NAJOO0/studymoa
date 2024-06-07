import React, { useState, useEffect } from "react";
import { Route, Routes, Link, useParams } from "react-router-dom";
import StudyGroupForm from "./StudyGroupForm";
import StudyGroupList from "./StudyGroupList";
import StudyGroupDetail from "./StudyGroupDetail";
import "../styles/StudyGroup.css";

const StudyGroup = ({ groups, setGroups }) => {
  const { userId } = useParams();

  useEffect(() => {
    const storedGroups = localStorage.getItem("studyGroups");
    if (storedGroups) {
      setGroups(JSON.parse(storedGroups));
    }
  }, [setGroups]);

  useEffect(() => {
    if (groups.length > 0)
      localStorage.setItem("studyGroups", JSON.stringify(groups));
  }, [groups]);

  const handleSaveGroup = (newGroup) => {
    if (newGroup.id && groups.some((group) => group.id === newGroup.id)) {
      const updatedGroups = groups.map((group) =>
        group.id === newGroup.id ? newGroup : group
      );
      setGroups(updatedGroups);
    } else {
      const newId = groups.length
        ? Math.max(...groups.map((g) => g.id)) + 1
        : 1;
      const groupWithId = {
        ...newGroup,
        id: newId,
        leaderId: parseInt(userId),
        members: [parseInt(userId)],
        likedBy: [],
      };
      setGroups([...groups, groupWithId]);
    }
  };

  const handleDeleteGroup = (groupId) => {
    const updatedGroups = groups.filter((group) => group.id !== groupId);
    setGroups(updatedGroups);
  };

  const handleAcceptApplicant = (groupId, applicant) => {
    const updatedGroups = groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          currentMembers: group.currentMembers + 1,
          applicants: group.applicants.filter((app) => app !== applicant),
          members: [...group.members, applicant],
        };
      }
      return group;
    });
    setGroups(updatedGroups);
  };

  const handleRejectApplicant = (groupId, applicant) => {
    const updatedGroups = groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          applicants: group.applicants.filter((app) => app !== applicant),
        };
      }
      return group;
    });
    setGroups(updatedGroups);
  };

  const handleEditGroup = (group) => {
    // Set the editing group and navigate to the edit form
    const editingGroup = groups.find((g) => g.id === group.id);
    setGroups(groups.map((g) => (g.id === group.id ? group : g)));
  };

  return (
    <div className="study-group">
      <div className="button-container">
        <Link to={`/study-group/${userId}/new`}>
          <button>Create Study Group</button>
        </Link>
      </div>
      <Routes>
        <Route
          path="/"
          element={<StudyGroupList groups={groups} setGroups={setGroups} />}
        />
        <Route
          path="/new"
          element={<StudyGroupForm onSave={handleSaveGroup} />}
        />
        <Route
          path="/edit/:id"
          element={<StudyGroupForm onSave={handleSaveGroup} />}
        />
        <Route
          path="/detail/:id"
          element={
            <StudyGroupDetail
              groups={groups}
              setGroups={setGroups}
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
