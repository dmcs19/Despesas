import axios from "axios";

const API_URL = "http://localhost:5093/api/despesas";

export const getDespesas = () => axios.get(API_URL);
export const getDespesa = (id) => axios.get(`${API_URL}/${id}`);
export const createDespesa = (data) => axios.post(API_URL, data);
export const updateDespesa = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteDespesa = (id) => axios.delete(`${API_URL}/${id}`);
