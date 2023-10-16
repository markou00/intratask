import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma"; // Adjust the path based on where your prisma instance is located

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).end(); // Method Not Allowed
    }

    const deviations = await prisma.deviation.findMany({
      include: {
        tickets: {
          include: {
            tags: true,
          },
        },
      },
    });

    // Convert Date objects to strings
    const serializedDeviations = deviations.map((deviation) => ({
      ...deviation,
      createdAt: deviation.createdAt.toISOString(),
      updatedAt: deviation.updatedAt.toISOString(),
    }));

    res.status(200).json(serializedDeviations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch deviations" });
  }
}
