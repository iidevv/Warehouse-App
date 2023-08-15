import axios from "axios";

export const lsInstance = axios.create({
  baseURL: "https://www.wixapis.com/stores/v1/",
  headers: {
    Authorization: "",
    "content-type": "application/json",
  },
});

async function refreshToken() {
  const response = await axios.get(
    "https://www.ls2usa.com/_api/v2/dynamicmodel"
  );
  return response.data.apps["1380b703-ce81-ff05-f115-39571d94dfcd"].instance;
}

lsInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Проверяем ответ на 401 ошибку и что запрос еще не повторялся
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Получаем новый токен
      const newToken = await refreshToken();
      lsInstance.defaults.headers["Authorization"] = newToken;

      // Устанавливаем новый токен в исходный запрос
      originalRequest.headers["Authorization"] = newToken;

      // Повторяем исходный запрос с новым токеном
      return lsInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);
