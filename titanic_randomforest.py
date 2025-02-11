import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import flask

def load_titanic():
    path = "./data/Titanic-Dataset.csv"
    return pd.read_csv(path)

titanic = load_titanic()
print(titanic.info())  # Display dataset information


def preprocess_titanic():
    # Fill missing values
    titanic['Age'].fillna(titanic['Age'].median(), inplace=True)  # Fill missing Age with median
    titanic['Cabin'].fillna('Unknown', inplace=True)  # Fill missing Cabin with 'Unknown'
    titanic['Embarked'].fillna(titanic['Embarked'].mode()[0], inplace=True)  # Fill missing Embarked with mode

    # Convert categorical variables
    titanic['Sex'] = LabelEncoder().fit_transform(titanic['Sex'])  # Convert 'Sex' to 0 (female) and 1 (male)
    titanic['Embarked'] = LabelEncoder().fit_transform(titanic['Embarked'])  # Convert Embarked categories to numbers

    # Drop unnecessary columns
    titanic.drop(['PassengerId', 'Name', 'Ticket', 'Cabin'], axis=1, inplace=True) 
    return titanic

def RandomForest(X_train, y_train):
    # Train a Random Forest model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    return model

# Load and preprocess the dataset
titanic = preprocess_titanic()
print(titanic.head())

# Split into training and testing sets
X = titanic.drop(columns=['Survived'])
y = titanic['Survived']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model = RandomForest(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"\nModel Accuracy: {accuracy:.2f}")

# ---------------- Flask API Integration ----------------
app = flask.Flask(__name__)

@app.route('/predict', methods=['GET'])
def predict():
    try:
        # Example API request: ?Pclass=3&Sex=1&Age=22&SibSp=1&Parch=0&Fare=7.25&Embarked=1
        features = [float(flask.request.args.get(f)) for f in ['Pclass', 'Sex', 'Age', 'SibSp', 'Parch', 'Fare', 'Embarked']]
        prediction = model.predict([features])[0]
        return flask.jsonify({'prediction': int(prediction), 'model': 'Random Forest','model-accuracy': float(accuracy)})  # Convert NumPy int to Python int
    except Exception as e:
        return flask.jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
