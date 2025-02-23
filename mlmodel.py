import pandas as pd
import numpy as np
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Sample mood dataset (expand with real data)
data = {
    "text": [
        "I am so happy today!", "Feeling amazing and joyful!", "Super excited about my trip!",
        "I feel so down and lonely.", "Feeling really sad and lost.", "This is the worst day ever!",
        "I have so much energy!", "Pumped up and ready to go!", "Let's hit the gym and work hard!",
        "Just want to relax and chill.", "Feeling peaceful and calm.", "A slow and soothing evening."
    ],
    "mood": ["happy", "happy", "happy", "sad", "sad", "sad", "energetic", "energetic", "energetic", "relaxed", "relaxed", "relaxed"]
}

# Convert to DataFrame
df = pd.DataFrame(data)

# Split data
X_train, X_test, y_train, y_test = train_test_split(df["text"], df["mood"], test_size=0.2, random_state=42)

# Create a pipeline with TF-IDF and Naive Bayes model
model = make_pipeline(TfidfVectorizer(), MultinomialNB())
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy:.2f}")

# Save the model
joblib.dump(model, "mood_classifier.pkl")

def predict_mood(text):
    loaded_model = joblib.load("mood_classifier.pkl")
    return loaded_model.predict([text])[0]

# Example Usage
user_input = "I'm feeling very excited today!"
print("Predicted Mood:", predict_mood(user_input))
import pandas as pd
import numpy as np
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Sample mood dataset (expand with real data)
data = {
    "text": [
        "I am so happy today!", "Feeling amazing and joyful!", "Super excited about my trip!",
        "I feel so down and lonely.", "Feeling really sad and lost.", "This is the worst day ever!",
        "I have so much energy!", "Pumped up and ready to go!", "Let's hit the gym and work hard!",
        "Just want to relax and chill.", "Feeling peaceful and calm.", "A slow and soothing evening."
    ],
    "mood": ["happy", "happy", "happy", "sad", "sad", "sad", "energetic", "energetic", "energetic", "relaxed", "relaxed", "relaxed"]
}

# Convert to DataFrame
df = pd.DataFrame(data)

# Split data
X_train, X_test, y_train, y_test = train_test_split(df["text"], df["mood"], test_size=0.2, random_state=42)

# Create a pipeline with TF-IDF and Naive Bayes model
model = make_pipeline(TfidfVectorizer(), MultinomialNB())
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy:.2f}")

# Save the model
joblib.dump(model, "mood_classifier.pkl")

def predict_mood(text):
    loaded_model = joblib.load("mood_classifier.pkl")
    return loaded_model.predict([text])[0]

# Example Usage
user_input = "I'm feeling very excited today!"
print("Predicted Mood:", predict_mood(user_input))
