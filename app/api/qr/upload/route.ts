import { writeFile, unlink } from "fs/promises"
import { join } from "path"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validar que sea imagen
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must not exceed 5MB" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ruta donde se guardará el QR
    const qrPath = join(process.cwd(), "public", "qr-pago.jpg")

    // Intentar eliminar el QR anterior si existe
    try {
      await unlink(qrPath)
    } catch (err) {
      // Archivo no existe, continuamos
    }

    // Guardar el nuevo QR
    await writeFile(qrPath, buffer)

    return NextResponse.json({
      success: true,
      message: "QR uploaded successfully",
      path: "/qr-pago.jpg",
    })
  } catch (error) {
    console.error("Error uploading QR:", error)
    return NextResponse.json({ error: "Failed to upload QR" }, { status: 500 })
  }
}

// GET para verificar si existe el QR
export async function GET() {
  try {
    const qrPath = join(process.cwd(), "public", "qr-pago.jpg")
    await unlink(qrPath)
    return NextResponse.json({ exists: true })
  } catch {
    return NextResponse.json({ exists: false })
  }
}

// DELETE para eliminar el QR
export async function DELETE() {
  try {
    const qrPath = join(process.cwd(), "public", "qr-pago.jpg")
    await unlink(qrPath)
    return NextResponse.json({
      success: true,
      message: "QR deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting QR:", error)
    return NextResponse.json({ error: "Failed to delete QR" }, { status: 500 })
  }
}
