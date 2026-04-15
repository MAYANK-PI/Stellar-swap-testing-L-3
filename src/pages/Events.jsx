import React from "react";
import EventLog from "../components/EventLog";

export default function Events({ events }) {
  return (
    <div>
      <h1 className="page-title">Contract Events</h1>

      {!events || events.length === 0 ? (
        <p>No events yet</p>
      ) : (
        <EventLog events={events} />
      )}
    </div>
  );
}