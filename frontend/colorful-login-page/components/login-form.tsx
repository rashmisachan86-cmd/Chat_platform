"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login submitted:", { username, password })
  }

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in-up">
      {/* Logo/Title Section */}
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
          GOD X
        </h1>
        <p className="text-slate-400 text-sm">Private Chat Application</p>
      </div>

      {/* Glassmorphic Card */}
      <Card className="relative border border-white/10 shadow-2xl backdrop-blur-xl bg-slate-900/40 overflow-hidden">
        {/* Subtle border glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-50" />

        <div className="relative">
          <CardHeader className="space-y-1 pb-6">
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <p className="text-sm text-slate-400">Sign in to continue</p>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-slate-300">
                  Username
                </Label>
                <div className="relative group">
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 bg-slate-800/50 border-slate-700/50 text-pink-200 placeholder:text-pink-200/40 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
                    required
                  />
                  {/* Focus glow effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500/0 via-purple-500/0 to-pink-500/0 group-focus-within:from-pink-500/10 group-focus-within:via-purple-500/10 group-focus-within:to-pink-500/10 blur-xl transition-all duration-300 -z-10" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-300">
                  Password
                </Label>
                <div className="relative group">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pr-12 bg-slate-800/50 border-slate-700/50 text-pink-200 placeholder:text-pink-200/40 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-pink-300 transition-all duration-200 hover:scale-110"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {/* Focus glow effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500/0 via-purple-500/0 to-pink-500/0 group-focus-within:from-pink-500/10 group-focus-within:via-purple-500/10 group-focus-within:to-pink-500/10 blur-xl transition-all duration-300 -z-10" />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 mt-6 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 hover:from-pink-600 hover:via-purple-600 hover:to-violet-600 text-white font-semibold shadow-lg hover:shadow-pink-500/50 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
              >
                Sign In
              </Button>
            </CardContent>
          </form>
        </div>
      </Card>
    </div>
  )
}
