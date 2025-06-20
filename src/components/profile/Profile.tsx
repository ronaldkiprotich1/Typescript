// Profile.tsx
import React from "react";

interface ProfileProps {
  name: string;
  avatar: string;
  bio: string;
}

const Profile: React.FC<ProfileProps> = ({ name, avatar, bio }) => {
  return (
    <div className="profile-card">
      <img src={avatar} alt={`${name}'s avatar`} className="profile-avatar" />
      <h3>{name}</h3>
      <p>{bio}</p>
    </div>
  );
};

export default Profile;
