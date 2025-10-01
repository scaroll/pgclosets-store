"use server";

import type { ContactFormState } from "./schema";
import { contactFormSchema } from "./schema";

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const validatedFields = contactFormSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(
      validatedFields.error.flatten().fieldErrors
    )) {
      fields[key] = formData.get(key)?.toString() ?? "";
    }
    return {
      message: "Error: Please check the fields.",
      fields,
      issues: validatedFields.error.flatten().fieldErrors.message,
    };
  }

  try {
    // TODO: Replace with actual email sending logic (e.g., Resend, Nodemailer)
    console.log("Form data submitted successfully:");
    console.log(validatedFields.data);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return { message: "Success! Your message has been sent." };
  } catch (error) {
    console.error("Error submitting form:", error);
    return {
      message: "Error: Could not submit the form. Please try again later.",
    };
  }
}
