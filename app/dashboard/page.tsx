import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LinkActions } from "@/components/link-actions"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Link2, MousePointerClick, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
    let links: any[] = []

    try {
        links = await prisma.link.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                _count: { select: { analytics: true } },
            },
        })
    } catch (e) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-destructive">Failed to connect to database.</p>
            </main>
        )
    }

    const now = new Date()

    function getStatus(link: (typeof links)[0]) {
        if (link.expiresAt && now > link.expiresAt) return "deactivated"
        if (link.scheduledAt && now < link.scheduledAt) return "scheduled"
        return "active"
    }

    const totalClicks = links.reduce((sum, l) => sum + l._count.analytics, 0)
    const activeLinks = links.filter((l) => getStatus(l) === "active").length
    const expiredLinks = links.filter((l) => getStatus(l) === "deactivated").length

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link2 className="h-5 w-5" />
                        <span className="font-semibold text-lg tracking-tight">FLCut</span>
                        <Badge variant="secondary" className="text-xs">
                            Finite Loop Club
                        </Badge>
                    </div>
                    <a
                        href="/"
                        className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                    >
                        + New Link
                    </a>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Links
                            </CardTitle>
                            <Link2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{links.length}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {activeLinks} active · {expiredLinks} expired
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Clicks
                            </CardTitle>
                            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{totalClicks}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Across all links
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Avg. Clicks / Link
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                {links.length ? (totalClicks / links.length).toFixed(1) : "0"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Per shortened link
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Links table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Your Links</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {links.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <Link2 className="h-8 w-8 text-muted-foreground mb-3" />
                                <p className="font-medium">No links yet</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Create your first short link to get started.
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6">Short Link</TableHead>
                                        <TableHead>Destination</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Clicks</TableHead>
                                        <TableHead className="pr-6">Created</TableHead>
                                        <TableHead className="pr-6">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {links.map((link) => {
                                        const status = getStatus(link)
                                        return (
                                            <TableRow key={link.id}>
                                                <TableCell className="pl-6 font-mono text-sm font-medium">
                                                    /{link.shortSlug}
                                                </TableCell>
                                                <TableCell className="max-w-xs">
                                                    <span className="truncate block text-sm text-muted-foreground max-w-[240px]">
                                                        {link.originalUrl}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            status === "active"
                                                                ? "default"
                                                                : status === "deactivated"
                                                                    ? "destructive"
                                                                    : "secondary"
                                                        }
                                                    >
                                                        {status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="tabular-nums">
                                                    {link._count.analytics}
                                                </TableCell>
                                                <TableCell className="pr-6 text-sm text-muted-foreground">
                                                    {link.createdAt.toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </TableCell>
                                                <TableCell className="pr-4">
                                                    <LinkActions
                                                        linkId={link.id}
                                                        isDisabled={!!link.expiresAt && now > new Date(link.expiresAt)}
                                                        clickCap={link.clickCap}
                                                        shortSlug={link.shortSlug}
                                                    />
                                                    {/* <LinkActions
                                                        linkId={link.id}
                                                        isDisabled={!!link.expiresAt && now > new Date(link.expiresAt)}
                                                        clickCap={link.clickCap}
                                                    /> */}
                                                    {/* <LinkActions
                                                        linkId={link.id}
                                                        isDisabled={!!link.expiresAt && now > new Date(link.expiresAt)}
                                                    /> */}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </main>
            {/* Footer */}
            <footer className="border-t">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">FLCut</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Built by{" "}
                        <a
                            href="https://github.com/devdat2021"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors underline underline-offset-2"
                        >
                            Devdat
                        </a>{" "}
                        · Finite Loop Club (Selection Phase 1) · 2026
                    </p>
                </div>
            </footer>
        </div>
    )
}