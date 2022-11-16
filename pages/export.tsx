import Head from "next/head";
import Header from "../components/Header";
import {getCars, getTracks, getDrivers, getRecords, getCar} from "../lib/race-recorder/data-store";
import { Driver, Record, Track } from "../types/types";

type ExportPageProps = {
  title: string,
  drivers: Driver[],
  tracks: Track[],
  recors: Record[]
}


export default function ExportPage({ title }:ExportPageProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Header></Header>

      <main className="container">
        <h1>{title}</h1>


      </main>
    </>
  )
}

export async function getStaticProps() {
  
  const drivers = await getDrivers();
  const cars = await getCars();
  const records = await getRecords();

  return {
    props: {
      title: 'Datan ulosvienti',
      drivers,
      cars,
      records
    },
  };
}