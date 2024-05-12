import { Fragment } from "react";
import withAuth from "@/middleware/withAuth";
import Layout from "@/components/layout/layout";

const Home = () => {
  return (
    <Fragment>
      <Layout>
        <h1>Home</h1>
      </Layout>
    </Fragment>
  );
}

export default withAuth(Home, { isAdminRequired: false });