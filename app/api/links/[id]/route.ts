import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    try {
        await prisma.link.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (e) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    const { id } = await params
    const body = await req.json()

    try {
        const link = await prisma.link.update({
            where: { id },
            data: {
                ...(body.expiresAt !== undefined && { expiresAt: body.expiresAt === null ? null : new Date(body.expiresAt) }),
                ...(body.clickCap !== undefined && { clickCap: body.clickCap }),
            },
        })
        return NextResponse.json(link)
    } catch (e) {
        return NextResponse.json({ error: "Failed to update" }, { status: 500 })
    }

}