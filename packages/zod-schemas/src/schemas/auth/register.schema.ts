import z from "zod";

export const RegisterSchema = z
    .object({
        firstName: z
            .string()
            .min(2, "First name must be at least 2 characters")
            .openapi({ description: "User's first name", example: "John" }),
        lastName: z
            .string()
            .min(2, "Last name must be at least 2 characters")
            .openapi({ description: "User's last name", example: "Doe" }),
        email: z
            .string()
            .email("Please enter a valid email address")
            .openapi({ description: "User's email address", example: "john.doe@example.com" }),
        phoneNumber: z
            .string()
            .min(10, "Please enter a valid phone number")
            .openapi({ description: "User's phone number", example: "+1234567890" }),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .openapi({ description: "User's password", format: "password" }),
        confirmPassword: z
            .string()
            .openapi({ description: "Password confirmation", format: "password" }),
        termsAccepted: z
            .literal(true, {
                errorMap: () => ({ message: "You must accept the terms and privacy policy" }),
            })
            .openapi({ description: "User must accept terms and privacy policy", example: true }),
        captchaToken: z
            .string()
            .min(1, "Please complete the CAPTCHA verification")
            .openapi({ description: "CAPTCHA verification token" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })
    .openapi("RegisterRequest");

