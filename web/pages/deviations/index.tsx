import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import Layout from "components/layout/Layout";
import Deviations from "components/pages/Deviations/Deviations";
import Welcome from "components/pages/Welcome";

export default function IndexPage() {
  return (
    <>
      <AuthenticatedTemplate>
        <Layout />
        <Deviations />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Welcome />
      </UnauthenticatedTemplate>
    </>
  );
}
