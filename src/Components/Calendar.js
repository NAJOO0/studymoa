import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../styles/Calendar.css";

const Calendar = ({ group, setGroups }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    id: null,
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    color: "#0000ff",
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const events = group?.events || [];

  useEffect(() => {
    const storedGroups = localStorage.getItem("studyGroups");
    if (storedGroups) {
      const updatedGroups = JSON.parse(storedGroups);
      setGroups(updatedGroups);
    }
  }, [setGroups]);

  useEffect(() => {
    if (events.length > 0) {
      const updatedGroups = JSON.parse(localStorage.getItem("studyGroups"));
      const groupIndex = updatedGroups.findIndex((g) => g.id === group.id);
      updatedGroups[groupIndex].events = events;
      localStorage.setItem("studyGroups", JSON.stringify(updatedGroups));
    }
  }, [events, group.id]);

  const renderHeader = () => {
    return (
      <div className="header row flex-middle">
        <div className="col col-start" onClick={prevMonth}>
          <FaChevronLeft className="icon" />
        </div>
        <div className="col col-center">
          <span>
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="col col-end" onClick={nextMonth}>
          <FaChevronRight className="icon" />
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="days row">
        {daysOfWeek.map((day, index) => (
          <div className="col col-center" key={index}>
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const monthEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const rows = [];
    let days = [];
    let day = new Date(startDate);
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = day.getDate();
        const cloneDay = new Date(day);

        days.push(
          <div
            className={`col cell ${
              day.getMonth() !== currentDate.getMonth() ? "disabled" : ""
            }`}
            key={day}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className="number">{formattedDate}</span>
            {renderEvents(cloneDay)}
          </div>
        );
        day.setDate(day.getDate() + 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }

    return <div className="body">{rows}</div>;
  };

  const renderEvents = (date) => {
    const dayEvents = events.filter((event) => {
      const eventStartDate = new Date(event.startDate);
      const eventEndDate = new Date(event.endDate);
      return date >= eventStartDate && date <= eventEndDate;
    });

    return dayEvents.map((event, index) => (
      <div
        key={index}
        className="event-title"
        style={{ backgroundColor: event.color }}
      >
        {event.title}
      </div>
    ));
  };

  const onDateClick = (day) => {
    const event = events.find((event) => {
      const eventStartDate = new Date(event.startDate);
      const eventEndDate = new Date(event.endDate);
      return day >= eventStartDate && day <= eventEndDate;
    });
    if (event) {
      setEditingEvent(event);
      setNewEvent(event);
      setIsEditing(false);
      setShowEventForm(true);
    } else {
      setEditingEvent(null);
      setNewEvent({
        id: null,
        title: "",
        description: "",
        startDate: day,
        endDate: day,
        color: "#0000ff",
      });
      setIsEditing(true);
      setShowEventForm(true);
    }
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleEventChange = (field, value) => {
    setNewEvent({ ...newEvent, [field]: value });
  };

  const handleEventSubmit = () => {
    const updatedGroups = JSON.parse(localStorage.getItem("studyGroups"));
    const groupIndex = updatedGroups.findIndex((g) => g.id === group.id);

    if (!updatedGroups[groupIndex].events) {
      updatedGroups[groupIndex].events = [];
    }

    if (newEvent.id) {
      updatedGroups[groupIndex].events = updatedGroups[groupIndex].events.map(
        (event) => (event.id === newEvent.id ? newEvent : event)
      );
    } else {
      const newEventId = updatedGroups[groupIndex].events.length + 1;
      const eventToAdd = { ...newEvent, id: newEventId };
      updatedGroups[groupIndex].events.push(eventToAdd);
    }

    setGroups(updatedGroups);
    localStorage.setItem("studyGroups", JSON.stringify(updatedGroups));
    setShowEventForm(false);
    setNewEvent({
      id: null,
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      color: "#0000ff",
    });
    setEditingEvent(null);
    setIsEditing(false);
  };

  const handleEventCancel = () => {
    setShowEventForm(false);
    setNewEvent({
      id: null,
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      color: "#0000ff",
    });
    setEditingEvent(null);
    setIsEditing(false);
  };

  const handleEventDelete = () => {
    const updatedGroups = JSON.parse(localStorage.getItem("studyGroups"));
    const groupIndex = updatedGroups.findIndex((g) => g.id === group.id);

    updatedGroups[groupIndex].events = updatedGroups[groupIndex].events.filter(
      (event) => event.id !== newEvent.id
    );

    setGroups(updatedGroups);
    localStorage.setItem("studyGroups", JSON.stringify(updatedGroups));
    setShowEventForm(false);
    setNewEvent({
      id: null,
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      color: "#0000ff",
    });
    setEditingEvent(null);
    setIsEditing(false);
  };

  return (
    <div className="calendar">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {showEventForm && (
        <div className="event-form">
          {editingEvent && !isEditing ? (
            <>
              <h2>{newEvent.title}</h2>
              <p>{newEvent.description}</p>
              <p>
                Start: {new Date(newEvent.startDate).toLocaleDateString()} -
                End: {new Date(newEvent.endDate).toLocaleDateString()}
              </p>
              <div className="buttons">
                <button onClick={() => setIsEditing(true)}>Edit</button>
                <button onClick={handleEventCancel}>Close</button>
              </div>
            </>
          ) : (
            <>
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
                onChange={(e) =>
                  handleEventChange("description", e.target.value)
                }
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
                {editingEvent && (
                  <button onClick={handleEventDelete}>Delete</button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;
