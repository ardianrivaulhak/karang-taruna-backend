export const envParams = (key = "", defaultValue = "") => {
  if (key) return process.env[key] ? process.env[key] : defaultValue;
  return process.env.ENV;
};
