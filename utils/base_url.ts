export const checkEnvironment = (): string => {
  // function to change the base url depending on the environment
  let baseUrl: string;

  if (process.env.NODE_ENV === "development") {
    baseUrl = "http://localhost:1234";
  } else {
    baseUrl = "https://example.com";
  }

  return baseUrl;
};
