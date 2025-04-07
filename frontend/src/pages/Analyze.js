import React, { useState } from "react";
import "./Analyze.css"; // Import the CSS file


const CareerPrediction = () => {
  const [formType, setFormType] = useState("10th");
  const [formData, setFormData] = useState({});
  const [prediction, setPrediction] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPrediction("🔄 Predicting...");
    setError("");

    let endpoint = "";
    if (formType === "10th") endpoint = "/predict_10th";
    else if (formType === "12th") endpoint = "/predict_12th";
    else if (formType === "graduate") endpoint = "/predict_graduate";

    const formattedData = { ...formData };
    Object.keys(formattedData).forEach((key) => {
      if (!isNaN(formattedData[key]) && formattedData[key] !== "") {
        formattedData[key] = parseFloat(formattedData[key]);
      }
    });

    try {
      const response = await fetch(`http://localhost:5002${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();

      if (response.ok) {
        setPrediction(result.prediction);
      } else {
        setError(result.error || "An error occurred");
        setPrediction("");
      }
    } catch (err) {
      setError("❌ Failed to fetch prediction. Please try again.");
      setPrediction("");
    }
  };

  const resetForm = () => {
    setFormData({});
    setPrediction("");
    setError("");
  };

  return (
    <div className="career-container">
      <div className="career-box">
        <h2 className="career-title">🔍 Analyze Your Career</h2>

        <div className="button-group">
          <button
            className={`toggle-btn ${formType === "10th" ? "active" : ""}`}
            onClick={() => {
              setFormType("10th");
              resetForm();
            }}
          >
            10th Student
          </button>
          <button
            className={`toggle-btn ${formType === "12th" ? "active" : ""}`}
            onClick={() => {
              setFormType("12th");
              resetForm();
            }}
          >
            12th Student
          </button>
          <button
            className={`toggle-btn ${formType === "graduate" ? "active" : ""}`}
            onClick={() => {
              setFormType("graduate");
              resetForm();
            }}
          >
            Graduate
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          {formType === "10th" && (
            <>
              <input
                type="number"
                name="secure_marks"
                placeholder="Secure Marks"
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="total_marks"
                placeholder="Total Marks"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="interest_field"
                placeholder="Interest Field (e.g. Science, Arts)"
                onChange={handleChange}
                required
              />
            </>
          )}

          {formType === "12th" && (
            <>
              <input
                type="number"
                name="secure_marks"
                placeholder="Secure Marks"
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="total_marks"
                placeholder="Total Marks"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="interest_field"
                placeholder="Interest Field (e.g. Engineering, Medical)"
                onChange={handleChange}
                required
              />
            </>
          )}

          {formType === "graduate" && (
            <>
              <input
                type="number"
                name="cgpa"
                placeholder="CGPA"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="interests"
                placeholder="Your Interests (e.g. AI, Business, Law)"
                onChange={handleChange}
                required
              />
            </>
          )}

          <button type="submit" className="submit-btn">
            🔮 Predict
          </button>
        </form>

        {error && <div className="error-box">❗ {error}</div>}

        {prediction && !error && (
          <div className="result-box">
            <h3>🎯 Prediction Result:</h3>
            <p>{prediction}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerPrediction;
