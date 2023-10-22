import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma"; // Adjust the path based on where your prisma instance is located

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).end(); // Method Not Allowed
    }

    // Ensure there's a body and required fields
    if (
      !req.body ||
      !req.body.creator ||
      !req.body.category ||
      !req.body.title ||
      !req.body.description ||
      !req.body.status ||
      !req.body.priority
    ) {
      return res
        .status(400)
        .json({
          message: "Invalid input. Ensure all required fields are provided.",
        });
    }

    // Extract deviation fields
    const {
      creator,
      category,
      title,
      description,
      status,
      assigneeId,
      solution,
      isSolved,
      solvedBy,
      progress,
      priority,
    } = req.body;

    // Create a new deviation
    const newDeviation = await prisma.deviation.create({
      data: {
        creator,
        category,
        title,
        description,
        status,
        assigneeId,
        solution,
        isSolved,
        solvedBy,
        progress,
        priority,
      },
    });

    res.status(201).json(newDeviation); // 201 indicates resource creation
  } catch (error) {
    res.status(500).json({ error: "Failed to create deviation" });
  } finally {
    await prisma.$disconnect();
  }
}
