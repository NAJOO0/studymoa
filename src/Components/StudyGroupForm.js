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
  const leaderProfile = localStorage.getItem(`profile_${parseInt(userId)}`);
  const leaderName = leaderProfile ? JSON.parse(leaderProfile).name : "Unknown";
  const [group, setGroup] = useState({
    id: editingGroup ? editingGroup.id : Date.now(),
    title: "",
    description: "",
    topic: null,
    maxMembers: 10,
    members: [parseInt(userId)],
    applicants: [],
    leaderId: parseInt(userId),
    leaderName: leaderName,
    invited: [],
    penalties: [],
    likes: [],
    withdrawalCondition: 3,
    createdAt: new Date().toISOString(),
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
      <h2>{editingGroup ? "스터디 수정" : "스터디 생성"}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          제목:
          <input
            type="text"
            name="title"
            value={group.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />
        </label>
        <label>
          설명:
          <textarea
            name="description"
            value={group.description}
            onChange={(e) => handleChange("description", e.target.value)}
            required
          ></textarea>
        </label>
        <label>
          분야:
          <Select
            options={topicOptions}
            value={group.topic}
            onChange={(selectedOption) => handleChange("topic", selectedOption)}
            placeholder="분야를 선택하세요."
            required
          />
        </label>
        <label>
          최대 인원:
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
          자동 탈퇴 조건:
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
          {editingGroup ? "수정사항 저장" : "스터디 생성"}
        </button>
      </form>
    </div>
  );
};

export default StudyGroupForm;
