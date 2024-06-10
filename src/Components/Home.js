import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  return (
    <div className="home">
      <h2>유저 ID를 입력하세요.</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button type="submit">Go</button>
      </form>
    </div>
  );
};

export default Home;
