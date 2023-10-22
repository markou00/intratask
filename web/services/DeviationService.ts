import { Deviation } from "@prisma/client";
import { DeviationWithTickets } from "../types/db";

export async function createDeviation(deviationData: Partial<Deviation>) {
  const response = await fetch("/api/create-deviation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(deviationData),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();

  return data;
}

export async function getDeviations() {
  const response = await fetch("/api/get-deviations");

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data: DeviationWithTickets[] = await response.json();

  return data;
}

export async function updateDeviation(
  deviationId: number,
  devationData: Partial<DeviationWithTickets>
) {
  const response = await fetch(`/api/update-deviation?id=${deviationId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(devationData),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}
