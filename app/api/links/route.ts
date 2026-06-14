import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSlug, isReserved } from "@/lib/utils"

export async function POST(req: NextRequest) {
    const { originalUrl, customSlug, expiresAt, scheduledAt, clickCap } = await req.json()

    if (!originalUrl) {
        return NextResponse.json({ error: "originalUrl is required" }, { status: 400 })
    }

    const slug = customSlug?.trim() || generateSlug()

    if (isReserved(slug)) {
        return NextResponse.json({ error: "That slug is reserved" }, { status: 400 })
    }

    try {
        const link = await prisma.link.create({
            data: {
                shortSlug: slug,
                originalUrl,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                clickCap: clickCap ?? null,
            },
        })
        return NextResponse.json(link, { status: 201 })
    } catch (e: any) {
        if (e.code === "P2002") {
            // Prisma unique constraint violation
            return NextResponse.json({ error: "Slug already taken" }, { status: 409 })
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}