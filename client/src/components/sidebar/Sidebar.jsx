import React from 'react'
import './sidebar.css'
import { Link } from 'react-router-dom';
import {
  Campaign,
  Class,
  Assignment,
  Work,
  Event,
  Group,
  LibraryBooks,
  QuestionAnswer,
  PeopleAlt,
  BusinessCenter,
  SupervisorAccount,
} from "@mui/icons-material";
import HealingIcon from '@mui/icons-material/Healing';
import AssessmentIcon from '@mui/icons-material/Assessment';

import { Users } from "../../dummyData";
import CloseFriend from "../closeFriend/CloseFriend";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const handleChatbotClick = () => {
    if (user && user._id) {
      // Debug log to check the full user ID
      console.log("Full user ID:", user._id);
      // Make sure we encode the full MongoDB ID
      const chatbotUrl = new URL('http://localhost:8501');
      chatbotUrl.searchParams.append('userId', user._id);
      window.open(chatbotUrl.toString(), '_blank');
    } else {
      alert("Please log in first");
    }
  };
  
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
        <Link to="/Announcements">
            <li className="sidebarListItem">
              <Campaign className="sidebarIcon" />
              <span className="sidebarListItemText">Announcements </span>
            </li>
          </Link>
        <Link to="/department">
            <li className="sidebarListItem">
              <Class className="sidebarIcon" />
              <span className="sidebarListItemText">Department </span>
            </li>
          </Link>
          <Link to="/Internships">
            <li className="sidebarListItem">
              <Work className="sidebarIcon" />
              <span className="sidebarListItemText">Internships</span>
            </li>
          </Link>
          <Link to="/Events">
            <li className="sidebarListItem">
              <Event className="sidebarIcon" />
              <span className="sidebarListItemText">Events</span>
            </li>
          </Link>
          <Link to="/Clubs">
            <li className="sidebarListItem">
              <Group className="sidebarIcon" />
              <span className="sidebarListItemText">Clubs</span>
            </li>
          </Link>
          <Link to="/About">
            <li className="sidebarListItem">
              <LibraryBooks className="sidebarIcon" />
              <span class="sidebarListItemText">About RVCE</span>
            </li>
          </Link>
          <li className="sidebarListItem">
            <button 
              onClick={handleChatbotClick} 
              className="sidebarLink"
            >
              <QuestionAnswer className="sidebarIcon" />
              <span className="sidebarListItemText">Q&A Forums</span>
            </button>
          </li>

{/* Add for teachers/admin */}
{user?.isAdmin && (
  <>
    <Link to="/teacher-remedial-classes" className="link">
      <li className="sidebarListItem">
        <HealingIcon className="sidebarIcon" />
        <span className="sidebarListItemText">Remedial Classes</span>
      </li>
    </Link>
    <Link to="/teacher-remedial-report" className="link">
      <li className="sidebarListItem">
        <AssessmentIcon className="sidebarIcon" />
        <span className="sidebarListItemText">Remedial Report</span>
      </li>
    </Link>
    <Link to="/teacher-qa-dashboard" className="link">
      <li className="sidebarListItem">
        <SupervisorAccount className="sidebarIcon" />
        <span className="sidebarListItemText">Q&A Management</span>
      </li>
    </Link>
  </>
)}

{/* Add for students */}
<Link to="/student-remedial-classes" className="link">
  <li className="sidebarListItem">
    <HealingIcon className="sidebarIcon" />
    <span className="sidebarListItemText">Remedial Classes</span>
  </li>
</Link>
<Link to="/qa-history" className="link">
  <li className="sidebarListItem">
    <QuestionAnswer className="sidebarIcon" />
    <span className="sidebarListItemText">Q&A History</span>
  </li>
</Link>
          
        </ul>
        <hr className="sidebarHr" />
        {/* <ul className="sidebarFriendList">
          {Users.map((u) => (
            <CloseFriend key={u.id} user={u} />
          ))} 
        </ul> */}
      </div>
    </div>
  );
}
