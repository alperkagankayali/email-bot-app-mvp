import { NextRequest } from "next/server";

export async function handleAuthControl(req: NextRequest) {
  const token = req.headers.get("authorization"); // API anahtarı kontrolü
  return !!token;
}
