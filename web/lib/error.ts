import { NextApiResponse } from "next";

export const handleError = (
  res: NextApiResponse,
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

  res.status(status).json({
    error: true,
    message: responseBody,
  });
};
