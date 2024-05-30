export default function handler(req, res) {
  res.status(200).json({
    name: "John Doe",
    jobTitle: "Frontend Developer",
    location: "USA",
    email: "johndoe@example.com",
    linkedin: "johndoe",
    twitter: "johndoe123",
    github: "johndoe",
    website: "johndoe.dev",
    aboutme:
      "I am a passionate Frontend Developer with a keen eye for design and aesthetics. Over the past 5 years, I have honed my skills in web development and am always eager to learn and implement new technologies.",

    toolsAndTechSkills: ["Photoshop", "Illustrator", "Sketch", "Adobe XD"],
    industryKnowledge: ["Javascript", "React", "HTML", "CSS"],
    languages: ["English(Native)", "Spanish(B1)"],
    projects: [
      {
        title: "johndoe.dev",
        summary: `My personal website, created using React, Tailwind CSS, and Gatsby.`,
      },
    ],
    experience: [
      {
        title: "Graphic Designer, Editor",
        company: "Creative Designs Inc.",
        from: new Date(2015, 5, 1),
        to: new Date(2019, 12, 31),
        current: false,
        summary: `Worked on a variety of design projects, including branding, print, and digital media. Collaborated with a team to produce visually appealing designs and ensured client satisfaction.`,
      },
    ],

    displayEducation: true,
    displayProjects: true,
    activeColor: "#FF6347",
  });
}
