import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './clubs.css'; // Ensure the CSS file exists

const StudentOrganization = () => {
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const res = await axios.get('http://localhost:8800/api/clubs');
        setOrganizations(res.data);
      } catch (err) {
        console.error('Error fetching student organizations:', err);
      }
    };
    fetchOrganizations();
  }, []);

  return (
    <div className="organizationContainer">
      <h2 className="organizationTitle">Student Organizations</h2>
      {organizations.length > 0 ? (
        organizations.map((organization) => (
          <div key={organization._id} className="organizationCard">
            <h3 className="organizationCardTitle">{organization.name}</h3>
            <p className="organizationCardDescription">{organization.description}</p>
            
            <p><strong>President:</strong> {organization.president}</p>
            <p><strong>Established Year:</strong> {organization.establishedYear}</p>
            <p><strong>Members:</strong> {organization.memberCount || 'N/A'}</p>

            {organization.eventsOrganized && organization.eventsOrganized.length > 0 && (
              <div>
                <p><strong>Events Organized:</strong></p>
                <ul className="eventList">
                  {organization.eventsOrganized.map((event, index) => (
                    <li key={index}>{event}</li>
                  ))}
                </ul>
              </div>
            )}

            {organization.links && organization.links.length > 0 && (
              <div>
                <p><strong>Useful Links:</strong></p>
                <ul className="linkList">
                  {organization.links.map((link, index) => (
                    <li key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {`Visit ${organization.name} Page ${index + 1}`}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No student organizations available.</p>
      )}
    </div>
  );
};

export default StudentOrganization;
