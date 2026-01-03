import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Dark premium background with subtle gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900" />

      {/* Subtle animated orbs for depth */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600 rounded-full blur-[120px] animate-pulse-slow" />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-pink-600 rounded-full blur-[120px] animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full">
        <LoginForm />
      </div>
    </div>
  )
}
