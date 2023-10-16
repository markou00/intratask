// pages/api/user-photo/[id].js
import { ConfidentialClientApplication } from "@azure/msal-node";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_AD_APPLICATION_ID!,
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_AD_DIRECTORY_ID}`,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
  },
};

const cca = new ConfidentialClientApplication(msalConfig);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = req.query.id;

  try {
    const response = await cca.acquireTokenByClientCredential({
      scopes: ["https://graph.microsoft.com/.default"],
    });

    const token = response?.accessToken;

    const graphResponse = await axios.get(
      `https://graph.microsoft.com/v1.0/users/${userId}/photo/$value`,
      {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.setHeader("Content-Type", "image/jpeg");
    res.status(200).send(graphResponse.data);
  } catch (error: any) {
    // Check if the error response is 404
    if (error.response && error.response.status === 404) {
      res.status(404).json({ message: "Profile photo not found." });
      return;
    }
    res.status(500).json({ error: "Failed to fetch user profile photo." });
  }
}
