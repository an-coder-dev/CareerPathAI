import sys
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

def train_and_save_model(dataset_file, model_file):
    df = pd.read_csv(dataset_file)
    print(f"📝 Columns: {list(df.columns)}")

    X = df.drop(columns=["Output"])
    y = df["Output"]

    # Encode categorical columns
    label_encoders = {}
    for col in X.select_dtypes(include=["object"]).columns:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col])
        label_encoders[col] = le

    # Encode target labels
    output_encoder = LabelEncoder()
    y = output_encoder.fit_transform(y)
    label_encoders["Output"] = output_encoder

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train Random Forest
    model = RandomForestClassifier(n_estimators=5, max_depth=10, n_jobs=1, random_state=42)

    model.fit(X_train, y_train)

    # Save model and encoders
    model_data = {"model": model, "encoder": label_encoders}
    with open(model_file, 'wb') as f:
        pickle.dump(model_data, f)

    print(f"✅ Model & encoders saved for: {dataset_file}\n")

# Entry point
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python train_model.py [10th|12th|graduate]")
        sys.exit(1)

    education_level = sys.argv[1].lower()

    file_map = {
        "10th": ("10thstudent_dataset.csv", "10th_career_model.pkl"),
        "12th": ("12thstudent_dataset.csv", "12th_career_model.pkl"),
        "graduate": ("Graduatedcareer_dataset.csv", "graduate_career_model.pkl")
    }

    if education_level in file_map:
        dataset_file, model_file = file_map[education_level]
        train_and_save_model(dataset_file, model_file)
    else:
        print("❌ Invalid option! Choose from [10th, 12th, graduate].")
