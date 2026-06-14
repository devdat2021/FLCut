import { Timer } from "lucide-react"
import Link from "next/link"

export default function NotYetPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
            <div className="text-center max-w-md">
                <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-muted">
                        <Timer className="h-8 w-8 text-muted-foreground" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold mb-2">Not open yet</h1>
                <p className="text-muted-foreground mb-6">
                    This link isn't live yet. The organizer has scheduled it to open at a
                    specific time — check back soon.
                </p>
                <Link
                    href="/"
                    className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                >
                    Go to FLCut
                </Link>
            </div>
        </div>
    )
}