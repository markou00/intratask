import prisma from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function createUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { id, name } = req.body;

    try {
      const newUser = await prisma.user.create({
        data: {
          id,
          name,
        },
      });

      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create user" });
    }
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
}
