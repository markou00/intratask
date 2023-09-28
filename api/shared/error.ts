export const handleError = (status: number, message: string) => ({
  status,
  body: message,
});
