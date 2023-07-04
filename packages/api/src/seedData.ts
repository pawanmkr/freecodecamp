type CourseItem = {
  title: string
  duration: number
}

import { Course } from "./models/course.model.js";

export const courses: CourseItem[] = [
  {    
    title: "Web Development with HTML, CSS, and JavaScript",
    duration: 300  
  },
  {    
    title: "Data Structures and Algorithms in Python",
    duration: 300  
  },
  {    
    title: "Mobile App Development with React Native",
    duration: 300  
  },
  {    
    title: "Database Design and Management with SQL",
    duration: 300  
  },
  {    
    title: "Introduction to Artificial Intelligence",
    duration: 300  
  },
  {    
    title: "Go Full-Stack with MERN (MongoDB, Express, React, Node.js)",
    duration: 300  
  },
  {    
    title: "Cybersecurity Fundamentals and Best Practices",
    duration: 300  
  },
  {
    title: "Cloud Computing and AWS Essentials",
    duration: 300
  },
];

export async function preSeeding() {
  Course.find().then(async (docs) => {
    if (docs.length > 10) {
      console.log("Database is Already Seeded\nReturning...");
      return;
    }
    for (let course of courses) {
      const newCourse = new Course({
        title: course.title,
        duration: course.duration
      });
      await newCourse
        .save()
        .catch((err) => {
          throw new Error("Seeding was failed!");  
        });
    }
    console.log("Seeding Successful");
  })
}
