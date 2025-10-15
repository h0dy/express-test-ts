export const envOrErr = (key: string) => {
  const envVariable = process.env[key];
  if (envVariable == undefined) {
    throw new Error(`$Environment variable ${key} is not set`);
  }
  return envVariable;
};
