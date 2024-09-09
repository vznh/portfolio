// pages/index.tsx
import { HomeView } from "@/views";
import Head from "next/head";
import type { NextPage } from 'next';
import { cn } from "@/utils";

const HomePage: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Jason Son</title>
      </Head>
      <HomeView />
    </div>
  );
}

export default HomePage;
