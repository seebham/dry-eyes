"use client";

import type { Carousel as CarouselType } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type ImageCarouselProps = {
  block: CarouselType;
};

const AUTOPLAY_INTERVAL = 5000; // 5 sec
const TRANSITION_DURATION = 500; // 0.5 sec
const TOUCH_THRESHOLD = 50; // px

export const ImageCarousel = ({ block }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  if (!block?.imagesCollection?.items?.length) {
    return null;
  }

  const slides = block.imagesCollection.items;
  const totalSlides = slides.length;

  // Auto-play functionality
  const startAutoplay = useCallback(() => {
    if (isPaused || totalSlides <= 1) return;

    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, AUTOPLAY_INTERVAL);
  }, [isPaused, totalSlides]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
  }, []);

  // Navigation functions
  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;

      setIsTransitioning(true);
      setCurrentIndex(index);

      setTimeout(() => {
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
    },
    [isTransitioning]
  );

  const nextSlide = useCallback(() => {
    const nextIndex = (currentIndex + 1) % totalSlides;
    goToSlide(nextIndex);
  }, [currentIndex, totalSlides, goToSlide]);

  const prevSlide = useCallback(() => {
    const prevIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
    goToSlide(prevIndex);
  }, [currentIndex, totalSlides, goToSlide]);

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > TOUCH_THRESHOLD;
    const isRightSwipe = distance < -TOUCH_THRESHOLD;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // autoplay
  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  // pause on hover
  const handleMouseEnter = () => {
    setIsPaused(true);
    stopAutoplay();
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Calculate transform for peek effect
  const getSlideTransform = (index: number) => {
    const offset = index - currentIndex;
    const translateX = offset * 85; // 85% to show peek of next/prev slides
    const scale = offset === 0 ? 1 : 0.9;
    const opacity = Math.abs(offset) <= 1 ? 1 : 0.3;

    return {
      transform: `translateX(${translateX}%) scale(${scale})`,
      opacity,
      zIndex: offset === 0 ? 2 : 1,
    };
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {block.title && (
          <h2 className="text-3xl font-bold text-center mb-4">{block.title}</h2>
        )}
        {block.description && (
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            {block.description}
          </p>
        )}

        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Carousel Container */}
          <div
            ref={carouselRef}
            className="relative h-96 md:h-[500px] overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {slides.map((carouselImage, index) => {
              if (!carouselImage?.image?.url) return null;

              const slideStyle = getSlideTransform(index);
              const isActive = index === currentIndex;

              return (
                <div
                  key={carouselImage.sys.id}
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                    isActive ? "opacity-100" : "opacity-30"
                  }`}
                  style={slideStyle}
                >
                  <div className="relative w-full h-full group">
                    <div className="aspect-square h-full mx-auto overflow-hidden bg-muted rounded-lg shadow-xl">
                      <Image
                        src={carouselImage.image.url}
                        alt={
                          carouselImage.altText ||
                          carouselImage.image.description ||
                          ""
                        }
                        fill
                        className={`object-cover transition-all duration-700 ${
                          isActive
                            ? "scale-100 filter-none"
                            : "scale-105 filter blur-sm"
                        }`}
                        loading={index <= 2 ? "eager" : "lazy"}
                        priority={index === 0}
                      />
                    </div>

                    {/* Caption overlay */}
                    {carouselImage.caption && isActive && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                        <p className="text-white text-lg font-medium text-center">
                          {carouselImage.caption}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                disabled={isTransitioning}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white text-black p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={nextSlide}
                disabled={isTransitioning}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white text-black p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Progress indicator */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-black scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Caption for mobile when not overlaid */}
          <div className="block md:hidden mt-4">
            {slides[currentIndex]?.caption && (
              <p className="text-center text-lg font-medium">
                {slides[currentIndex].caption}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
