import React from 'react';
import imgFollowers from '../img/2-User.svg';
import imgFollowing from '../img/Profile.svg';

interface FollowersProps {
  followers: number;
  following: number;
}

function formatNumber(number: number): string {
  const absNumber = Math.abs(number);

  if (absNumber >= 1000000) {
    return `${(absNumber / 1000000).toFixed(1)}m`;
  }
  if (absNumber >= 1000) {
    return `${(absNumber / 1000).toFixed(1)}k`;
  }
  return `${absNumber}`;
}

const Followers: React.FC<FollowersProps> = ({ followers, following }) => {
  return (
    <div className="followers">
      <p>
        <img className="follow-img" src={imgFollowers} alt="" />
        {formatNumber(followers)} Followers
      </p>
      <p>
        <img style={{ width: '10px' }} className="follow-img" src={imgFollowing} alt="" />
        {formatNumber(following)} Following
      </p>
    </div>
  );
};

export default Followers;
