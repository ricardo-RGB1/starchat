"use client";

import * as z from "zod"; // imported when installing "form" component from shadcn/ui 



import { Category, Companion } from "@prisma/client";

interface StarchatFormProps {
  initialData: Companion | null;
  categories: Category[];
}

// The formSchema object defines the shape of the data that is submitted by the form.
const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required."
    }),
    description: z.string().min(1, {
        message: "Description is required."
    }),
    instructions: z.string().min(200, {
        message: "Instructions require at least 200 characters."
    }),
    seed: z.string().min(200, {
        message: "Seed require at least 200 characters."
    }),
    src: z.string().min(1, {
        message: "Image is required"
    }),
    categoryId: z.string().min(1, {
        message: "Category  is required"
    }),
})


// The StarchatForm component is a form that is used to create or edit a companion.
export const StarchatForm = ({
  initialData,
  categories,
}: StarchatFormProps) => {
  return (
    <div>
      <h1>Starchat Form</h1>
    </div>
  );
};
 