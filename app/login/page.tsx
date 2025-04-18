"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simular login bem-sucedido
    router.push("/crm")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="space-y-1 pb-2 pt-6">
          <div className="flex justify-center mb-4">
            <Image src="/images/logo.png" alt="CORE CAPITAL" width={70} height={28} className="h-auto w-auto" />
          </div>
          <CardTitle className="text-lg font-normal text-center">Login</CardTitle>
          <CardDescription className="text-center text-xs">
            Entre com suas credenciais para acessar o CRM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-9 text-sm"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-9 bg-[#002147] hover:bg-[#00326b] transition-colors text-sm font-normal"
            >
              Entrar
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-gray-50 px-2 text-gray-400 text-[10px]">Ou continue com</span>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button variant="outline" className="w-auto h-8 text-xs px-3 py-1 border-gray-200">
              <Mail className="mr-1.5 h-3 w-3" />
              Google
            </Button>
            <Button variant="outline" className="w-auto h-8 text-xs px-3 py-1 border-gray-200">
              <Linkedin className="mr-1.5 h-3 w-3" />
              LinkedIn
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pt-0 pb-6">
          <Link href="/" className="text-[10px] text-gray-500 hover:text-[#002147]">
            Voltar para página inicial
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
