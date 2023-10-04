import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { handleError } from "../shared/error";
import { prisma } from "../shared/prisma";

interface HttpResponse {
  status: number;
  body: string;
  headers?: Record<string, string>;
}

const GetDeviations: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<HttpResponse> {
  try {
    const deviations = await prisma.deviation.findMany({
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
      body: JSON.stringify(deviations),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    return handleError(500, "Failed to list deviations", error);
  } finally {
    await prisma.$disconnect();
  }
};

export default GetDeviations;
