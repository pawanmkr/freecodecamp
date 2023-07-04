import { Request, Response } from 'express';
import { Course } from '../models/course.model.js';

export async function getCourses(req: Request, res: Response) {
  try {
    Course.find().then((docs) => {
      if (docs.length === 0) {
        res.sendStatus(404);
        return;
      }
      res.status(200).send(docs.slice(0, 8));
    })
  } catch (error) {
    console.error(error);
    res.sendStatus(500).send("Failed to fetch Courses from server");
  }
}