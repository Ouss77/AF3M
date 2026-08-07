"use client";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { LanguageContext } from "./Context/LanguageContext";
import Head from "next/head";

export default function CarouselActualite() {
  const [actualites, setActualites] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    const fetchActualites = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/Actualites/getActualite.php`
        );
        setActualites(response.data);
      } catch (error) {
        console.error("Error fetching actualites:", error);
      }
    };

    fetchActualites();
  }, []);

  // Backend returns actualites pre-sorted by sort_order (admin-defined order)
  const lastThreeActualites = actualites.slice(0, 3);

  const handleNext = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % lastThreeActualites.length
    );
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + lastThreeActualites.length) %
        lastThreeActualites.length
    );
  };

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [isHovered, lastThreeActualites.length]);

  return (
    <>
      <Head>
        <title>Carousel Actualité</title>
        <meta name="description" content="Découvrez les dernières actualités de notre association." />
        <meta name="keywords" content="actualités, association, nouvelles, événements" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-24 sm:mt-32">
        {/* Main Carousel Container */}
        <div
          className="relative w-full h-[400px] lg:h-[550px] rounded-3xl overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {lastThreeActualites.map((item, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentIndex
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }`}
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${item.image_url}`}
                  alt={item.Titre || "Actualité image"}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>

              {/* Content Container */}
              <div className="relative h-full flex flex-col justify-end p-6 sm:p-10 lg:p-14">
                {/* Title */}
                <div className="mb-4 transform transition-transform duration-700">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
                    {language === "fr" ? item.title_fr : item.title_en}
                  </h2>
                  <div className="w-24 h-1 bg-yellow-500 rounded-full" />
                </div>

                {/* Description */}
                <div className="p-6 sm:p-8 max-w-3xl">
                  <p className="text-base sm:text-lg lg:text-xl text-white leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
                    {language === "fr" ? item.description_fr : item.description_en}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Buttons - Modern Style */}
          <button
            aria-label="Previous"
            onClick={handlePrevious}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-3 sm:p-4 rounded-full transition-all duration-300 hover:scale-110 border border-white/30"
          >
            <FaChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>

          <button
            aria-label="Next"
            onClick={handleNext}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-3 sm:p-4 rounded-full transition-all duration-300 hover:scale-110 border border-white/30"
          >
            <FaChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {lastThreeActualites.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "w-12 h-3 bg-yellow-500"
                    : "w-3 h-3 bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}