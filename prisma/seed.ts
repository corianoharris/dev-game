import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    try {
        // Clear existing data
        await prisma.submission.deleteMany()
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

        console.log('Created user:', user)

        // Create challenges
        const challenges = await prisma.challenge.createMany({
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

        console.log('Created challenges:', challenges)

    } catch (error) {
        console.error('Error seeding database:', error)
        throw error
    }
}

main()
    .then(async () => {
        console.log('Seeding complete!')
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('Error in seed script:', e)
        await prisma.$disconnect()
        process.exit(1)
    })