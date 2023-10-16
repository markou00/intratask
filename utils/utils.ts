export const getDeviationDate = (date: Date) =>
  new Date(date).toLocaleDateString("NO");

export async function getTenantUsers() {
  const response = await fetch("/api/get-tenant-users");

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();

  return data;
}
