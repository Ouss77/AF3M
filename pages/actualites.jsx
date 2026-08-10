"use client";
import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "@/components/Context/LanguageContext";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion"; // ✅ Import Framer Motion
import { fetchActualites } from "@/utils/actualitesUtils";

export default function AllActualites() {  
  const [actualites, setActualites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { language } = useContext(LanguageContext);
  
  useEffect(() => {
    fetchActualites(setActualites, setLoading , setError);

  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-10">Error: {error}</div>;
  }

  return (
    <>
      <Head>
        <title>All News - AF3M</title>
        <meta name="description" content="Explore all the latest news and updates from AF3M." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="All News - AF3M" />
        <meta property="og:description" content="Discover the most recent articles, events, and activities related to AF3M." />
        <meta property="og:image" content="https://af3m-assoc.org/wp-content/uploads/2022/10/Capture-de%CC%81cran-2022-10-06-a%CC%80-10.09.14.png" />
        <meta property="og:url" content="https://af3m-assoc.org/all-news" />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://af3m-assoc.org/wp-content/uploads/2022/10/Capture-de%CC%81cran-2022-10-06-a%CC%80-10.09.14.png" />
      </Head>

      <div className="container w-10/12 mx-auto px-4 py-10 pt-40">
        <h1 className="text-3xl text-yellow-600 font-bold mb-8"> 
          {language === "fr" ? "Toutes les actualités" : "All the News"}  
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {actualites.slice().sort((a, b) => b.id - a.id).map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 100 }} // Starts off-screen to the right
              animate={{ opacity: 1, x: 0 }} // Moves to its normal position
              transition={{ duration: 0.9, delay: index * 0.6 }} // Staggered effect
              className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              {item.image_url && (
                <Image
                  width={400}
                  height={300}
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${item.image_url}`}
                  alt="Actualité Image"
                  className="w-full h-60 object-cover mb-4 rounded"
                />
              )}
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {language === "fr" ? item.title_fr : item.title_en}
              </h2>
              <p className="text-gray-700 text-base">
                {language === "fr" ? item.description_fr : item.description_en}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
