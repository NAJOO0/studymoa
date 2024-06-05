import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
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

const StudyGroupList = ({ groups, showStatus }) => {
  const { userId } = useParams();
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
            <li key={group.id}>
              <Link to={`/study-group/${userId}/detail/${group.id}`}>
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
                  ) : group.members.includes(parseInt(userId)) ? (
                    <p>Status: Member</p>
                  ) : (
                    <p>Status: Pending</p>
                  ))}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudyGroupList;