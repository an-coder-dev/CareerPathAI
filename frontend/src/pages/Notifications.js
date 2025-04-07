import React, { useEffect, useState } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/notifications`);
      const data = await response.json();
      setNotifications(data);
    };

    fetchNotifications();
  }, []);

  return (
    <div>
      <h1>Notifications</h1>
      {notifications.length > 0 ? (
        notifications.map((note, index) => <p key={index}>{note.message}</p>)
      ) : (
        <p>No new notifications</p>
      )}
    </div>
  );
};

export default Notifications;
