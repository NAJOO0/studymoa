import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/EventForm.css";

const EventForm = ({
  newEvent,
  handleEventChange,
  handleEventSubmit,
  handleEventCancel,
  handleEventDelete,
  editingEvent,
}) => {
  return (
    <div className="event-form">
      <h2>{editingEvent ? "Edit Event" : "Add Event"}</h2>
      <input
        type="text"
        placeholder="Event Title"
        value={newEvent.title}
        onChange={(e) => handleEventChange("title", e.target.value)}
      />
      <textarea
        placeholder="Event Description"
        value={newEvent.description}
        onChange={(e) => handleEventChange("description", e.target.value)}
      />
      <div>
        <label>Start Date</label>
        <DatePicker
          selected={newEvent.startDate}
          onChange={(date) => handleEventChange("startDate", date)}
        />
      </div>
      <div>
        <label>End Date</label>
        <DatePicker
          selected={newEvent.endDate}
          onChange={(date) => handleEventChange("endDate", date)}
        />
      </div>
      <div>
        <label>Event Color</label>
        <input
          type="color"
          value={newEvent.color}
          onChange={(e) => handleEventChange("color", e.target.value)}
        />
      </div>
      <div className="buttons">
        <button onClick={handleEventSubmit}>
          {editingEvent ? "Update Event" : "Add Event"}
        </button>
        <button onClick={handleEventCancel}>Cancel</button>
        {editingEvent && <button onClick={handleEventDelete}>Delete</button>}
      </div>
    </div>
  );
};

export default EventForm;
