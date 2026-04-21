import axios from "axios";
import { toast } from "vue-sonner";

const api = axios.create({
  baseURL: window.APP_DATA.baseUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const saveCompleteConsultation = async (data) => {
  try {
    const response = await api.post("/api/clinic/save-consultation", data);
    return response;
  } catch (error) {
    console.error("Error saving complete consultation:", error);
    throw error;
  }
};
