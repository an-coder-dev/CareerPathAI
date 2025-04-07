import React from 'react';

const careers = [
  {
    title: "Data Manager",
    description: "Oversee the proper handling, processing, and storage of data...",
    skills: ["Managing data", "Data integrity", "Decision making"],
    salary: "$145,280",
    jobs: "46,821 jobs available",
    credential: { name: "IBM Data Management", link: "https://www.ibm.com" },
    image: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/7oeSAFfCbtJEfjncgTed55/f3a7f6baff4dfabf518d24dc34377731/data-analyst-cover.jpg?auto=format%2Ccompress&dpr=2",
  },
  {
    title: "Python Developer",
    description: "Write and debug Python code for diverse software applications...",
    skills: ["Writing code", "Solving complex problems", "Data"],
    salary: "$132,992",
    jobs: "15,171 jobs available",
    credential: { name: "Microsoft Python Developer", link: "https://www.microsoft.com" },
    image: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/4Rr2s0ZHi7EqSqmYksrfZN/2f07c4e26a9239441510399a8363a5cb/python_developer.jpg?auto=format%2Ccompress&dpr=2",
  },
  {
    title: "Data Analyst",
    description: "Collect, organize, and transform data to make informed business decisions.",
    skills: ["Attention to detail", "Problem solving", "Working with numbers"],
    salary: "$90,500",
    jobs: "82,489 jobs available",
    credential: { name: "Google Data Analytics", link: "https://www.coursera.org" },
    image: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/3vpcAYX76WoEjhKXQnGQ6/00a78d9a5c189e73f225c6bbbfab622b/Data_Management_card.png?auto=format%2Ccompress&dpr=2",
  },
];

const CareerCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {careers.map((career, index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg p-4">
          <img src={career.image} alt={career.title} className="rounded-t-lg w-full" />
          <h2 className="text-xl font-bold mt-4">{career.title}</h2>
          <p className="text-gray-700 mt-2">{career.description}</p>
          <div className="mt-3">
            <strong>Great if you like:</strong>
            <div className="flex flex-wrap mt-2">
              {career.skills.map((skill, i) => (
                <span key={i} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mr-2 mb-2">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <p className="font-bold mt-2">{career.salary} median salary</p>
          <p className="text-gray-600">{career.jobs}</p>
          <a href={career.credential.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-2 block">
            {career.credential.name}
          </a>
        </div>
      ))}
    </div>
  );
};

export default CareerCards;
