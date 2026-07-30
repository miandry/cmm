import axios from "axios";

const api = axios.create({
  baseURL: window.APP_DATA.baseUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export function getInvoiceHeader() {
  return api.get("/api/clinic/invoice-header");
}

export function saveInvoiceHeader(data) {
  return api.post("/api/clinic/invoice-header", data);
}

export const defaultInvoiceHeader = {
  ville: "Antananarivo",
  nom: "Pharmacie / Centre Médical Test Santé",
  titre: "Facturation et Paiements",
  centre: "VENTE PHARMACEUTIQUE",
  adresse: "45 Avenue de l'Indépendance",
  contact: "032 12 345 67 – 034 98 765 43",
  immat: "NIF: 12345 678 90 / STAT: 98765 43 2024 0 00001",
};
