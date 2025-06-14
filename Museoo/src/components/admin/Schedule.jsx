import React, { useState, useEffect } from "react";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    nationality: "",
    gender: "Male",
    address: "",
    purpose: "",
    visitType: "Scheduled",
    visitDate: "",
    visitTime: "",
    status: "Pending",
  });

 
  useEffect(() => {
    const saved = localStorage.getItem("visitors");
    if (saved) setSchedules(JSON.parse(saved));
  }, []);

  // Save to localStorage whenever schedules change
  useEffect(() => {
    localStorage.setItem("visitors", JSON.stringify(schedules));
  }, [schedules]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSchedule = (e) => {
    e.preventDefault();
    const newSchedule = { id: Date.now(), ...form };
    setSchedules([newSchedule, ...schedules]);
    setForm({
      firstName: "",
      lastName: "",
      nationality: "",
      gender: "Male",
      address: "",
      purpose: "",
      visitType: "Scheduled",
      visitDate: "",
      visitTime: "",
      status: "Pending",
    });
  };

  const updateStatus = (id, status) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const deleteSchedule = (id) => {
    if (confirm("Delete this schedule?")) {
      setSchedules(schedules.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Schedule a Visit</h1>

      {/* Form */}
      <form
        onSubmit={addSchedule}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow mb-10"
      >
        <input type="text" name="firstName" value={form.firstName} onChange={handleInputChange} required placeholder="First Name" className="border px-3 py-2 rounded" />
        <input type="text" name="lastName" value={form.lastName} onChange={handleInputChange} required placeholder="Last Name" className="border px-3 py-2 rounded" />
        
        <select name="nationality" value={form.nationality} onChange={handleInputChange} required className="border px-3 py-2 rounded">
          <option value="">Select Nationality</option>
          <option value="Filipino">Filipino</option>
          <option value="American">American</option>
          <option value="British">British</option>
          <option value="Other">Other</option>
        </select>

        <div className="flex items-center gap-4">
          <label><input type="radio" name="gender" value="Male" checked={form.gender === "Male"} onChange={handleInputChange} /> Male</label>
          <label><input type="radio" name="gender" value="Female" checked={form.gender === "Female"} onChange={handleInputChange} /> Female</label>
        </div>

        <input type="text" name="address" value={form.address} onChange={handleInputChange} required placeholder="Address" className="border px-3 py-2 rounded" />
        
        <select name="purpose" value={form.purpose} onChange={handleInputChange} required className="border px-3 py-2 rounded">
          <option value="">Select Purpose</option>
          <option value="Education">Education</option>
          <option value="Research">Research</option>
          <option value="Leisure">Leisure</option>
          <option value="Cultural">Cultural</option>
        </select>

        <select name="visitType" value={form.visitType} onChange={handleInputChange} required className="border px-3 py-2 rounded">
          <option value="Scheduled">Scheduled</option>
          <option value="Walk-in">Walk-in</option>
        </select>

        <input type="date" name="visitDate" value={form.visitDate} onChange={handleInputChange} required className="border px-3 py-2 rounded" />
        <input type="time" name="visitTime" value={form.visitTime} onChange={handleInputChange} required className="border px-3 py-2 rounded" />

        <div className="md:col-span-2">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Add Schedule
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left border-separate border-spacing-y-2">
          <thead className="bg-gray-100 text-gray-700 font-medium">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Nationality</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Address</th>
              <th className="p-3">Purpose</th>
              <th className="p-3">Type</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 ? (
              <tr><td colSpan="10" className="text-center py-4 text-gray-500">No records</td></tr>
            ) : (
              schedules.map((s) => (
                <tr key={s.id} className="bg-white hover:bg-gray-50">
                  <td className="p-3">{s.firstName} {s.lastName}</td>
                  <td className="p-3">{s.nationality}</td>
                  <td className="p-3">{s.gender}</td>
                  <td className="p-3">{s.address}</td>
                  <td className="p-3">{s.purpose}</td>
                  <td className="p-3">{s.visitType}</td>
                  <td className="p-3">{s.visitDate}</td>
                  <td className="p-3">{s.visitTime}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      s.status === "Approved" ? "bg-green-100 text-green-700" :
                      s.status === "Cancelled" ? "bg-red-100 text-red-600" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => updateStatus(s.id, "Approved")} className="text-green-600 hover:underline">Approve</button>
                    <button onClick={() => updateStatus(s.id, "Cancelled")} className="text-red-600 hover:underline">Cancel</button>
                    <button onClick={() => deleteSchedule(s.id)} className="text-gray-500 hover:text-black">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;
