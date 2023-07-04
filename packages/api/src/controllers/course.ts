import { Request, Response } from 'express';

export async function getCourses(req: Request, res: Response) {
  res.status(200).send(courses);
}

type Course = {
  id: string;
  title: string;
};

const courses: Course[] = [
  {
    id: "3",
    title: "Web Development with HTML, CSS, and JavaScript (30+ hours)",
  },
  {
    id: "4",
    title: "Data Structures and Algorithms in Python",
  },
  {
    id: "5",
    title: "Mobile App Development with React Native",
  },
  {
    id: "6",
    title: "Database Design and Management with SQL",
  },
  {
    id: "7",
    title: "Introduction to Artificial Intelligence",
  },
  {
    id: "8",
    title: "Go Full-Stack with MERN (MongoDB, Express, React, Node.js)",
  },
  {
    id: "9",
    title: "Cybersecurity Fundamentals and Best Practices",
  },
  {
    id: "10",
    title: "Cloud Computing and AWS Essentials",
  },
];
