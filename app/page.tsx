"use client"

import { useState } from "react"
import { Link2, ArrowRight, Copy, Check, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function HomePage() {
  const [url, setUrl] = useState("")
  const [customSlug, setCustomSlug] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [scheduledAt, setScheduledAt] = useState("")
  const [clickCap, setClickCap] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ shortSlug: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const shortUrl = result
    ? `${window.location.origin}/${result.shortSlug}`
    : null

  async function handleSubmit() {
    if (!url.trim()) {
      setError("Please enter a URL")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalUrl: url.trim(),
          customSlug: customSlug.trim() || undefined,
          expiresAt: expiresAt || undefined,
          scheduledAt: scheduledAt || undefined,
          clickCap: clickCap ? parseInt(clickCap) : undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong")
        return
      }

      setResult(data)
      setUrl("")
      setCustomSlug("")
      setExpiresAt("")
      setScheduledAt("")
      setClickCap("")
    } catch (e) {
      setError("Network error — please try again")
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!shortUrl) return
    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard →
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-6 py-20">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Short links for FLC events
          </h1>
          <p className="text-muted-foreground text-base">
            Shorten, schedule, and track links for registrations, resource drops,
            and feedback forms.
          </p>
        </div>

        {/* Form card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create a short link</CardTitle>
            <CardDescription>
              Paste a long URL and get a clean, trackable link.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* URL input */}
            <div className="space-y-1.5">
              <Label htmlFor="url">Destination URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="eg: https://forms.gle/your-registration-form"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            {/* Custom slug */}
            <div className="space-y-1.5">
              <Label htmlFor="slug">
                Custom alias{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {window.location.host}/
                </span>
                <Input
                  id="slug"
                  placeholder="hackfest26"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                />
              </div>
            </div>

            {/* Advanced toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {showAdvanced ? "− Hide" : "+ Show"} advanced options
            </button>

            {showAdvanced && (
              <div className="space-y-4 pt-1 border-t pt-4">

                <div className="space-y-1.5">
                  <Label htmlFor="scheduledAt">Go live at</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Link won't redirect until this time.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="expiresAt">Expires at</Label>
                  <Input
                    id="expiresAt"
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Link stops redirecting after this time.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="clickCap">Click cap</Label>
                  <Input
                    id="clickCap"
                    type="number"
                    min={1}
                    placeholder="e.g. 100"
                    value={clickCap}
                    onChange={(e) => setClickCap(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    After this many clicks, visitors are sent to the expired page. Useful for capped registrations.
                  </p>
                </div>

              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Shortening..." : "Shorten link"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </CardContent>
        </Card>

        {/* Result */}
        {result && shortUrl && (
          <Card className="mt-4 border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">
                Your short link is ready
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm font-mono bg-background border rounded-md px-3 py-2 truncate">
                  {shortUrl}
                </code>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-md border bg-background hover:bg-muted transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md border bg-background hover:bg-muted transition-colors"
                  title="Open link"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                View all your links in the{" "}
                <a href="/dashboard" className="underline underline-offset-2 hover:text-foreground transition-colors">
                  dashboard
                </a>
              </p>
            </CardContent>
          </Card>
        )}
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
            · Finite Loop Club (Selection Phase 1)  · 2026
          </p>
        </div>
      </footer>
    </div>
  )
}
// "use client"

// import { useState } from "react"
// import { Link2, ArrowRight, Copy, Check, ExternalLink } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

// export default function HomePage() {
//   const [url, setUrl] = useState("")
//   const [customSlug, setCustomSlug] = useState("")
//   const [expiresAt, setExpiresAt] = useState("")
//   const [scheduledAt, setScheduledAt] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [result, setResult] = useState<{ shortSlug: string } | null>(null)
//   const [error, setError] = useState<string | null>(null)
//   const [copied, setCopied] = useState(false)
//   const [showAdvanced, setShowAdvanced] = useState(false)

//   const shortUrl = result
//     ? `${window.location.origin}/${result.shortSlug}`
//     : null

//   async function handleSubmit() {
//     if (!url.trim()) {
//       setError("Please enter a URL")
//       return
//     }

//     setLoading(true)
//     setError(null)
//     setResult(null)

//     try {
//       const res = await fetch("/api/links", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           originalUrl: url.trim(),
//           customSlug: customSlug.trim() || undefined,
//           expiresAt: expiresAt || undefined,
//           scheduledAt: scheduledAt || undefined,
//         }),
//       })

//       const data = await res.json()

//       if (!res.ok) {
//         setError(data.error || "Something went wrong")
//         return
//       }

//       setResult(data)
//       setUrl("")
//       setCustomSlug("")
//       setExpiresAt("")
//       setScheduledAt("")
//     } catch (e) {
//       setError("Network error — please try again")
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function handleCopy() {
//     if (!shortUrl) return
//     await navigator.clipboard.writeText(shortUrl)
//     setCopied(true)
//     setTimeout(() => setCopied(false), 2000)
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="border-b">
//         <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Link2 className="h-5 w-5" />
//             <span className="font-semibold text-lg tracking-tight">FLCut</span>
//             <Badge variant="secondary" className="text-xs">
//               Finite Loop Club
//             </Badge>
//           </div>
//           <a
//             href="/dashboard"
//             className="text-sm text-muted-foreground hover:text-foreground transition-colors"
//           >
//             Dashboard →
//           </a>
//         </div>
//       </header>

//       <main className="max-w-xl mx-auto px-6 py-20">
//         {/* Hero */}
//         <div className="text-center mb-10">
//           <h1 className="text-4xl font-bold tracking-tight mb-3">
//             Short links for FLC events
//           </h1>
//           <p className="text-muted-foreground text-base">
//             Shorten, schedule, and track links for registrations, resource drops,
//             and feedback forms.
//           </p>
//         </div>

//         {/* Form card */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-base">Create a short link</CardTitle>
//             <CardDescription>
//               Paste a long URL and get a clean, trackable link.
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {/* URL input */}
//             <div className="space-y-1.5">
//               <Label htmlFor="url">Destination URL</Label>
//               <Input
//                 id="url"
//                 type="url"
//                 placeholder="https://forms.gle/your-registration-form"
//                 value={url}
//                 onChange={(e) => setUrl(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
//               />
//             </div>

//             {/* Custom slug */}
//             <div className="space-y-1.5">
//               <Label htmlFor="slug">
//                 Custom alias{" "}
//                 <span className="text-muted-foreground font-normal">
//                   (optional)
//                 </span>
//               </Label>
//               <div className="flex items-center gap-2">
//                 <span className="text-sm text-muted-foreground whitespace-nowrap">
//                   flcut.in/
//                 </span>
//                 <Input
//                   id="slug"
//                   placeholder="hackfest26"
//                   value={customSlug}
//                   onChange={(e) => setCustomSlug(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Advanced toggle */}
//             <button
//               type="button"
//               onClick={() => setShowAdvanced(!showAdvanced)}
//               className="text-sm text-muted-foreground hover:text-foreground transition-colors"
//             >
//               {showAdvanced ? "− Hide" : "+ Show"} scheduling options
//             </button>

//             {showAdvanced && (
//               <div className="space-y-4 pt-1">
//                 <div className="space-y-1.5">
//                   <Label htmlFor="scheduledAt">Go live at</Label>
//                   <Input
//                     id="scheduledAt"
//                     type="datetime-local"
//                     value={scheduledAt}
//                     onChange={(e) => setScheduledAt(e.target.value)}
//                   />
//                   <p className="text-xs text-muted-foreground">
//                     Link won't redirect until this time.
//                   </p>
//                 </div>

//                 <div className="space-y-1.5">
//                   <Label htmlFor="expiresAt">Expires at</Label>
//                   <Input
//                     id="expiresAt"
//                     type="datetime-local"
//                     value={expiresAt}
//                     onChange={(e) => setExpiresAt(e.target.value)}
//                   />
//                   <p className="text-xs text-muted-foreground">
//                     Link stops redirecting after this time.
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Error */}
//             {error && (
//               <p className="text-sm text-destructive">{error}</p>
//             )}

//             {/* Submit */}
//             <button
//               type="button"
//               onClick={handleSubmit}
//               disabled={loading}
//               className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
//             >
//               {loading ? "Shortening..." : "Shorten link"}
//               {!loading && <ArrowRight className="h-4 w-4" />}
//             </button>
//           </CardContent>
//         </Card>

//         {/* Result */}
//         {result && shortUrl && (
//           <Card className="mt-4 border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
//             <CardContent className="pt-6">
//               <p className="text-sm text-muted-foreground mb-2">
//                 Your short link is ready
//               </p>
//               <div className="flex items-center gap-2">
//                 <code className="flex-1 text-sm font-mono bg-background border rounded-md px-3 py-2 truncate">
//                   {shortUrl}
//                 </code>
//                 <button
//                   onClick={handleCopy}
//                   className="p-2 rounded-md border bg-background hover:bg-muted transition-colors"
//                   title="Copy to clipboard"
//                 >
//                   {copied ? (
//                     <Check className="h-4 w-4 text-green-600" />
//                   ) : (
//                     <Copy className="h-4 w-4" />
//                   )}
//                 </button>
//                 <a
//                   href={shortUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="p-2 rounded-md border bg-background hover:bg-muted transition-colors"
//                   title="Open link"
//                 >
//                   <ExternalLink className="h-4 w-4" />
//                 </a>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </main>
//       {/* Footer */}
//       <footer className="border-t">
//         <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Link2 className="h-4 w-4 text-muted-foreground" />
//             <span className="text-sm font-medium">FLCut</span>
//           </div>
//           <p className="text-xs text-muted-foreground">
//             Built by{" "}
//             <a
//               href="https://github.com/devdat2021"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="hover:text-foreground transition-colors underline underline-offset-2"
//             >
//               Devdat
//             </a>{" "}
//             · Finite Loop Club (Selection Phase 1) · 2026
//           </p>
//         </div>
//       </footer>
//     </div>
//   )
// }