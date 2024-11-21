import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request)
{
    try
    {
        const session = await getServerSession(authOptions)
        if (!session?.user)
        {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { challengeId, code } = await req.json()

        // Validate submission
        const challenge = await prisma.challenge.findUnique({
            where: { id: challengeId }
        })

        if (!challenge)
        {
            return NextResponse.json(
                { message: 'Challenge not found' },
                { status: 404 }
            )
        }

        // Create submission
        const submission = await prisma.submission.create({
            data: {
                code,
                status: 'PENDING',
                userId: session.user.id,
                challengeId,
            }
        })

        // Update user points (simplified for example)
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                points: { increment: challenge.points }
            }
        })

        return NextResponse.json(submission)
    } catch (error)
    {
        console.error('Submission error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}