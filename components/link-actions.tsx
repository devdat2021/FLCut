"use client"

import { useState } from "react"
import { MoreHorizontal, Trash2, PowerOff, Power, Gauge, Copy, Check } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
interface LinkActionsProps {
    linkId: string
    isDisabled: boolean
    clickCap: number | null
    shortSlug: string
}

export function LinkActions({ linkId, isDisabled, clickCap, shortSlug }: LinkActionsProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [capDialogOpen, setCapDialogOpen] = useState(false)
    const [capValue, setCapValue] = useState(clickCap?.toString() ?? "")
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        await navigator.clipboard.writeText(`${window.location.origin}/${shortSlug}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    async function handleDelete() {
        if (!confirm("Delete this link? This cannot be undone.")) return
        setLoading(true)
        await fetch(`/api/links/${linkId}`, { method: "DELETE" })
        router.refresh()
        setLoading(false)
    }
    async function handleCapSave() {
        setLoading(true)
        const parsed = capValue.trim() === "" ? null : parseInt(capValue)
        await fetch(`/api/links/${linkId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clickCap: parsed }),
        })
        setCapDialogOpen(false)
        router.refresh()
        setLoading(false)
    }
    async function handleToggle() {
        setLoading(true)
        await fetch(`/api/links/${linkId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                expiresAt: isDisabled ? null : new Date().toISOString(),
            }),
        })
        router.refresh()
        setLoading(false)
    }
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={loading} className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleToggle}>
                        {isDisabled ? (
                            <>
                                <Power className="h-4 w-4 mr-2" />
                                Enable link
                            </>
                        ) : (
                            <>
                                <PowerOff className="h-4 w-4 mr-2" />
                                Disable link
                            </>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                        setCapValue(clickCap?.toString() ?? "")
                        setCapDialogOpen(true)
                    }}>
                        <Gauge className="h-4 w-4 mr-2" />
                        Click cap
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopy}>
                        {copied ? (
                            <>
                                <Check className="h-4 w-4 mr-2" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy link
                            </>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleDelete}
                        className="text-destructive focus:text-destructive"
                    ></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleDelete}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete link
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {/* Click cap dialog */}
            <Dialog open={capDialogOpen} onOpenChange={setCapDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>XClick cap</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        <Label htmlFor="cap">Max clicks</Label>
                        <Input
                            id="cap"
                            type="number"
                            min={1}
                            placeholder="e.g. 100 (leave empty to remove cap)"
                            value={capValue}
                            onChange={(e) => setCapValue(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Once the cap is hit, visitors will be sent to the expired page.
                            Leave empty to remove the cap.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCapDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCapSave} disabled={loading}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}