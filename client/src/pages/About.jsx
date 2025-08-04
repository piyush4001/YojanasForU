import React from "react";
import { Github, Linkedin } from "lucide-react"; // Optional icons

const teamMembers = [
  {
    name: "Krishnapal Sonaniya",
    role: "Frontend Developer",
    bio: "Passionate about building accessible user interfaces and simplifying public services.",
    image: "https://i.pravatar.cc/150?img=3",
    github: "https://github.com/example",
    linkedin: "https://linkedin.com/in/example",
  },
  {
    name: "Piyush Soni",
    role: "Backend Developer",
    bio: "Focused on building secure, scalable APIs and infrastructure for civic tech.",
    image:
      "https://media.licdn.com/dms/image/v2/D4E03AQFH2CZ9LRZhiQ/profile-displayphoto-shrink_400_400/B4EZbOs0MLGcAo-/0/1747224578665?e=1756944000&v=beta&t=phL6Ib26zQOGyI-pGK8mnVxRPKlke4qx9X2DDOMsurQ",
    github: "https://github.com/example",
    linkedin: "https://www.linkedin.com/in/piyush-soni-55342b2aa/",
  },
];

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-gray-800">
      {/* Intro Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About Scheme Portal</h1>
        <p className="text-lg text-gray-600">
          Empowering citizens with up-to-date information on government schemes.
        </p>
      </section>

      {/* Mission Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed">
          Our goal is to bridge the gap between the government and the people by
          providing easy access to welfare schemes, subsidies, and programs.
        </p>
      </section>

      {/* What We Offer */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">What We Offer</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Searchable database of central and state schemes</li>
          <li>Scheme recommendation via "Scheme For Me"</li>
          <li>Category-wise filtering for easy browsing</li>
          {/* <li>Multi-language support</li> */}
          <li>Regular updates and latest news carousel</li>
        </ul>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Meet the Team
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
              />
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-blue-600 mb-2">{member.role}</p>
              <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
              <div className="flex justify-center gap-4">
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black"
                  >
                    <Github size={20} />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-700"
                  >
                    <Linkedin size={20} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
