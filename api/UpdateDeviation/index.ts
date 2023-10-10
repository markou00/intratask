import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { handleError } from "../shared/error";
import { prisma } from "../shared/prisma";

interface HttpResponse {
  status: number;
  body: string;
  headers?: Record<string, string>;
}

const UpdateDeviation: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<HttpResponse> {
  try {
    const id = req.params.id;
    const updateData = req.body;

    if (!id) {
      return {
        status: 400,
        body: JSON.stringify({
          message: "ID is required for updating a deviation.",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    const updatedDeviation = await prisma.deviation.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        tickets: {
          include: {
            tags: true,
          },
        },
      },
    });

    return {
      status: 200,
      body: JSON.stringify(updatedDeviation),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    return handleError(500, "Failed to update deviation", error);
  } finally {
    await prisma.$disconnect();
  }
};

export default UpdateDeviation;
