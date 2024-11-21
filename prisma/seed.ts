import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main()
{
    try
    {
        // Clear existing data
        await prisma.submission.deleteMany()
        await prisma.badge.deleteMany()
        await prisma.challenge.deleteMany()
        await prisma.user.deleteMany()

        // Create test user
        const hashedPassword = await bcrypt.hash('password123', 10)
        const user = await prisma.user.create({
            data: {
                email: 'test@test.com',
                name: 'Test User',
                password: hashedPassword,
                points: 100,
                level: 1,
            },
        })

        // Create badges
        const earlyBirdBadge = await prisma.badge.create({
            data: {
                name: 'Early Bird',
                description: 'First to complete a challenge',
                level: 1,
                users: {
                    connect: {
                        id: user.id
                    }
                }
            },
        })

        await prisma.badge.createMany({
            data: [
                {
                    name: 'Code Warrior',
                    description: 'Complete 5 challenges',
                    level: 2,
                },
                {
                    name: 'Problem Solver',
                    description: 'Complete a hard challenge',
                    level: 3,
                },
            ],
        })

        // Create challenges
        await prisma.challenge.createMany({
            data: [
                {
                    title: 'FizzBuzz',
                    description: 'Write a function that implements FizzBuzz.',
                    difficulty: 'EASY',
                    points: 100,
                },
                {
                    title: 'Binary Search',
                    description: 'Implement binary search algorithm.',
                    difficulty: 'MEDIUM',
                    points: 200,
                },
                {
                    title: 'Graph Traversal',
                    description: 'Implement DFS and BFS for a graph.',
                    difficulty: 'HARD',
                    points: 300,
                },
            ],
        })

        console.log({
            user: user.id,
            badge: earlyBirdBadge.id,
        })

        console.log('Seeding completed')
    } catch (error)
    {
        console.error('Error seeding database:', error)
        throw error
    }
}

main()
    .then(async () =>
    {
        await prisma.$disconnect()
    })
    .catch(async (e) =>
    {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })