import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ToastProvider } from "@/components/ui/toast"

export default function Home()
{
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Welcome to Dev Gamification
        </h1>
        <p className="text-lg text-muted-foreground">
          Learn, compete, and level up your development skills
        </p>
        <div className="space-x-4">
          <Link href="/login">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
      <ToastProvider />
    </main>
  )
}