export const handleError = (
  status: number,
  message: string,
  logError?: any
) => {
  if (logError) {
    console.error(logError);
  }

  let responseBody = message;

  if (status >= 500) {
    responseBody = "Internal Server Error";
  }

  return {
    status,
    body: JSON.stringify({
      error: true,
      message: responseBody,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
