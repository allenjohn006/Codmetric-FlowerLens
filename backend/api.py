from fastapi import APIRouter
from pydantic import BaseModel
from models import model_manager

router = APIRouter()

class PredictionRequest(BaseModel):
    sepal_length: float
    sepal_width: float
    petal_length: float
    petal_width: float
    model_type: str = "rf"

@router.get("/eda")
def get_eda():
    return model_manager.get_eda_data()

@router.get("/models")
def get_models_info():
    return model_manager.get_metrics()

@router.post("/predict")
def predict(req: PredictionRequest):
    features = [
        req.sepal_length,
        req.sepal_width,
        req.petal_length,
        req.petal_width
    ]
    return model_manager.predict(features, req.model_type)

@router.get("/scatter-data")
def get_scatter_data():
    # Return all points for decision boundary visualization
    X = model_manager.X
    y = model_manager.y
    target_names = model_manager.target_names
    
    data = []
    for i in range(len(X)):
        data.append({
            "sepal_length": X[i][0],
            "sepal_width": X[i][1],
            "petal_length": X[i][2],
            "petal_width": X[i][3],
            "species": target_names[y[i]],
            "species_index": int(y[i])
        })
    return {"points": data}
