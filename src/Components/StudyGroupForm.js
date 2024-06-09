import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import "../styles/StudyGroupForm.css";

const topicOptions = [
  { value: "web-development", label: "Web Development" },
  { value: "app-development", label: "App Development" },
  { value: "ai", label: "AI" },
  { value: "nlp", label: "NLP" },
  { value: "data-science", label: "Data Science" },
  { value: "cyber-security", label: "Cyber Security" },
  { value: "cloud-computing", label: "Cloud Computing" },
  { value: "blockchain", label: "Blockchain" },
  { value: "iot", label: "IoT" },
  { value: "game-development", label: "Game Development" },
  { value: "ar-vr", label: "AR/VR" },
];

const StudyGroupForm = ({ onSave, editingGroup }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState({
    id: editingGroup ? editingGroup.id : Date.now(),
    title: "",
    description: "",
    topic: null,
    maxMembers: 10,
    members: [parseInt(userId)],
    applicants: [],
    leaderId: parseInt(userId),
    invited: [],
    penalties: [],
    likes: [],
    withdrawalCondition: 3,
  });

  useEffect(() => {
    if (editingGroup) {
      setGroup(editingGroup);
    }
  }, [editingGroup]);

  const handleChange = (field, value) => {
    setGroup({ ...group, [field]: value });
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
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={group.description}
            onChange={(e) => handleChange("description", e.target.value)}
            required
          ></textarea>
        </label>
        <label>
          Topic:
          <Select
            options={topicOptions}
            value={group.topic}
            onChange={(selectedOption) => handleChange("topic", selectedOption)}
            placeholder="Select Topic"
            required
          />
        </label>
        <label>
          Max Members:
          <input
            type="number"
            name="maxMembers"
            value={group.maxMembers}
            onChange={(e) => handleChange("maxMembers", e.target.value)}
            min="1"
            required
          />
        </label>
        <label>
          Withdrawal Condition:
          <input
            type="number"
            name="withdrawalCondition"
            value={group.withdrawalCondition}
            onChange={(e) =>
              handleChange("withdrawalCondition", e.target.value)
            }
            min="1"
            required
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
