import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    try {
        // Clear existing data
        await prisma.submission.deleteMany()
        await prisma.badge.deleteMany()
        await prisma.challenge.deleteMany()
        await prisma.user.deleteMany()

        // Create multiple users with different levels and points
        const users = await Promise.all([
            prisma.user.create({
                data: {
                    email: 'test@test.com',
                    name: 'Test User',
                    password: await bcrypt.hash('password123', 10),
                    points: 1200,
                    level: 5,
                }
            }),
            prisma.user.create({
                data: {
                    email: 'john.doe@example.com',
                    name: 'John Doe',
                    password: await bcrypt.hash('password123', 10),
                    points: 1500,
                    level: 6,
                }
            }),
            prisma.user.create({
                data: {
                    email: 'jane.smith@example.com',
                    name: 'Jane Smith',
                    password: await bcrypt.hash('password123', 10),
                    points: 2000,
                    level: 8,
                }
            }),
            prisma.user.create({
                data: {
                    email: 'alex.dev@example.com',
                    name: 'Alex Dev',
                    password: await bcrypt.hash('password123', 10),
                    points: 1800,
                    level: 7,
                }
            }),
            prisma.user.create({
                data: {
                    email: 'sarah.coder@example.com',
                    name: 'Sarah Coder',
                    password: await bcrypt.hash('password123', 10),
                    points: 2200,
                    level: 9,
                }
            }),
            prisma.user.create({
                data: {
                    email: 'mike.tech@example.com',
                    name: 'Mike Tech',
                    password: await bcrypt.hash('password123', 10),
                    points: 1100,
                    level: 4,
                }
            }),
            prisma.user.create({
                data: {
                    email: 'emma.hacker@example.com',
                    name: 'Emma Hacker',
                    password: await bcrypt.hash('password123', 10),
                    points: 1900,
                    level: 7,
                }
            })
        ])

        // Create badges with user connections
        await prisma.badge.create({
            data: {
                name: 'Early Bird',
                description: 'First to complete a challenge',
                level: 1,
                users: {
                    connect: [
                        { id: users[0].id }, // Test User
                        { id: users[2].id }, // Jane Smith
                        { id: users[4].id }  // Sarah Coder
                    ]
                }
            },
        })

        await prisma.badge.create({
            data: {
                name: 'Code Warrior',
                description: 'Complete 5 challenges',
                level: 2,
                users: {
                    connect: [
                        { id: users[2].id }, // Jane Smith
                        { id: users[4].id }  // Sarah Coder
                    ]
                }
            }
        })

        await prisma.badge.create({
            data: {
                name: 'Problem Solver',
                description: 'Complete a hard challenge',
                level: 3,
                users: {
                    connect: [
                        { id: users[4].id }  // Sarah Coder
                    ]
                }
            }
        })

        // Create challenges and store their IDs
        const fizzBuzz = await prisma.challenge.create({
            data: {
                title: 'FizzBuzz',
                description: 'Write a function that implements FizzBuzz.',
                difficulty: 'EASY',
                points: 100,
            }
        })

        const binarySearch = await prisma.challenge.create({
            data: {
                title: 'Binary Search',
                description: 'Implement binary search algorithm.',
                difficulty: 'MEDIUM',
                points: 200,
            }
        })

        // Create additional challenges
        await prisma.challenge.createMany({
            data: [
                {
                    title: 'Graph Traversal',
                    description: 'Implement DFS and BFS for a graph.',
                    difficulty: 'HARD',
                    points: 300,
                },
                {
                    title: 'Quick Sort',
                    description: 'Implement the Quick Sort algorithm.',
                    difficulty: 'MEDIUM',
                    points: 200,
                },
                {
                    title: 'Dynamic Programming',
                    description: 'Solve the Knapsack problem using dynamic programming.',
                    difficulty: 'HARD',
                    points: 300,
                }
            ],
        })

        // Create submissions using actual challenge IDs
        await prisma.submission.createMany({
            data: [
                {
                    code: 'console.log("FizzBuzz")',
                    status: 'COMPLETED',
                    userId: users[4].id, // Sarah Coder
                    challengeId: fizzBuzz.id,
                },
                {
                    code: 'function binarySearch() {}',
                    status: 'COMPLETED',
                    userId: users[2].id, // Jane Smith
                    challengeId: binarySearch.id,
                }
            ]
        })

        console.log('Seeding completed successfully')
    } catch (error) {
        console.error('Error seeding database:', error)
        throw error
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })