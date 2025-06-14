import React, { useState, useEffect } from "react";

const Exhibit = () => {
  const [exhibits, setExhibits] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: null,
    startDate: "",
    endDate: "",
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

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.startDate ||
      !form.endDate
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const newExhibit = {
      id: Date.now(),
      title: form.title,
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
      image: form.image ? URL.createObjectURL(form.image) : null,
    };

    setExhibits([newExhibit, ...exhibits]);
    setForm({
      title: "",
      description: "",
      image: null,
      startDate: "",
      endDate: "",
    });
    e.target.reset();
  };

  const handleDelete = (id) => {
    setExhibits(exhibits.filter((item) => item.id !== id));
  };

  // Categorize exhibits
  const now = new Date();
  const upcoming = exhibits.filter(
    (ex) => new Date(ex.startDate) > now
  );
  const ongoing = exhibits.filter(
    (ex) =>
      new Date(ex.startDate) <= now && new Date(ex.endDate) >= now
  );
  const history = exhibits.filter(
    (ex) => new Date(ex.endDate) < now
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Exhibits</h1>

      {/* Add Exhibit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 mb-10 space-y-4"
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
            <label className="block font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
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
            className="w-full border rounded px-3 py-2 bg-white text-sm"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Add Exhibit
        </button>
      </form>

      {/* Render Section */}
      <Section title="Upcoming Exhibits" data={upcoming} onDelete={handleDelete} />
      <Section title="Ongoing Exhibits" data={ongoing} onDelete={handleDelete} />
      <Section title="Exhibit History" data={history} onDelete={handleDelete} hideDelete />
    </div>
  );
};

// Sub-component to reuse table display
const Section = ({ title, data, onDelete, hideDelete = false }) => {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {data.length === 0 ? (
        <p className="text-gray-500">No exhibits in this category.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm text-left border-separate border-spacing-y-2">
            <thead className="bg-gray-100 text-gray-700 font-medium">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Title</th>
                <th className="p-3">Description</th>
                <th className="p-3">Start</th>
                <th className="p-3">End</th>
                {!hideDelete && <th className="p-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="bg-white hover:bg-gray-50">
                  <td className="p-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt="exhibit"
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400 italic">No Image</span>
                    )}
                  </td>
                  <td className="p-3 font-semibold">{item.title}</td>
                  <td className="p-3">{item.description}</td>
                  <td className="p-3">{item.startDate}</td>
                  <td className="p-3">{item.endDate}</td>
                  {!hideDelete && (
                    <td className="p-3">
                      <button
                        onClick={() => onDelete(item.id)}
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

export default Exhibit;
