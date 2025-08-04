import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import b1 from "../assets/b1.png";
import b2 from "../assets/b2.png";
import b3 from "../assets/b3.png";
import b4 from "../assets/b4.png";

const banners = [b1, b2, b3, b4];

// Correct Autoplay Plugin
function AutoplayPlugin(slider) {
  let timeout;
  let mouseOver = false;

  function clearNextTimeout() {
    clearTimeout(timeout);
  }

  function nextTimeout() {
    clearTimeout(timeout);
    if (mouseOver) return;
    timeout = setTimeout(() => {
      slider.next();
    }, 3000); // Change slide every 3 seconds
  }

  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true;
      clearNextTimeout();
    });
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false;
      nextTimeout();
    });
    nextTimeout();
  });

  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);
}

const LatestCarousel = () => {
  const [sliderRef] = useKeenSlider(
    {
      loop: true,
      slides: {
        perView: 1,
        spacing: 10,
      },
    },
    [AutoplayPlugin]
  );

  return (
    <div className="bg-white pt-6 pb-10">
      <div
        ref={sliderRef}
        className="keen-slider max-w-5xl mx-auto rounded-xl overflow-hidden"
      >
        {banners.map((img, index) => (
          <div key={index} className="keen-slider__slide">
            <img
              src={img}
              alt={`Banner ${index + 1}`}
              className="w-full h-64 md:h-80 object-cover rounded-xl shadow"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestCarousel;
