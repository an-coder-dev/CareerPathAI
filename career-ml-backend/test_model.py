import pickle
import numpy as np

def load_model_and_encoders(education_level):
    model_path = f"{education_level.lower()}_career_model.pkl"
    try:
        with open(model_path, "rb") as file:
            model_data = pickle.load(file)
            model = model_data['model']
            encoders = model_data['encoder']
        return model, encoders
    except FileNotFoundError:
        print(f"❌ Model file for {education_level} not found.")
        return None, None

def predict_career(education_level, secure_marks=None, total_marks=None, interest_field=None, secure_cgpa=None):
    education_level = education_level.capitalize()
    model, encoders = load_model_and_encoders(education_level)

    if not model or not encoders:
        return "❌ Error: Model or encoders not found."

    stream = interest_field.capitalize()

    if education_level == "Graduate":
        percentage = round((secure_cgpa / 10) * 100, 1)
        input_data = np.array([[secure_cgpa, encoders["Interest Field"].transform([interest_field])[0]]])
    else:
        percentage = round((secure_marks / total_marks) * 100, 1)
        try:
            interest_field_encoded = encoders["Interest Field"].transform([interest_field])[0]
        except:
            return "❌ Invalid interest field."
        input_data = np.array([[secure_marks, total_marks, interest_field_encoded]])

    # Predict (optional – for future ML enhancement)
    _ = model.predict(input_data)

    # 🎓 Generate flexible, accurate advice
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

    if education_level == "Graduate":
      if percentage >= 90:
        advice = (
            f"🎓 Excellent CGPA of {percentage}%. With interest in {interest_field.title()}, "
            "you're eligible for top PG programs, certifications or internships in that field."
        )
      elif percentage >= 70:
        advice = (
            f"👍 Good CGPA of {percentage}%. You can pursue higher studies or entry-level roles in {interest_field.title()}."
        )
      elif percentage >= 50:
        advice = (
            f"🟡 You scored {percentage}%. Consider certifications or online courses in {interest_field.title()} to boost your skills."
        )
      else:
        advice = (
            f"🔴 With CGPA {percentage}%, traditional PG options may be limited. Explore self-paced learning, freelancing, or internships in {interest_field.title()}."
        )
    

    # 🔍 Optional stream-specific tip
    stream_lower = stream.lower()
    if stream_lower == "science" and percentage >= 85:
        advice += "\n💡 Tip: You can prepare for JEE/NEET or participate in science olympiads."
    elif stream_lower == "commerce" and percentage >= 80:
        advice += "\n📊 Consider CA, CS, or B.Com in top colleges."
    elif stream_lower == "arts" and percentage >= 70:
        advice += "\n🎭 Explore BA programs, language studies, journalism, or design fields."

    return advice


if __name__ == "__main__":
    education_level = input("Enter education level (10th / 12th / Graduate): ").strip().lower()

    if education_level == "graduate":
        secure_cgpa = float(input("Enter secure CGPA (out of 10): "))
        interest_field = input("Enter interest field: ").strip()
        result = predict_career(education_level, secure_cgpa=secure_cgpa, interest_field=interest_field)
    elif education_level in ["10th", "12th"]:
        secure_marks = float(input("Enter secure marks: "))
        total_marks = float(input("Enter total marks: "))
        interest_field = input("Enter interest field: ").strip()
        result = predict_career(education_level, secure_marks=secure_marks, total_marks=total_marks, interest_field=interest_field)
    else:
        result = "❌ Invalid education level!"

    print(f"\n🎯 Predicted Career Path: {result}")
