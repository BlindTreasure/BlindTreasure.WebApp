import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from "@/utils/local-storage";
import axios, { AxiosError } from "axios";
import { refreshToken } from "@/services/auth/api-services";
import useToast from "@/hooks/use-toast";
import useLogout from "@/hooks/use-logout";

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshTokenPromise: any = null;

const errorHandler = async (error: AxiosError) => {
  const responseMeta: TMeta = error.response?.data as TMeta;
  const { addToast } = useToast();
  if (!error?.response) {
    const result: TMeta = {
      detail: "Network not available!",
      errorCode: "NetWork_503",
      status: 503,
      title: "Network not available!",
    };
    addToast({
      type: "error",
      description: result.detail,
      duration: 5000,
    });
    return Promise.reject(result);
  } else {
    switch (responseMeta.errorCode) {
      case "auth_forgot_01":
        addToast({
          type: "error",
          description: responseMeta.detail,
          duration: 5000,
        });
        break;
      case "account_ban_01":
        addToast({
          type: "error",
          description: responseMeta.detail,
          duration: 5000,
        });
        useLogout().handleLogout();
        break;
      default:
        break;
    }
  }

  if (error?.response?.status === 403) {
    const result: TMeta = {
      detail: "Not permission",
      errorCode: "Forbident",
      status: 403,
      title: "Not permission",
    };
    addToast({
      type: "error",
      description: "Sorry, you do not permission",
      duration: 5000,
    });
    return Promise.reject(result);
  }

  if (error?.response?.status === 404) {
    const result: TMeta = {
      detail: "Not found",
      errorCode: "NotFound",
      status: 404,
      title: "Not found",
    };
    addToast({
      type: "error",
      description: "Không tìm thấy tài nguyên",
      duration: 5000,
    });
    location.href = "/404";
    return Promise.reject(result);
  }

  if (error.response?.status === 401 && error?.config &&
    !error.config.url?.includes("/auth/logout") &&
    !error.config.url?.includes("/auth/login")) {

    if (!refreshTokenPromise) {
      const storedRefreshToken = getStorageItem("refreshToken") || "";
      refreshTokenPromise = refreshToken({ refreshToken: storedRefreshToken })
        .then((res: any) => {
          const accessTokenRaw = res?.value?.data?.accessToken;
          const refreshTokenRaw = res?.value?.data?.refreshToken;
          setStorageItem("accessToken", accessTokenRaw);
          setStorageItem("refreshToken", refreshTokenRaw);
        })
        .catch((err: any) => {
          removeStorageItem("accessToken");
          removeStorageItem("refreshToken");
          location.href = "/login";
          return Promise.reject(err);
        })
        .finally(() => {
          refreshTokenPromise = null;
        });
    }

    return refreshTokenPromise.then(() => {
      const originalRequest = error.config;
      if (!originalRequest) {
        return Promise.reject(error);
      }
      originalRequest.headers.Authorization = `Bearer ${getStorageItem("accessToken")}`;
      return request(originalRequest);
    });
  }

  return Promise.reject(responseMeta);
};

// request.interceptors.request.use(
//   (config) => {

//     if (config.url?.includes("/auth/logout")) {
//       return config;
//     }

//     const token = getStorageItem("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

request.interceptors.request.use(
  async (config) => {
    // Không xử lý auth API
    if (config.url?.includes("/auth/login") || config.url?.includes("/auth/refresh")) {
      return config;
    }

    let token = getStorageItem("accessToken");
    const refresh = getStorageItem("refreshToken");

    // Nếu không có accessToken nhưng có refreshToken → refresh ngay
    if (!token && refresh) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshToken({ refreshToken: refresh })
          .then((res: any) => {
            const accessTokenRaw = res?.value?.data?.accessToken;
            const refreshTokenRaw = res?.value?.data?.refreshToken;
            setStorageItem("accessToken", accessTokenRaw);
            setStorageItem("refreshToken", refreshTokenRaw);
            return accessTokenRaw;
          })
          .catch((err: any) => {
            removeStorageItem("accessToken");
            removeStorageItem("refreshToken");
            location.href = "/login";
            return Promise.reject(err);
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }

      token = await refreshTokenPromise;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return errorHandler(error);
  }
);

export default request;
