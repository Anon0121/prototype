import React, { useState } from "react";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim() || !form.date || !form.time) {
      alert("Please fill in all required fields.");
      return;
    }

    const newEvent = {
      id: Date.now(),
      ...form,
      image: form.image ? URL.createObjectURL(form.image) : null,
    };

    setEvents([newEvent, ...events]);

    setForm({
      title: "",
      description: "",
      date: "",
      time: "",
      image: null,
    });

    e.target.reset();
  };

  const handleDelete = (id) => {
    setEvents(events.filter((event) => event.id !== id));
  };


  const now = new Date();
  const upcomingEvents = events.filter((event) => new Date(event.date) > now);
  const pastEvents = events.filter((event) => new Date(event.date) <= now);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Events</h1>

      {/* Add Event Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow mb-10 space-y-4"
      >
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows="3"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Time</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Image (optional)</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Add Event
        </button>
      </form>

      {/* Upcoming Events */}
      <EventSection
        title="Upcoming Events"
        data={upcomingEvents}
        onDelete={handleDelete}
      />

      {/* Event History */}
      <EventSection
        title="Event History"
        data={pastEvents}
        onDelete={handleDelete}
        hideDelete
      />
    </div>
  );
};


const EventSection = ({ title, data, onDelete, hideDelete = false }) => {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {data.length === 0 ? (
        <p className="text-gray-500">No events in this section.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm text-left border-separate border-spacing-y-2">
            <thead className="bg-gray-100 text-gray-700 font-medium">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Title</th>
                <th className="p-3">Description</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                {!hideDelete && <th className="p-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((event) => (
                <tr key={event.id} className="bg-white hover:bg-gray-50">
                  <td className="p-3">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt="event"
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400 italic">No Image</span>
                    )}
                  </td>
                  <td className="p-3 font-semibold">{event.title}</td>
                  <td className="p-3">{event.description}</td>
                  <td className="p-3">{event.date}</td>
                  <td className="p-3">{event.time}</td>
                  {!hideDelete && (
                    <td className="p-3">
                      <button
                        onClick={() => onDelete(event.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Event;
