type Course = {
  _id: string;
  title: string;
  duration: number;
};

import Navbar from "../components/navbar";
import { FaDatabase } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const BASE_URI: string = import.meta.env.VITE_BASE_URI;

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);

  /*
   * If no existing JWT is found in browser,
   * it'll be redirected to login page
   */
  const jwt: string | null = localStorage.getItem("jwt");

  /*
   * if found then fetch courses from server
   * by adding JWT into http Request-headers
   */
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        axios
          .get(`${BASE_URI}/api/v1/courses`, {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          })
          .then((result) => {
            setCourses(result.data);
          })
          .catch((err) => {
            if (err.response.status === 403) {
              throw new Error(err.response.data.error);
            }
          });
      } catch (error) {
        throw new Error("Failed to fetch courses from server");
      }
    };

    if (jwt) {
      fetchCourses();
    } else {
      navigate("/signin");
    }
  }, [jwt, navigate]);

  return (
    <div className="course-page flex flex-col items-center h-[100vh] bg-gray-200">
      <Navbar />
      <div className="intro text-center w-[400px] my-6">
        <p className="text-2xl">Welcome to freeCodeCamp.org</p>
        <p className="text-gray-500 mt-4 mb-1 text-xl">
          "I have not failed, I just found 1000 more ways that won't work."
        </p>
        <p className="text-sm italic  text-gray-500">- Thomas Alva Edison</p>
      </div>
      <div className="courses w-[400px]">
        {courses.map((course) => {
          return (
            <div
              key={course._id}
              className="course-item flex items-center border-2 border-black w-full p-2 mb-2 bg-gray-300"
            >
              <FaDatabase className="text-2xl" />
              <p className="ml-2">{`${course.title} (${course.duration}) hours`}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Courses;
