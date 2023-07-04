import { Schema, model, Document } from 'mongoose';

export interface Course extends Document {
  title: string;
  duration: number;
}

const CourseSchema = new Schema<Course>({
  title: { type: String, required: true },
  duration: { type: Number, required: true }
});

export const Course = model<Course>('Course', CourseSchema);
