import requests
import flask
from flask import request, jsonify
from collections import defaultdict

app = flask.Flask(__name__)

# List of model API endpoints
MODEL_ENDPOINTS = [
    "http://localhost:5000/predict",  # Random Forest
    "http://localhost:5002/predict",  # Logistic Regression
    "http://localhost:5003/predict",  # SVM
]
model_weights = {"Random Forest": 0.5, "Logistic Regression": 0.5, "SVM": 0.5}  
# Weight adjustment parameters
LEARNING_RATE = 0.05  # Small changes per batch to stabilize weights

def get_predictions(params):
    predictions = []
    
    for endpoint in MODEL_ENDPOINTS:
        try:
            response = requests.get(endpoint, params=params)
            if response.status_code == 200:
                data = response.json()
                predictions.append({
                    "prediction": data.get("prediction"),
                    "model": data.get("model"),
                    "accuracy": data.get("model-accuracy")
                })
                model_weights[data.get("model")] = data.get("model-accuracy", 0.5)
            else:
                print(f"Error: Model at {endpoint} returned status {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"Error: Could not reach model at {endpoint} - {e}")

    return predictions

def weighted_majority_voting(predictions):
    weighted_votes = defaultdict(float)
    
    for pred in predictions:
        prediction = pred["prediction"]
        model = pred["model"]
        weight = model_weights.get(model, 0.5)  # Default weight if not found
        weighted_votes[prediction] += weight

    # Get the prediction with the highest weighted score
    consensus_prediction = max(weighted_votes, key=weighted_votes.get)
    return consensus_prediction

def update_weights(predictions, consensus_prediction):
    """
    Adjusts model weights based on agreement with the consensus.
    - Increase weight if model agrees with consensus.
    - Decrease weight if model disagrees.
    """

    for pred in predictions:
        model = pred["model"]
        model_prediction = pred["prediction"]

        if model_prediction == consensus_prediction:
            model_weights[model] = min(1.0, model_weights[model] + LEARNING_RATE)  # Cap at 1.0
        else:
            model_weights[model] = max(0.0, model_weights[model] - LEARNING_RATE)  # Lower bound 0.0

@app.route('/predict', methods=['GET'])
def consensus_predict():
    try:
        # Get query parameters from request
        params = request.args.to_dict()
        
        # Get predictions from all models
        predictions = get_predictions(params)
        
        if not predictions:
            return jsonify({"error": "No predictions received"}), 500
        
        # Compute the weighted consensus prediction
        consensus_prediction = weighted_majority_voting(predictions)

        # Update model weights based on agreement with consensus
        update_weights(predictions, consensus_prediction)

        return jsonify({
            "consensus_prediction": consensus_prediction,
            "individual_predictions": predictions,
            "updated_weights": model_weights
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005, debug=True)
