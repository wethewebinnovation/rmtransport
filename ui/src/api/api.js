import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/",
  headers: { "Content-Type": "application/json" },
});

export const getCustomers = () => api.get("customers");
export const createCustomer = (data) => api.post("customers", data);
export const updateCustomer = (id, data) => api.put(`customers/${id}`, data);
export const deleteCustomer = (id) => api.delete(`customers/${id}`);

export const getDrivers = () => api.get("drivers");
export const createDriver = (data) => api.post("drivers", data);
export const updateDriver = (id, data) => api.put(`drivers/${id}`, data);
export const deleteDriver = (id) => api.delete(`drivers/${id}`);

export const getLorries = () => api.get("lorries");
export const createLorry = (data) => api.post("lorries", data);
export const updateLorry = (id, data) => api.put(`lorries/${id}`, data);
export const deleteLorry = (id) => api.delete(`lorries/${id}`);

export const getProducts = () => api.get("products");
export const getProductById = (id) => api.get(`products/${id}`);
export const createProduct = (data) => api.post("products", data);
export const updateProduct = (id, data) => api.put(`products/${id}`, data);
export const deleteProduct = (id) => api.delete(`products/${id}`);

export const registerUser = (data) => api.post("users/register", data);
export const getUsers = () => api.get("users");

// LR Bills API
export const getLrBills = (status) => {
  const query = status ? `?status=${status}` : "";
  return api.get(`lrbills${query}`);
};

export const getLrBillById = (id) => api.get(`lrBills/${id}`);
export const createLrBill = (data) => api.post("lrBills", data);
export const updateLrBill = (id, data) => api.put(`lrBills/${id}`, data);
// export const trashLrBill = (id) => api.put(`lrBills/${id}/trash`);
// export const restoreLrBill = (id) => api.put(`lrBills/${id}/restore`);
export const deleteLrBill = (id) => api.delete(`lrBills/${id}`);

// Move bill to trash (soft-delete)
export const trashLrBill = (id) => axios.put(`/api/lrBills/${id}/trash`);
export const restoreLrBill = (id) => axios.put(`/api/lrBills/${id}/restore`);

export const getTrashedBills = () => api.get("lrbills?status=trash");

export default api;
