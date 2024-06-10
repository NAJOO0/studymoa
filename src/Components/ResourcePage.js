import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/ResourcePage.css";

const ResourcePage = ({ groups, setGroups }) => {
  const { userId, groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [resource, setResource] = useState("");
  const [file, setFile] = useState(null);
  const [editingResource, setEditingResource] = useState(null);

  useEffect(() => {
    const foundGroup = groups.find((group) => group.id === parseInt(groupId));
    setGroup(foundGroup);
  }, [groups, groupId]);

  const handleResourceChange = (e) => {
    setResource(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleResourceSubmit = () => {
    const newResource = {
      userId: parseInt(userId),
      text: resource,
      file: file ? file.name : null,
      date: new Date(),
    };

    const updatedGroups = [...groups];
    const groupIndex = updatedGroups.findIndex(
      (group) => group.id === parseInt(groupId)
    );

    if (editingResource !== null) {
      updatedGroups[groupIndex].resources[editingResource] = newResource;
    } else {
      updatedGroups[groupIndex].resources = [
        ...(updatedGroups[groupIndex].resources || []),
        newResource,
      ];
    }

    setGroups(updatedGroups);
    localStorage.setItem("studyGroups", JSON.stringify(updatedGroups));
    setResource("");
    setFile(null);
    setEditingResource(null);
  };

  const handleDeleteResource = (resourceIndex) => {
    const updatedGroups = [...groups];
    const groupIndex = updatedGroups.findIndex(
      (group) => group.id === parseInt(groupId)
    );

    updatedGroups[groupIndex].resources.splice(resourceIndex, 1);

    setGroups(updatedGroups);
    localStorage.setItem("studyGroups", JSON.stringify(updatedGroups));
  };

  const handleEditResource = (resourceIndex) => {
    const resourceToEdit = group.resources[resourceIndex];
    setResource(resourceToEdit.text);
    setFile(null); // 파일 수정 시 파일을 초기화
    setEditingResource(resourceIndex);
  };

  const getMemberName = (memberId) => {
    const profile = localStorage.getItem(`profile_${memberId}`);
    return profile ? JSON.parse(profile).name : "Unknown";
  };

  const downloadFile = (fileName) => {
    const fileBlob = new Blob([fileName]);
    const url = URL.createObjectURL(fileBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!group) {
    return <div>Loading...</div>;
  }

  return (
    <div className="resource-page">
      <div className="buttons">
        <Link to={`/study-home/${userId}/${groupId}`}>
          <button className="back-home-button">스터디 홈으로</button>
        </Link>
      </div>
      <h2>공유 자료</h2>
      <ul>
        {(group.resources || []).map((resource, index) => (
          <li key={index}>
            <p>
              <strong>{getMemberName(resource.userId)}</strong>
            </p>
            <p>{resource.text}</p>
            {resource.file && (
              <p>
                <button onClick={() => downloadFile(resource.file)}>
                  파일 다운로드
                </button>
              </p>
            )}
            <p>공유 날짜: {new Date(resource.date).toLocaleDateString()}</p>
            {(resource.userId === parseInt(userId) ||
              group.leaderId === parseInt(userId)) && (
              <div className="resource-buttons">
                <button onClick={() => handleEditResource(index)}>수정</button>
                <button onClick={() => handleDeleteResource(index)}>
                  삭제
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleResourceSubmit();
        }}
      >
        <textarea
          placeholder="자료 설명란"
          value={resource}
          onChange={handleResourceChange}
        />
        <input type="file" onChange={handleFileChange} />
        <button type="submit">
          {editingResource !== null ? "자료 수정" : "자료 등록"}
        </button>
      </form>
    </div>
  );
};

export default ResourcePage;
