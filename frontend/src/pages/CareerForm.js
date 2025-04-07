import { useState } from "react";
import axios from "axios";

const CareerForm = () => {
    const [skills, setSkills] = useState("");
    const [career, setCareer] = useState("");

    const handlePredict = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/predict", {
                skills: skills,
            });

            setCareer(response.data.recommended_career);
        } catch (error) {
            console.error("Error fetching career prediction:", error);
        }
    };

    return (
        <div>
            <h2>Career Guidance System</h2>
            <input
                type="text"
                placeholder="Enter your skills..."
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
            />
            <button onClick={handlePredict}>Predict Career</button>

            {career && <h3>Recommended Career: {career}</h3>}
        </div>
    );
};

export default CareerForm;
