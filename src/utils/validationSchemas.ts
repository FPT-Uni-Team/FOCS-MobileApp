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

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .min(1, 'Customer name is required')
    .max(30, 'Name is too long'),
  customerPhone: z
    .string()
    .regex(/^[0-9]{9,11}$/, 'Invalid phone number format'),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
 