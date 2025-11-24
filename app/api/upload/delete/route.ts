import { rmSync, existsSync } from "fs"
import { join } from "path"
import { NextResponse, type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { path, type } = await request.json()

    if (!path || !type) {
      return NextResponse.json({ error: "Path y type requeridos" }, { status: 400 })
    }

    const uploadDir = type === "categoria" ? "categorias" : "productos"
    const filepath = join(process.cwd(), "public", uploadDir, path)

    if (existsSync(filepath)) {
      try {
        rmSync(filepath, { force: true })
        console.log("[v0] Image deleted successfully:", path)
      } catch (err) {
        console.error("[v0] Error deleting file:", err)
        return NextResponse.json({ error: "Error al eliminar imagen" }, { status: 500 })
      }
    } else {
      console.log("[v0] File not found:", filepath)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete error:", error)
    return NextResponse.json({ error: "Error al eliminar imagen" }, { status: 500 })
  }
}
