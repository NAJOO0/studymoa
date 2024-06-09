import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "../styles/StudyGroupList.css";

const studyTopicsOptions = [
  { value: "all", label: "All" },
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

const StudyGroupList = ({ groups, showStatus, setGroups }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedTopic, setSelectedTopic] = useState({
    value: "all",
    label: "All",
  });

  const filteredGroups = groups.filter((group) => {
    const matchesTitle = group.title
      .toLowerCase()
      .includes(searchTitle.toLowerCase());
    const matchesTopic =
      selectedTopic.value === "all" ||
      (group.topic && group.topic.value === selectedTopic.value);
    return matchesTitle && matchesTopic;
  });

  const handleLikeClick = (groupId) => {
    const updatedGroups = groups.map((group) => {
      if (group.id === groupId) {
        const isLiked = group.likes?.includes(parseInt(userId));
        return {
          ...group,
          likes: isLiked
            ? group.likes.filter((id) => id !== parseInt(userId))
            : [...(group.likes || []), parseInt(userId)],
        };
      }
      return group;
    });
    setGroups(updatedGroups);
    localStorage.setItem("studyGroups", JSON.stringify(updatedGroups));
  };

  return (
    <div className="study-group-list">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <Select
          options={studyTopicsOptions}
          value={selectedTopic}
          onChange={setSelectedTopic}
          placeholder="Filter by topic"
        />
      </div>
      {filteredGroups.length === 0 ? (
        <p>No study groups available.</p>
      ) : (
        <ul>
          {filteredGroups.map((group) => (
            <li
              key={group.id}
              onClick={() =>
                navigate(`/study-group/${userId}/detail/${group.id}`)
              }
            >
              <h3>{group.title}</h3>
              <p>{group.description}</p>
              <p>Topic: {group.topic?.label}</p>
              <p>Leader: {group.leader}</p>
              <p>
                Members: {group.members.length}/{group.maxMembers}
              </p>
              <p>Applicants: {group.applicants.length}</p>
              {showStatus &&
                (group.leaderId === parseInt(userId) ? (
                  <p>Status: Leader</p>
                ) : group.members &&
                  group.members.includes(parseInt(userId)) ? (
                  <p>Status: Member</p>
                ) : (
                  <p>Status: Pending</p>
                ))}
              <div
                className="like-section"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the navigate event
                  handleLikeClick(group.id);
                }}
              >
                {group.likes?.includes(parseInt(userId)) ? (
                  <FaHeart className="like-icon liked" />
                ) : (
                  <FaRegHeart className="like-icon" />
                )}
                <span className="like-count">{group.likes?.length || 0}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudyGroupList;
