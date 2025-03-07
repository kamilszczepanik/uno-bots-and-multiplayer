import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10)

  const user1 = await prisma.user.upsert({
    where: { username: 'player1' },
    update: {},
    create: {
      username: 'player1',
      password: passwordHash,
    },
  })

  const user2 = await prisma.user.upsert({
    where: { username: 'player2' },
    update: {},
    create: {
      username: 'player2',
      password: passwordHash,
    },
  })

  const user3 = await prisma.user.upsert({
    where: { username: 'player3' },
    update: {},
    create: {
      username: 'player3',
      password: passwordHash,
    },
  })

  const game = await prisma.game.create({
    data: {
      name: 'Test Game',
      creatorId: user1.id,
      users: {
        connect: [{ id: user1.id }, { id: user2.id }],
      },
    },
  })

  console.log('Seed data created:', { user1, user2, user3, game })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
