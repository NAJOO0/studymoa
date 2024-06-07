import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import "../styles/Profile.css";

const interestsOptions = [
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

const skillsOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "c++", label: "C++" },
  { value: "react", label: "React" },
  { value: "nodejs", label: "Node.js" },
  { value: "express", label: "Express" },
  { value: "django", label: "Django" },
  { value: "flask", label: "Flask" },
  { value: "angular", label: "Angular" },
  { value: "vuejs", label: "Vue.js" },
  { value: "tensorflow", label: "TensorFlow" },
  { value: "pytorch", label: "PyTorch" },
  { value: "docker", label: "Docker" },
  { value: "jenkins", label: "Jenkins" },
  { value: "kubernetes", label: "Kubernetes" },
  { value: "aws", label: "AWS" },
  { value: "azure", label: "Azure" },
  { value: "gcp", label: "GCP" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "flutter", label: "Flutter" },
];

const Profile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState({
    id: parseInt(userId),
    name: "",
    phone: "",
    email: "",
    bio: "",
    interests: [],
    skills: [],
    visibility: "public",
  });

  useEffect(() => {
    const storedProfile = localStorage.getItem(`profile_${userId}`);
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
  }, [userId]);

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = () => {
    localStorage.setItem(`profile_${userId}`, JSON.stringify(profile));
    alert("Profile saved!");
  };

  return (
    <div className="profile">
      <h2>Profile</h2>
      <input
        type="text"
        placeholder="Name"
        value={profile.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />
      <input
        type="text"
        placeholder="Phone"
        value={profile.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={profile.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />
      <textarea
        placeholder="Bio"
        value={profile.bio}
        onChange={(e) => handleChange("bio", e.target.value)}
      />
      <Select
        isMulti
        options={interestsOptions}
        value={profile.interests}
        onChange={(selectedOptions) =>
          handleChange("interests", selectedOptions)
        }
        placeholder="Select Interests"
      />
      <Select
        isMulti
        options={skillsOptions}
        value={profile.skills}
        onChange={(selectedOptions) => handleChange("skills", selectedOptions)}
        placeholder="Select Skills"
      />
      <select
        value={profile.visibility}
        onChange={(e) => handleChange("visibility", e.target.value)}
      >
        <option value="public">Public</option>
        <option value="private">Private</option>
        <option value="study-members">Study Members</option>
      </select>
      <button onClick={handleSave}>Save Profile</button>
    </div>
  );
};

export default Profile;
