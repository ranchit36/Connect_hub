import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UpcomingEvents.css'; // CSS for styling

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:8800/api/events');
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="eventsContainer">
      <h2 className="eventsTitle">Upcoming Events</h2>
      {events.length > 0 ? (
        events.map((event) => (
          <div key={event._id} className="eventCard">
            <h3 className="eventCardName">{event.name}</h3>
            <p className="eventCardDescription">{event.description}</p>
            <p className="eventDate">Date: {new Date(event.date).toLocaleDateString()}</p>
            <p className="eventLocation">Location: {event.location}</p>
            {event.attachments.length > 0 && (
              <ul className="attachmentList">
                {event.attachments.map((attachment, index) => {
                  // Construct file URL dynamically
                  const fileUrl = `http://localhost:8800/images/${encodeURIComponent(attachment)}`;

                  return (
                    <li key={index}>
                      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                        {attachment}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))
      ) : (
        <p>No upcoming events available.</p>
      )}
    </div>
  );
};

export default UpcomingEvents;
