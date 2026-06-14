import { LinkIcon } from "lucide-react"
import Link from "next/link"

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
            <div className="text-center max-w-md">
                <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-muted">
                        <LinkIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold mb-2">Link not found</h1>
                <p className="text-muted-foreground mb-6">
                    This short link doesn't exist. Double-check the URL or contact the
                    person who shared it with you.
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