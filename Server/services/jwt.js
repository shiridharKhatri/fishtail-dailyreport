import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const createJwt = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
};

export const verifyJwt = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};
