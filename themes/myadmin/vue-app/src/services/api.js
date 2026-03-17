import axios from "axios";
import { toast } from "vue-sonner";
import { router } from "../main.js"; // ← Import du router Vue

const api = axios.create({
  baseURL: window.APP_DATA.baseUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true, // ← Envoie les cookies automatiquement
});

// Intercepteur pour gérer les erreurs 401 (non authentifié)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Afficher UNIQUEMENT un toast, PAS de redirection automatique
      toast.error("Votre session a expiré. Veuillez vous reconnecter.", {
        action: {
          label: 'Se connecter',
          onClick: () => {
            // Redirection avec Vue Router (pas de rechargement de page)
            router.push('/login');
          }
        }
      });
      
      console.warn("Session expirée - Action non autorisée");
    }
    return Promise.reject(error);
  }
);

// /api/v2/[entity]/[content_type]

export function getListUser(parameters = null) {
  let path = "/api/v2/users";
  if (parameters) {
    path = path + "&" + parameters;
  }
  return api.get(path);
}

export function getLists(entity, content_type, parameters = null) {
  let path = "/api/v2/" + entity + "/" + content_type;
  if (parameters) {
    path = path + "?" + parameters;
  }
  return api.get(path);
}

export function getDetails(entity, content_type, id, parameters = null) {
  let path = "/api/v2/" + entity + "/" + content_type + "/" + id;
  if (parameters) {
    path = path + "?" + parameters;
  }
  return api.get(path);
}

export function saveItem(newItem) {
  let path = "/crud/save";
  return api.post(path, newItem);
}

export function deleteItem(entity, id) {
  let path = `/confirm/${entity}/${id}/delete`;
  return api.get(path);
}
