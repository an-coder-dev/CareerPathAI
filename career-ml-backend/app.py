from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

# Load trained models
try:
    with open('10th_career_model.pkl', 'rb') as f:
        tenth_model_data = pickle.load(f)
        tenth_model = tenth_model_data['model']
        tenth_encoder = tenth_model_data['encoder']

    with open('12th_career_model.pkl', 'rb') as f:
        twelfth_model_data = pickle.load(f)
        twelfth_model = twelfth_model_data['model']
        twelfth_encoders = twelfth_model_data['encoder']

    with open('graduate_career_model.pkl', 'rb') as f:
        graduate_model_data = pickle.load(f)
        graduate_model = graduate_model_data['model']
        graduate_encoders = graduate_model_data['encoder']
        
except Exception as e:
    print("Error loading models:", str(e))
    raise e

@app.route('/')
def home():
    return "✅ Career Guidance API is running!"

@app.route('/predict_10th', methods=['POST'])
def predict_10th():
    data = request.json
    print("Received 10th data:", data)

    required_keys = ['Secure_Marks', 'Total_Marks', 'Interest_Field']
    if not all(key in data for key in required_keys):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        # Rename keys to match model training feature names
        renamed_data = {
            'Secure Marks': data['Secure_Marks'],
            'Total Marks': data['Total_Marks'],
            'Interest Field': data['Interest_Field']
        }
        df = pd.DataFrame([renamed_data])
        df['Interest Field'] = tenth_encoder.transform(df['Interest Field'])

        prediction = tenth_model.predict(df)
        recommended_stream = prediction[0]  # If it's already a string


        percentage = round((data['Secure_Marks'] / data['Total_Marks']) * 100, 1)
        stream = data['Interest_Field'].capitalize()

        advice = generate_advice(percentage, stream)

        return jsonify({'prediction': recommended_stream, 'advice': advice})
    except Exception as e:
        print("Error:", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/predict_12th', methods=['POST'])
def predict_12th():
    data = request.json
    print("Received 12th data:", data)

    required_keys = ['Secure_Marks', 'Total_Marks', 'Interest_Field']
    if not all(key in data for key in required_keys):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        input_df = pd.DataFrame([[data['Interest_Field']]], columns=['Interest_Field'])
        encoded_features = twelfth_encoders.transform(input_df)
        encoded_df = pd.DataFrame(encoded_features, columns=twelfth_encoders.get_feature_names_out(['Interest_Field']))
        full_input_df = pd.concat([
            pd.DataFrame([[data['Secure_Marks'], data['Total_Marks']]], columns=['Secure_Marks', 'Total_Marks']),
            encoded_df
        ], axis=1)

        model_features = ['Secure_Marks', 'Total_Marks'] + list(twelfth_encoders.get_feature_names_out(['Interest_Field']))
        full_input_df = full_input_df[model_features]

        prediction = twelfth_model.predict(full_input_df)
        recommended_job = prediction[0]  # Already a decoded string

        percentage = round((data['Secure_Marks'] / data['Total_Marks']) * 100, 1)
        stream = data['Interest_Field'].capitalize()

        advice = generate_advice(percentage, stream)

        return jsonify({'prediction': recommended_job, 'advice': advice})
    except Exception as e:
        print("Error:", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/predict_graduate', methods=['POST'])
def predict_graduate():
    data = request.json
    print("Received graduate data:", data)

    required_keys = ['CGPA', 'Interest_Field']
    if not all(key in data for key in required_keys):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        input_df = pd.DataFrame([[data['Interest_Field']]], columns=['Interest_Field'])
        encoded_features = graduate_encoders.transform(input_df)
        encoded_df = pd.DataFrame(encoded_features, columns=graduate_encoders.get_feature_names_out(['Interest_Field']))
        full_input_df = pd.concat([pd.DataFrame([[data['CGPA']]], columns=['CGPA']), encoded_df], axis=1)

        model_features = ['CGPA'] + list(graduate_encoders.get_feature_names_out(['Interest_Field']))
        full_input_df = full_input_df[model_features]

        prediction = graduate_model.predict(full_input_df)
        recommended_job = prediction[0]


        percentage = round((data['CGPA'] / 10) * 100, 1)
        stream = data['Interest_Field'].capitalize()

        advice = generate_advice(percentage, stream)

        return jsonify({'prediction': recommended_job, 'advice': advice})
    except Exception as e:
        print("Error:", str(e))
        return jsonify({'error': str(e)}), 500

def generate_advice(percentage, stream):
    if percentage >= 90:
        advice = (
            f"🎓 Outstanding! You scored {percentage}%. With your interest in {stream}, "
            "you qualify for top-tier government colleges, scholarships, and honors programs. "
            "Consider national institutes or competitive exams."
        )
    elif percentage >= 80:
        advice = (
            f"✅ Great job scoring {percentage}%! You're eligible for {stream} courses in reputed "
            "government and private colleges. Look into entrance exams or scholarships."
        )
    elif percentage >= 70:
        advice = (
            f"👍 Good score of {percentage}%. You can pursue {stream} in several private colleges "
            "and some government institutions. Focus on co-curriculars and building a strong foundation."
        )
    elif percentage >= 60:
        advice = (
            f"🟡 You scored {percentage}%. You are eligible for {stream} in private colleges. "
            "Look into colleges with flexible admission or foundation programs."
        )
    elif percentage >= 50:
        advice = (
            f"🟠 With {percentage}%, {stream} is possible through private institutions. "
            "Also explore diploma programs, vocational training, or certification courses to boost your profile."
        )
    elif percentage >= 40:
        advice = (
            f"🔻 You scored {percentage}%. Consider alternative {stream}-related career paths such as "
            "online courses, skill-based programs, or bridge courses. Practical exposure can help a lot."
        )
    else:
        advice = (
            f"🔴 Your score is {percentage}%. Traditional paths in {stream} may be challenging, "
            "but consider open learning platforms like Coursera, Skill India, creative fields, or internships to grow."
        )

    stream_lower = stream.lower()
    if stream_lower == "science" and percentage >= 85:
        advice += "\n💡 Tip: You can prepare for JEE/NEET or participate in science olympiads."
    elif stream_lower == "commerce" and percentage >= 80:
        advice += "\n📊 Consider CA, CS, or B.Com in top colleges."
    elif stream_lower == "arts" and percentage >= 70:
        advice += "\n🎭 Explore BA programs, language studies, journalism, or design fields."

    return advice

if __name__ == '__main__':
    app.run(port=5002, debug=True)
