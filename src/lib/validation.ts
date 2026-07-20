import { z } from "zod";
import {
  BUDGET_RANGES,
  CHALLENGE_CATEGORIES,
  CONSULTATION_LANGUAGES,
  CONTACT_METHODS,
  ORGANISATION_TYPES,
} from "./domain";

const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

/** Server-side schema for a public diagnostic submission. */
export const submissionSchema = z.object({
  // Required
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120),
  workEmail: z.string().trim().toLowerCase().email("Please enter a valid work email.").max(160),
  mobile: z
    .string()
    .trim()
    .min(6, "Please enter a contactable mobile number.")
    .max(40)
    .regex(/^[0-9+()\-.\s]+$/, "Mobile number contains invalid characters."),
  organisationName: z.string().trim().min(2, "Please enter your organisation name.").max(160),
  organisationType: z.enum(ORGANISATION_TYPES, {
    errorMap: () => ({ message: "Please select your organisation type." }),
  }),
  position: z.string().trim().min(2, "Please enter your position or role.").max(120),
  challengeTitle: z.string().trim().min(4, "Give your challenge a short title.").max(160),
  challengeDescription: z
    .string()
    .trim()
    .min(40, "Please describe the challenge in a little more detail (at least 40 characters).")
    .max(8000),
  consent: z
    .union([z.literal("on"), z.literal("true"), z.boolean()])
    .refine((v) => v === true || v === "on" || v === "true", {
      message: "Please confirm consent so our team can review your challenge.",
    }),

  // Optional
  department: optionalTrimmed(160),
  website: optionalTrimmed(200),
  currentTools: optionalTrimmed(400),
  affectedUsers: optionalTrimmed(120),
  location: optionalTrimmed(160),
  deadline: optionalTrimmed(120),
  budget: z.enum(BUDGET_RANGES).optional(),
  category: z.enum(CHALLENGE_CATEGORIES).optional(),
  preferredContact: z.enum(CONTACT_METHODS).optional(),
  preferredLanguage: z.enum(CONSULTATION_LANGUAGES).optional(),
  supportingLink: optionalTrimmed(300),

  // Anti-spam (honeypot must be empty; renderedAt used for timing check)
  company_url: z.string().max(0, "Bot check failed.").optional().default(""),
  renderedAt: z.coerce.number().optional(),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;

export const ALLOWED_UPLOAD_TYPES: Record<string, string> = {
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "application/vnd.ms-excel": "XLS",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  "application/vnd.ms-powerpoint": "PPT",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
  "image/jpeg": "JPEG",
  "image/png": "PNG",
};

export const ALLOWED_UPLOAD_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".jpg",
  ".jpeg",
  ".png",
];
