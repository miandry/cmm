import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { buildQueryParams } from "../../utils/queryBuilder";

export const useUserStore = defineStore("user", () => {
  const users = ref({ rows: [], total: 0 });
  const user = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function createUser(newUserData) {
    try {
      // Implement the logic to create a new user using an API call
      const response = await axios.post("/crud/create_user", newUserData);
      console.log("User created successfully:", response.data);
      if (response.data.status == false) {
        error.value = response.data.error;
      } else {
        error.value = null; // Clear any previous errors
      }
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchUsers(options) {
    try {
      // Implement the logic to fetch users using an API call
      const query = buildQueryParams(options);
      // Use the new list endpoint which supports filters/sort/pager
      const response = await axios.get(`/api/v2/users/list?${query}`);
      // API returns { rows: [...], total: n }
      users.value = response.data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  return {
    users,
    user,
    loading,
    error,
    createUser,
    fetchUsers
  };
});
