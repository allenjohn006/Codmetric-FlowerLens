import numpy as np
import pandas as pd
from sklearn.datasets import load_iris
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.model_selection import train_test_split

class IrisModelManager:
    def __init__(self):
        self.iris = load_iris()
        self.X = self.iris.data
        self.y = self.iris.target
        self.feature_names = self.iris.feature_names
        self.target_names = self.iris.target_names
        
        # We will split data for metric computation
        X_train, X_test, y_train, y_test = train_test_split(self.X, self.y, test_size=0.2, random_state=42)
        self.X_test = X_test
        self.y_test = y_test
        
        # Initialize models
        self.models = {
            "svm": SVC(probability=True, random_state=42),
            "knn": KNeighborsClassifier(),
            "rf": RandomForestClassifier(random_state=42),
            "dt": DecisionTreeClassifier(random_state=42)
        }
        
        self.metrics = {}
        
        # Train and evaluate all models
        for name, model in self.models.items():
            model.fit(X_train, y_train)
            
            # Re-train on all data for better predictions, but calculate metrics on test set
            y_pred = model.predict(X_test)
            self.metrics[name] = {
                "accuracy": accuracy_score(y_test, y_pred),
                "precision": precision_score(y_test, y_pred, average='weighted'),
                "recall": recall_score(y_test, y_pred, average='weighted'),
                "f1": f1_score(y_test, y_pred, average='weighted')
            }
            
            # Train on full data for actual serving
            model.fit(self.X, self.y)

    def get_eda_data(self):
        df = pd.DataFrame(self.X, columns=self.feature_names)
        df['species'] = [self.target_names[i] for i in self.y]
        
        # Correlation matrix
        corr = df.drop('species', axis=1).corr().to_dict()
        
        return {
            "features": df.drop('species', axis=1).to_dict(orient='list'),
            "species": df['species'].tolist(),
            "correlation": corr,
            "feature_names": self.feature_names,
            "target_names": self.target_names.tolist()
        }

    def predict(self, features: list, model_name: str = "rf"):
        if model_name not in self.models:
            model_name = "rf"
            
        model = self.models[model_name]
        pred = model.predict([features])[0]
        probs = model.predict_proba([features])[0]
        
        feature_importance = None
        if model_name in ["rf", "dt"]:
            importances = model.feature_importances_
            feature_importance = {name: float(val) for name, val in zip(self.feature_names, importances)}
        
        return {
            "prediction": self.target_names[pred],
            "prediction_index": int(pred),
            "probabilities": {self.target_names[i]: float(probs[i]) for i in range(len(self.target_names))},
            "feature_importance": feature_importance
        }
        
    def get_metrics(self):
        return self.metrics

# Global instance to be imported by api.py
model_manager = IrisModelManager()
