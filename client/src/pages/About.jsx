import React from "react";
import {
  FaUsers,
  FaLaptopCode,
  FaCalendarAlt,
  FaCogs,
  FaRocket,
  FaGraduationCap,
  FaLinkedin,
  FaUserTie,
  FaUserFriends,
  FaUserCog,
  FaLightbulb
} from "react-icons/fa";
import { FaUserMd } from "react-icons/fa";
import { assets } from "../assets/assets";

const teamLead = {
  name: "Muhammad Faraz Abbasi",
  role: "Team Lead / Full-Stack Developer",
  contribution:
    "Developed the complete MERN-based architecture of AI HealthSense. Built responsive, user-friendly interfaces using React.js, connected backend APIs with Express.js and MongoDB, and implemented key features such as patient-doctor profiles, authentication and authorization with role-based access control, doctor reviews, and availability management. Also led frontend-backend integration and deployment.",
  image: assets.faraz,
  linkedin: "https://www.linkedin.com/in/muhammadfaraz-abbasi/",
};
const teamMembers = [
  {
    name: "Faisal Rehman",
    role: "AI Engineer",
    contribution:
      "Faisal Rehman played a pivotal role in the development of the AI-based eye disease prediction module. He handled model selection, training, and testing using deep learning frameworks such as TensorFlow and Keras. His expertise ensured high accuracy in detecting eye conditions from OCT images, forming the core intelligence of our application.",
    image: assets.teamMemberMale,
    linkedin: "https://linkedin.com/in/drasad",
  },
  {
    name: "Hakim Zadi",
    role: "UI/UX Designer",
    contribution:
      "Hakim Zadi was responsible for crafting the UI/UX design of the AI HealthSense web interface. She focused on user-centered design principles, ensuring an intuitive and visually appealing experience across all screens. Her attention to detail greatly enhanced the project's accessibility, aesthetics, and overall usability.",
    image: assets.teamMemberFemale,
    linkedin: "https://linkedin.com/in/drasad",
  },
];
const supervisor = {
  name: "Dr. Imtiaz Ali Halepoto",
  role: "Project Supervisor",
  contribution:
    "Under the expert supervision of Dr. Imtiaz Ali Halepoto, our project was shaped with a clear technical direction and academic excellence. Their guidance, timely feedback, and in-depth knowledge in software engineering were instrumental in building AI HealthSense into a robust MERN-based healthcare solution.",
  image: assets.supervisor,
  linkedin: "https://www.linkedin.com/in/imtiaz-ali-halepoto-604332122/",
};
const techStack = [
  // Frontend
  "React.js",
  "Tailwind CSS",
  "React Router",
  "Axios",

  // Backend
  "Node.js",
  "Express.js",
  "MongoDB",
  "Mongoose",

  // AI Integration
  "Python",
  "TensorFlow",
  "Flask",
  "NumPy",
  "Matplotlib",
  "Streamlit",

  // Authentication & Security
  "JWT Authentication",
  "Role-Based Access Control",
  "Bcrypt.js",
  "CORS",

  // Tools & Deployment
  "Render",
  "Vercel",
  "Git",
  "GitHub",
  "Dotenv",
  "Postman",
];

const About = () => {
  return (
    <div className="bg-gray-50 text-gray-800 px-6 py-12 space-y-16">
      {/* About Section */}
      <section className="text-center max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          About AI HealthSense
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          AI HealthSense is a full-stack web application built with the{" "}
          <span className="font-semibold">MERN stack</span> — MongoDB,
          Express.js, React.js, and Node.js — aimed at transforming how users
          access and interact with healthcare data. It features a secure,
          token-based authentication system, RESTful APIs, dynamic routing,
          protected routes, and a modular backend architecture.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mt-4">
          Users can browse detailed doctor profiles with services,
          certifications, patient reviews, and real-time availability. A
          structured review system allows authenticated patients to share
          feedback. The system also integrates an AI-powered module for{" "}
          <span className="italic">eye disease prediction</span> based on X-ray
          images, bridging advanced healthcare features with scalable web
          technologies.
        </p>
      </section>

      {/* Supervisor Section */}
      <div className="text-center flex flex-col items-center">
        <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2 mb-8">
          <FaUserTie className="text-xl" /> Project Supervised By
        </h2>

        <div className="flex justify-center mb-12">
          <div className="w-full max-w-md border border-blue-400 bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition ease-in-out translate-all duration-500 group">
            <div className="flex flex-col items-center gap-4">
              <img
                src={supervisor.image}
                alt="Dr. Imtiaz Ali Halepoto"
                className="w-24 h-24 rounded-full object-cover border-2 border-blue-600 group-hover:scale-105 transition"
              />
              <div className="text-center">
                <h2 className="text-xl font-bold text-blue-900">
                  {supervisor.name}
                </h2>
                <p className="text-blue-600 font-medium"> {supervisor.role} </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 leading-relaxed text-justify">
                {supervisor.contribution}
              </p>
            </div>
            <div className="mt-5 flex justify-center">
              <a
                href={supervisor.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <FaLinkedin className="text-lg inline" /> Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <section className="">
        {/* Leader Section */}
        <h2 className="text-2xl font-bold text-center text-blue-800 flex items-center justify-center gap-2 mb-8">
          <FaUserCog /> Project Lead
        </h2>
        <div className="flex justify-center mb-24">
          <div className="w-full max-w-md border border-blue-400 bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition ease-in-out translate-all duration-500 group">
            <div className="flex flex-col items-center gap-4">
              <img
                src={teamLead.image}
                alt="Muhammad Faraz Abbasi"
                className="w-24 h-24 rounded-full object-cover border-2 border-blue-600 group-hover:scale-105 transition"
              />
              <div className="text-center">
                <h2 className="text-xl font-bold text-blue-900">
                  {teamLead.name}
                </h2>
                <p className="text-blue-600 font-medium"> {teamLead.role} </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 leading-relaxed text-justify">
                {teamLead.contribution}
              </p>
            </div>
            <div className="mt-5 flex justify-center">
              <a
                href={teamLead.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <FaLinkedin className="text-lg inline" /> Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <h2 className="text-2xl font-bold text-center text-blue-800 flex items-center justify-center gap-2 mb-8">
          <FaUserFriends /> Team Members
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 justify-center gap-6 mb-24">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="w-full max-w-md border border-gray-300 bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition ease-in-out duration-500 place-self-center"
            >
              <div className="flex flex-col items-center gap-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                />
                <div className="text-center">
                  <h2 className="text-xl font-bold text-blue-900">
                    {member.name}
                  </h2>
                  <p className="text-blue-600 font-medium">{member.role}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 leading-relaxed text-justify">
                  {member.contribution}
                </p>
              </div>
              {member.linkedin && (
                <div className="mt-5 flex justify-center">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <FaLinkedin className="text-lg inline" /> Connect on
                    LinkedIn
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="">
        <h2 className="text-2xl font-bold text-center text-blue-800 flex items-center justify-center gap-2 mb-10">
          <FaCalendarAlt /> Project Timeline
        </h2>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* FYP-I */}
          <div className="bg-white border-l-4 border-blue-600 p-6 shadow-md rounded-md">
            <h3 className="text-lg font-semibold text-blue-700 mb-1">
              FYP-I (Initial Phase)
            </h3>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
              <li>Designed core UI layout and component structure</li>
              <li>Created and seeded doctor database schema</li>
              <li>Collected and organized eye disease datasets for AI</li>
              <li>Implemented basic backend routes and testing APIs</li>
            </ul>
          </div>

          {/* FYP-II */}
          <div className="bg-white border-l-4 border-green-600 p-6 shadow-md rounded-md">
            <h3 className="text-lg font-semibold text-green-700 mb-1">
              FYP-II (Final Phase)
            </h3>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
              <li>Integrated AI model into the MERN stack</li>
              <li>Implemented authentication and role-based access</li>
              <li>Built doctor-patient dashboard with dynamic UI</li>
              <li>Added review system and availability management</li>
              <li>Final deployment and system optimization</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section>
        <h2 className="text-2xl font-bold text-center text-blue-800 flex items-center justify-center gap-2 mb-10">
          <FaCogs /> Technology Stack
        </h2>
        <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
          {techStack.map((tech, idx) => (
            <span
              key={idx}
              className="bg-white px-4 py-2 rounded-full border border-gray-300 shadow-sm text-sm font-medium text-gray-700 whitespace-nowrap"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Future Vision Section */}
      <section>
        <h2 className="text-2xl font-bold text-center text-blue-800 flex items-center justify-center gap-2 mb-10">
          <FaLightbulb className="text-xl" /> Vision & Future Work
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
