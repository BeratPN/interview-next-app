import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "Dosya gelmedi" }, { status: 400 });

    // Desteklenen formatlar
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
    if (!allowedTypes.includes(file.type))
      return NextResponse.json({ error: "Desteklenmeyen dosya tipi" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const imagesDir = path.join(process.cwd(), "public/images");
    fs.mkdirSync(imagesDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(imagesDir, fileName);

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ url: `/images/${fileName}` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Upload hatası" }, { status: 500 });
  }
}
