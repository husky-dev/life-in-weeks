import z from 'zod';

export const DatePeriodSchema = z.object({
  start: z.number(),
  end: z.number(),
});

export type DatePeriod = z.infer<typeof DatePeriodSchema>;

const LifePeriodColorStyleSchema = z.enum(['solid', 'gradient']);

export type LifePeriodColorStyle = z.infer<typeof LifePeriodColorStyleSchema>;

const LifePeriodSchema = z.object({
  ...DatePeriodSchema.shape,
  name: z.string(),
  color: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  style: LifePeriodColorStyleSchema.optional(),
  hidden: z.boolean().optional(),
});

export type LifePeriod = z.infer<typeof LifePeriodSchema>;

const LifeSchema = z.object({
  birthday: z.number(),
  periods: z.array(LifePeriodSchema),
});

export type Life = z.infer<typeof LifeSchema>;

export const isLife = (val: unknown): val is Life => LifeSchema.safeParse(val).success;
