import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const name = formData.get("name") as string

    if (!file || !name) {
      return NextResponse.json({ error: "Archivo y nombre requeridos" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const filename = `${name.toLowerCase().replace(/\s+/g, "-")}.png`
    const uploadDir = join(process.cwd(), "public", "categorias")

    try {
      await mkdir(uploadDir, { recursive: true })
    } catch {
      // directorio ya existe
    }

    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    return NextResponse.json({
      path: `/categorias/${filename}`,
      filename: filename,
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Error al subir imagen" }, { status: 500 })
  }
}
