import type { ReactElement } from "react";
import type { NextPageWithLayout } from "./_app";
import Layout from "@/layouts/main";
const Home: NextPageWithLayout = (props) => {
  return <div>me</div>;
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
