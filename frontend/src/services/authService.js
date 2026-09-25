import api from "../lib/axios";

export const loginUser = (data) =>
  api.post("/auth/login", data).then((r) => r.data);

export const registerUser = (data) =>
  api.post("/auth/register", data).then((r) => r.data);

export const fetchMe = () =>
  api.get("/auth/me").then((r) => r.data.user);
