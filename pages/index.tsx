import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import Layout from "components/layout/Layout";
import Dashboard from "components/pages/Dashboard/Dashboard";
import Welcome from "components/pages/Welcome";
import { FilterProvider } from "contexts/FilterContext";

export default function IndexPage() {
  return (
    <>
      <AuthenticatedTemplate>
        <Layout />
        <FilterProvider>
          <Dashboard />
        </FilterProvider>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Welcome />
      </UnauthenticatedTemplate>
    </>
  );
}
