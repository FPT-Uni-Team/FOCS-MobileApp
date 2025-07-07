import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty('Please enter email!')
    .email('Invalid email!'),
  password: z
    .string()
    .nonempty('Please enter password!')
    .min(6, 'Password must be at least 6 characters long!'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
 