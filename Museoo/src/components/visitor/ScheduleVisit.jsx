import React, { useState } from "react";
import { Link } from "react-router-dom";
import citymus from "../../assets/citymus.jpg";
import logo from "../../assets/logo.png";

const ScheduleVisit = () => {
  const [companions, setCompanions] = useState([]);

  const addCompanion = () => {
    setCompanions((prev) => [
      ...prev,
      {
        id: Date.now(),
        firstName: "",
        lastName: "",
        gender: "male",
        address: "",
        email: "",
        phone: "",
      },
    ]);
  };

  const removeCompanion = (id) => {
    setCompanions((prev) => prev.filter((comp) => comp.id !== id));
  };

  const handleCompanionChange = (id, field, value) => {
    setCompanions((prev) =>
      prev.map((comp) =>
        comp.id === id ? { ...comp, [field]: value } : comp
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Navigation */}
      <nav
        className="flex justify-between items-center px-6 py-4 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(4,9,30,0.7), rgba(4,9,30,0.7)), url(${citymus})`,
        }}
      >
        <Link to="/">
          <img src={logo} className="w-24" alt="Logo" />
        </Link>
        <ul className="hidden md:flex space-x-8 text-white text-lg font-medium">
          <li><a href="#home" className="hover:text-[#f7f786de]">HOME</a></li>
          <li><a href="#about" className="hover:text-[#f7f786de]">ABOUT</a></li>
          <li><a href="#exhibit" className="hover:text-[#f7f786de]">EXHIBITS</a></li>
          <li><a href="#event" className="hover:text-[#f7f786de]">EVENTS</a></li>
          <li><a href="#contact" className="hover:text-[#f7f786de]">CONTACT</a></li>
        </ul>
      </nav>

      {/* Form Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2">Schedule Your Visit</h1>
          <p className="text-center text-gray-600 mb-8">
            Please fill in the details below to schedule your visit to the museum.
          </p>

          <form className="space-y-6">
            {/* Visitor Info */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Visitor Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="First Name" type="text" required />
                <Input label="Last Name" type="text" required />
                <Select label="Gender" options={["Male", "Female", "Other"]} />
                <Input label="Address" type="text" required />
                <Input label="Email" type="email" required />
                <Input label="Phone Number" type="tel" required />
                <Input label="Visit Date" type="date" required />
                <Input
                  label="Number of Visitors (Including You)"
                  type="number"
                  required
                  min="1"
                />
              </div>
            </div>

            {/* Companions */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Companion Information</h2>
              {companions.map((comp, index) => (
                <div key={comp.id} className="bg-gray-50 p-4 border rounded-lg mb-4">
                  <h3 className="font-semibold mb-3">Companion {index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CompanionInput
                      placeholder="First Name"
                      value={comp.firstName}
                      onChange={(e) => handleCompanionChange(comp.id, "firstName", e.target.value)}
                    />
                    <CompanionInput
                      placeholder="Last Name"
                      value={comp.lastName}
                      onChange={(e) => handleCompanionChange(comp.id, "lastName", e.target.value)}
                    />
                    <select
                      className="p-2 border rounded"
                      value={comp.gender}
                      onChange={(e) => handleCompanionChange(comp.id, "gender", e.target.value)}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <CompanionInput
                      placeholder="Address"
                      value={comp.address}
                      onChange={(e) => handleCompanionChange(comp.id, "address", e.target.value)}
                    />
                    <CompanionInput
                      type="email"
                      placeholder="Email"
                      value={comp.email}
                      onChange={(e) => handleCompanionChange(comp.id, "email", e.target.value)}
                    />
                    <CompanionInput
                      type="tel"
                      placeholder="Phone Number"
                      value={comp.phone}
                      onChange={(e) => handleCompanionChange(comp.id, "phone", e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    onClick={() => removeCompanion(comp.id)}
                  >
                    Remove Companion
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded mt-4"
                onClick={addCompanion}
              >
                Add Companion
              </button>
            </div>

            {/* Submit */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>

      <footer className="bg-gray-900 text-white text-center py-4">
        &copy; 2025 Cagayan de Oro City Museum. All rights reserved.
      </footer>
    </div>
  );
};

// Reusable Input
const Input = ({ label, ...props }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <input {...props} className="w-full p-2 border rounded" />
  </div>
);

// Companion Input (smaller reuse)
const CompanionInput = ({ value, onChange, ...props }) => (
  <input
    {...props}
    value={value}
    onChange={onChange}
    required
    className="p-2 border rounded"
  />
);

// Select
const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <select {...props} className="w-full p-2 border rounded">
      {options.map((opt, idx) => (
        <option key={idx} value={opt.toLowerCase()}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default ScheduleVisit;
