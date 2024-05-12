import Image from "next/image";
import { Inter } from "next/font/google";
import { Fragment } from "react";
import Link from "next/link";
import Layout from "@/components/layout/layout";
import TopBar from "@/components/layout/topbar";

const RecipeTypePage = () => {
  return (
    <Fragment>
      <Layout>
        <TopBar />
        <div>Testing</div>
      </Layout>
    </Fragment>
  )
}

export default RecipeTypePage;