import axios from "axios";

const api = axios.create({
  baseURL: window.APP_DATA.baseUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export async function createOrderWithInvoice(payload) {
  const response = await fetch("/api/clinic/create-order-with-invoice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
}

export const saveCompleteConsultation = async (data) => {
  try {
    const response = await api.post("/api/clinic/save-consultation", data);
    return response;
  } catch (error) {
    console.error("Error saving complete consultation:", error);
    throw error;
  }
};

export default { createOrderWithInvoice, saveCompleteConsultation };
