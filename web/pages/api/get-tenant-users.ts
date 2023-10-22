// pages/api/users.js
import { ConfidentialClientApplication } from "@azure/msal-node";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

// MSAL configuration
const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_AD_APPLICATION_ID!,
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_AD_DIRECTORY_ID}`,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
  },
};

// Create a new instance of MSAL
const cca = new ConfidentialClientApplication(msalConfig);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Acquire a token for Microsoft Graph API
    const response = await cca.acquireTokenByClientCredential({
      scopes: ["https://graph.microsoft.com/.default"],
    });

    const token = response?.accessToken;

    // Fetch users from Microsoft Graph API
    const usersResponse = await axios.get(
      "https://graph.microsoft.com/v1.0/users",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const users = usersResponse.data.value;

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
}
