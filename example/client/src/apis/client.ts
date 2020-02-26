import axios, { AxiosPromise } from "axios";
import accessToken from "./accessToken";

type Verbs = "get" | "post" | "put" | "patch" | "delete";
interface Payload {
  data?: Record<string, any>;
  headers?: Record<string, any>;
}
interface Client {
  auth: boolean;
  withAuth: () => this;
  withoutAuth: () => this;
  get: <T>(url: string, p?: Payload) => AxiosPromise<T>;
  post: <T>(url: string, p?: Payload) => AxiosPromise<T>;
  put: <T>(url: string, p?: Payload) => AxiosPromise<T>;
  patch: <T>(url: string, p?: Payload) => AxiosPromise<T>;
  delete: <T>(url: string, p?: Payload) => AxiosPromise<T>;
  request: <T>(
    method: Verbs,
    url: string,
    p?: Payload
  ) => AxiosPromise<T>;
}

function request<T>(
  client: Client,
  verb: Verbs,
  url: string,
  data: Record<string, any>,
  headers: Record<string, any>
): AxiosPromise<T> {
  return new Promise((resolve, reject) => {
    const authorizedHeader = client.auth
      ? Object.assign(
          {},
          { Authorization: "Bearer " + accessToken.get() },
          headers
        )
      : headers;
    const request =
      verb === "get"
        ? () =>
            axios({
              method: verb,
              url,
              params: data,
              headers: authorizedHeader
            })
        : () => axios({ method: verb, url, data, headers: authorizedHeader });
    return request().then(
      res => {
        // server retrieval success
        client.auth = false;
        resolve(res);
      },
      error => {
        // server retrieval failure
        client.auth = false;
        reject(error);
      }
    );
  });
}

const client: Client = {
  auth: false,
  withAuth() {
    this.auth = true;
    return this;
  },
  withoutAuth() {
    this.auth = false;
    return this;
  },
  get<T>(url: string, p?: Payload) {
    return this.request<T>("get", url, p);
  },
  post<T>(url: string, p?: Payload) {
    return this.request<T>("post", url, p);
  },
  patch<T>(url: string, p?: Payload) {
    return this.request<T>("patch", url, p);
  },
  put<T>(url: string, p?: Payload) {
    return this.request<T>("put", url, p);
  },
  delete<T>(url: string, p?: Payload) {
    return this.request<T>("delete", url, p);
  },
  request<T>(method: Verbs, url: string, p?: Payload) {
    return request<T>(
      this,
      method,
      url,
      (p && p.data) || {},
      (p && p.headers) || {}
    );
  }
};

export default client;
