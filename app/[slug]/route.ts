import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getDevice } from "@/lib/utils"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params
    const now = new Date()

    const link = await prisma.link.findUnique({
        where: { shortSlug: slug },
    })

    // Not found
    if (!link) {
        return NextResponse.redirect(new URL("/not-found", req.url))
    }

    // Not yet live
    if (link.scheduledAt && now < link.scheduledAt) {
        return NextResponse.redirect(new URL("/not-yet", req.url))
    }

    // Expired
    if (link.expiresAt && now > link.expiresAt) {
        return NextResponse.redirect(new URL("/expired", req.url))
    }

    // Click cap check
    if (link.clickCap !== null) {
        const totalClicks = await prisma.analyticsEvent.count({
            where: { linkId: link.id },
        })
        if (totalClicks >= link.clickCap) {
            return NextResponse.redirect(new URL("/expired", req.url))
        }
    }

    // --- Analytics logging (fire and forget) ---
    const ua = req.headers.get("user-agent") || ""
    const referrer = req.headers.get("referer") || null
    const device = getDevice(ua)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"

    // Bot detection — skip logging if looks like a bot
    const isBot = /bot|crawl|spider|slurp|mediapartners|facebookexternalhit|whatsapp|telegram/i.test(ua)
    if (!isBot) {
        try {
            const existing = await prisma.analyticsEvent.findFirst({
                where: {
                    linkId: link.id,
                    ipHash: ip,
                    timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
                },
            })

            await prisma.analyticsEvent.create({
                data: {
                    linkId: link.id,
                    referrer,
                    device,
                    ipHash: ip,
                    isUnique: !existing,
                },
            })
        } catch (e) {
            console.error("Analytics error:", e)
        }
    }

    return NextResponse.redirect(link.originalUrl, { status: 307 })
    // if (!isBot) {
    //     // Unique = no prior event from this IP for this link in last 24h
    //     prisma.analyticsEvent.findFirst({
    //         where: {
    //             linkId: link.id,
    //             ipHash: ip, // we'll store a hashed IP
    //             timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    //         },
    //     }).then((existing) => {
    //         prisma.analyticsEvent.create({
    //             data: {
    //                 linkId: link.id,
    //                 referrer,
    //                 device,
    //                 ipHash: ip,
    //                 isUnique: !existing,
    //             },
    //         }).catch(() => { })
    //     }).catch(() => { })
    // }

    // return NextResponse.redirect(link.originalUrl, { status: 307 })
}