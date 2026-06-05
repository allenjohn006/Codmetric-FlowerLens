import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export const fetchEDA = async () => {
  const res = await axios.get(`${API_URL}/eda`);
  return res.data;
};

export const fetchModelsInfo = async () => {
  const res = await axios.get(`${API_URL}/models`);
  return res.data;
};

export const fetchScatterData = async () => {
  const res = await axios.get(`${API_URL}/scatter-data`);
  return res.data;
};

export const predictSpecies = async (features, modelType = 'rf') => {
  const res = await axios.post(`${API_URL}/predict`, {
    sepal_length: features.sepalLength,
    sepal_width: features.sepalWidth,
    petal_length: features.petalLength,
    petal_width: features.petalWidth,
    model_type: modelType
  });
  return res.data;
};
