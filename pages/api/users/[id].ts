import prisma from "lib/prisma"; // Adjust the path based on your setup
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = req.query.id;

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId as string,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch user" });
    }
  } else if (req.method === "PUT") {
    const { ...data } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId as string },
        data,
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ error: "Failed to update user" });
    }
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
}
