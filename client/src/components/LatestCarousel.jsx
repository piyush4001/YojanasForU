// import React from "react";
// import { useKeenSlider } from "keen-slider/react";
// import "keen-slider/keen-slider.min.css";

// import b1 from "../assets/b1.png";
// import b2 from "../assets/b2.png";
// import b3 from "../assets/b3.png";
// import b4 from "../assets/b4.png";

// const banners = [b1, b2, b3, b4];

// // Correct Autoplay Plugin
// function AutoplayPlugin(slider) {
//   let timeout;
//   let mouseOver = false;

//   function clearNextTimeout() {
//     clearTimeout(timeout);
//   }

//   function nextTimeout() {
//     clearTimeout(timeout);
//     if (mouseOver) return;
//     timeout = setTimeout(() => {
//       slider.next();
//     }, 3000); // Change slide every 3 seconds
//   }

//   slider.on("created", () => {
//     slider.container.addEventListener("mouseover", () => {
//       mouseOver = true;
//       clearNextTimeout();
//     });
//     slider.container.addEventListener("mouseout", () => {
//       mouseOver = false;
//       nextTimeout();
//     });
//     nextTimeout();
//   });

//   slider.on("dragStarted", clearNextTimeout);
//   slider.on("animationEnded", nextTimeout);
//   slider.on("updated", nextTimeout);
// }

// const LatestCarousel = () => {
//   const [sliderRef] = useKeenSlider(
//     {
//       loop: true,
//       slides: {
//         perView: 1,
//         spacing: 10,
//       },
//     },
//     [AutoplayPlugin]
//   );

//   return (
//     <div className="bg-white pt-6 pb-10">
//       <div
//         ref={sliderRef}
//         className="keen-slider max-w-5xl mx-auto rounded-xl overflow-hidden"
//       >
//         {banners.map((img, index) => (
//           <div key={index} className="keen-slider__slide">
//             <img
//               src={img}
//               alt={`Banner ${index + 1}`}
//               className="w-full h-64 md:h-80 object-cover rounded-xl shadow"
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LatestCarousel;

import React from "react";
import { useKeenSlider } from "keen-slider/react";
import { motion } from "framer-motion";
import "keen-slider/keen-slider.min.css";

import b1 from "../assets/b1.png";
import b2 from "../assets/b2.png";
import b3 from "../assets/b3.png";
import b4 from "../assets/b4.png";

const banners = [b1, b2, b3, b4];

// Autoplay Plugin
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
    }, 3500); // autoplay every 3.5s
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
      breakpoints: {
        "(min-width: 640px)": {
          slides: {
            perView: 1,
            spacing: 10,
          },
        },
        "(min-width: 768px)": {
          slides: {
            perView: 1,
            spacing: 10,
          },
        },
        "(min-width: 1024px)": {
          slides: {
            perView: 1,
            spacing: 10,
          },
        },
      },
    },
    [AutoplayPlugin]
  );

  return (
    <section className="bg-white pt-10 pb-14 px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-2xl md:text-3xl font-bold text-center mb-6 text-[#16355D]"
      ></motion.h2>
      <div
        ref={sliderRef}
        className="keen-slider max-w-6xl mx-auto rounded-xl overflow-hidden"
      >
        {banners.map((img, index) => (
          <motion.div
            key={index}
            className="keen-slider__slide"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <img
              src={img}
              alt={`Banner ${index + 1}`}
              className="w-full h-52 sm:h-64 md:h-80 lg:h-[22rem] object-cover rounded-xl shadow-md transition-transform duration-300 hover:scale-[1.02]"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default LatestCarousel;
