import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/StudyGroupForm.css";

const StudyGroupForm = ({ onSave, editingGroup }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState({
    title: "",
    description: "",
    topic: "",
    maxMembers: 10,
    members: [],
    applicants: [],
    leaderId: parseInt(userId),
    invited: [],
  });

  useEffect(() => {
    if (editingGroup) {
      setGroup(editingGroup);
    }
  }, [editingGroup]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroup({
      ...group,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(group);
    navigate(`/study-group/${userId}`);
  };

  return (
    <div className="study-group-form">
      <h2>{editingGroup ? "Edit Study Group" : "Create Study Group"}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={group.title}
            onChange={handleChange}
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={group.description}
            onChange={handleChange}
          ></textarea>
        </label>
        <label>
          Topic:
          <input
            type="text"
            name="topic"
            value={group.topic.label}
            onChange={handleChange}
          />
        </label>
        <label>
          Max Members:
          <input
            type="number"
            name="maxMembers"
            value={group.maxMembers}
            onChange={handleChange}
          />
        </label>
        <button type="submit">
          {editingGroup ? "Save Changes" : "Create Group"}
        </button>
      </form>
    </div>
  );
};

export default StudyGroupForm;
