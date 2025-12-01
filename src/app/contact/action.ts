"use server";

import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Name is too short."),
  email: z.string().email("Invalid email address."),
  subject: z.string().min(5, "Subject is too short."),
  message: z.string().min(10, "Message is too short."),
});

type FormState = {
  message: string | null;
  error: string | null;
};

// In a real application, you would email this or save it to a database.
// For this prototype, we'll just log the data to the console.
export async function sendMessageAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
    return {
      message: null,
      error: firstError || "Invalid input. Please check the form and try again.",
    };
  }

  try {
    // Simulate sending the message
    console.log("New contact form submission:", validatedFields.data);
    
    return {
      message: "Thank you for your message! We will get back to you shortly.",
      error: null,
    };
  } catch (error) {
    console.error("Contact Form Error:", error);
    return {
      message: null,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
