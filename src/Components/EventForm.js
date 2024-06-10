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
        placeholder="일정 제목"
        value={newEvent.title}
        onChange={(e) => handleEventChange("title", e.target.value)}
      />
      <textarea
        placeholder="일정 설명"
        value={newEvent.description}
        onChange={(e) => handleEventChange("description", e.target.value)}
      />
      <div>
        <label>시작일</label>
        <DatePicker
          selected={newEvent.startDate}
          onChange={(date) => handleEventChange("startDate", date)}
        />
      </div>
      <div>
        <label>종료일</label>
        <DatePicker
          selected={newEvent.endDate}
          onChange={(date) => handleEventChange("endDate", date)}
        />
      </div>
      <div>
        <label>색깔</label>
        <input
          type="color"
          value={newEvent.color}
          onChange={(e) => handleEventChange("color", e.target.value)}
        />
      </div>
      <div className="buttons">
        <button onClick={handleEventSubmit}>
          {editingEvent ? "일정 수정" : "일정 등록"}
        </button>
        <button onClick={handleEventCancel}>닫기</button>
        {editingEvent && <button onClick={handleEventDelete}>일정 삭제</button>}
      </div>
    </div>
  );
};

export default EventForm;
