import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { handleError } from "../shared/error";
import { prisma } from "../shared/prisma";

interface HttpResponse {
  status: number;
  body: string;
  headers?: Record<string, string>;
}

const CreateDeviation: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<HttpResponse> {
  try {
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
      return {
        status: 400,
        body: "Invalid input. Ensure all required fields are provided.",
        headers: {
          "Content-Type": "application/json",
        },
      };
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

    return {
      status: 201, // 201 indicates resource creation
      body: JSON.stringify(newDeviation),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    return handleError(500, "Failed to create deviation", error);
  } finally {
    await prisma.$disconnect();
  }
};

export default CreateDeviation;
