import { z } from 'zod'

export const startGameFormSchema = z.object({
  userName: z
    .string()
    .min(1, 'Your name is required.')
    .max(20, 'Your name must contain at most 20 characters.'),
  targetScore: z.number().int().min(1, 'Target score must be at least 1.'),
  cardsPerPlayer: z
    .number()
    .int()
    .min(1, 'Cards per player must be at least 1.')
    .max(15, 'Cards per player must be at most 15.'),
  bots: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, 'Bot name is required.')
          .max(10, 'Bot name must contain at most 20 characters.'),
      }),
    )
    .min(1, 'At least one bot is required.')
    .max(20, "The bot's name must contain at most 20 characters."),
})
