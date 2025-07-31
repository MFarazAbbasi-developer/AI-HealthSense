import React from "react";
import {
  FaUsers,
  FaLaptopCode,
  FaCalendarAlt,
  FaCogs,
  FaRocket,
  FaGraduationCap,
  FaLinkedin,
} from "react-icons/fa";
import { FaUserMd } from "react-icons/fa";
import { assets } from "../assets/assets";

const teamMembers = [
  {
    name: "Muhammad Faraz",
    role: "Backend Developer",
    contribution: "Created REST APIs and handled server-side logic.",
    image:
      assets.teamMemberMale,
    linkedin: "https://linkedin.com/in/drasad",
  },
  {
    name: "Faisal Rehman",
    role: "AI Engineer",
    contribution:
      "Worked on building and training AI models for disease prediction.",
    image:
      assets.teamMemberMale,
    linkedin: "https://linkedin.com/in/drasad",
  },
  {
    name: "Hakim Zadi",
    role: "Frontend Developer",
    contribution:
      "Designed UI and developed React components for core features.",
    image:
      assets.teamMemberFemale,
    linkedin: "https://linkedin.com/in/drasad",
  },
];
const supervisor = {
  name: "Dr. Imtiaz Ali Halepoto",
  role: "Project Supervisor",
  contribution:
    "Guided the project, provided mentorship, and ensured academic standards.",
  image:
    "https://img.freepik.com/free-photo/portrait-male-health-worker_23-2148980804.jpg?semt=ais_hybrid",
  linkedin: "https://linkedin.com/in/drasad",
};
const techStack = [
  "React",
  "Node.js",
  "Express.js",
  "MongoDB",
  "TailwindCSS",
  "Flask",
  "Python",
  "TensorFlow",
  "ScikitLearn",
  "NumPy",
  "Matplotlib",
  "Seaborn",
  "Pandas",
  "Streamlit",
  "Cloudinary",
  "Nodemailer",
  
];

const About = () => {
  return (
    <div className="bg-gray-50 text-gray-800 px-6 py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          About AI HealthSense
        </h1>
        <p className="text-lg text-gray-600">
          AI HealthSense is a final year project aimed at empowering healthcare
          decisions through AI-driven eye disease prediction and smart
          patient-doctor record management.
        </p>
      </section>

      {/* Supervisor */}
      <div className="text-center flex flex-col items-center mb-16">
        <h2 className="text-2xl font-semibold text-blue-800 flex items-center justify-center gap-2 mb-6">
          <FaLaptopCode /> Project Supervised By
        </h2>
        <div className="w-full max-w-80 border border-gray-300 bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition ease-in-out translate-all duration-500">
          <div className="flex flex-col items-center gap-4">
            <img
              src={assets.supervisor}
              alt={`${supervisor.name}`}
              className="w-20 h-20 rounded-full object-cover border-2 border-blue-600"
            />
            <div className="text-center">
              <h2 className="text-lg font-bold text-gray-800">
                {supervisor.name}
              </h2>
              <p className="justify-center text-blue-600 font-medium flex items-center gap-1">
                <FaUserMd /> {supervisor.role}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500 line-clamp-4">
              {supervisor.contribution}
            </p>
          </div>

          <div className="mt-5 flex justify-center">
            <a
              href={supervisor.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:text-blue-800 mt-1"
            >
              <FaLinkedin className="text-xl inline" /> Connect on LinkedIn
            </a>
          </div>
        </div>
      </div>
      {/* Team Section */}
      <section>
        <h2 className="text-2xl font-semibold text-center text-blue-800 flex items-center justify-center gap-2 mb-10">
          <FaUsers /> Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((docc, idx) => (
            <div
              key={idx}
              className="w-full max-w-80 border border-gray-300 bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition ease-in-out translate-all duration-500"
            >
              <div className="flex flex-col items-center gap-4">
                <img
                  src={docc.image}
                  alt={`${docc.name}`}
                  className="w-20 h-20 rounded-full object-cover border-2 border-blue-600"
                />
                <div className="text-center">
                  <h2 className="text-lg font-bold text-gray-800">
                    {docc.name}{" "}
                    {idx === 0 && (
                      <span className="text-green-500">(Team Lead)</span>
                    )}
                  </h2>
                  <p className="justify-center text-blue-600 font-medium flex items-center gap-1">
                    <FaUserMd /> {docc.role}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500 line-clamp-4">
                  {docc.contribution}
                </p>
              </div>

              <div className="mt-5 flex justify-center">
                <a
                  href={supervisor.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:text-blue-800 mt-1"
                >
                  <FaLinkedin className="text-xl inline" /> Connect on LinkedIn
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section>
        <h2 className="text-2xl font-semibold text-center text-blue-800 flex items-center justify-center gap-2 mb-10">
          <FaCalendarAlt /> Project Timeline
        </h2>
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="bg-white border-l-4 border-blue-600 p-4 shadow rounded">
            <p>
              <strong>FYP-I:</strong> UI design, Doctor DB setup, AI Model
              collection, Initial backend routes
            </p>
          </div>
          <div className="bg-white border-l-4 border-green-600 p-4 shadow rounded">
            <p>
              <strong>FYP-II:</strong> AI model integration, Data filtering
              features, Authentication, Dashboard & more
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section>
        <h2 className="text-2xl font-semibold text-center text-blue-800 flex items-center justify-center gap-2 mb-10">
          <FaCogs /> Technology Stack
        </h2>
        <div className="flex  gap-4 justify-start max-w-5xl mx-auto overflow-auto">
          {techStack.map((tech, idx) => (
            <span
              key={idx}
              className="bg-white px-4 py-2 rounded-full border shadow text-sm font-medium text-gray-700"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Future Vision Section */}
      <section>
        <h2 className="text-2xl font-semibold text-center text-blue-800 flex items-center justify-center gap-2 mb-10">
          <FaRocket /> Vision & Future Work
        </h2>
        <div className="max-w-4xl mx-auto text-gray-600 text-sm space-y-4">
          <p>
            Our vision is to evolve AI HealthSense into a full-scale healthcare
            assistance platform. With improved disease coverage, integration
            with hospital systems, and real-time alerts, we hope to make smart
            care accessible to everyone.
          </p>
          <p>
            Future iterations may also include features like multilingual
            support, appointment booking, and integration with government health
            systems.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
