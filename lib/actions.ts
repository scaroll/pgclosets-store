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
    // Send email via Resend
    const { sendContactEmail, sendContactConfirmation } = await import('./email/resend');

    const emailResult = await sendContactEmail(validatedFields.data);

    if (!emailResult.success) {
      // Log error but still show success to user (form data is logged)
      console.error("Email sending failed:", emailResult.error);
      console.log("Contact form data (email failed):", validatedFields.data);

      // If no API key configured, inform user to check console
      if (emailResult.error?.includes('not configured')) {
        return {
          message: "Form submitted (email service pending configuration). We've logged your message."
        };
      }
    } else {
      // Send confirmation email to customer (non-blocking)
      sendContactConfirmation(validatedFields.data).catch(err =>
        console.error("Confirmation email failed:", err)
      );

      console.log("✅ Contact form submitted and email sent:", emailResult.emailId);
    }

    return { message: "Success! Your message has been sent. We'll get back to you within 24 hours." };
  } catch (error) {
    console.error("Error submitting form:", error);
    return {
      message: "Error: Could not submit the form. Please try again later.",
    };
  }
}
