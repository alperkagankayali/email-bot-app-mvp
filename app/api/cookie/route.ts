import { cookiesOpt } from "@/constants";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const getCookie = async (name: string) => {
  const cookieStore = cookies();
  return cookieStore.get(name)?.value ?? "";
};

const deleteCookie = async (name: string) => {
  const cookieStore = cookies();
  return cookieStore.delete(name);
};

const changeCookie = async (name: string, token: string) => {
  const cookieStore = cookies();
  return cookieStore.set(name, token, cookiesOpt);
};

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") ?? "";
  const res = await getCookie(name);
  const verificationResult: any = await verifyToken(res);
  if (verificationResult instanceof NextResponse) {
    await deleteCookie(name);
    return verificationResult; // 401 döndürecek
  } else {
    return NextResponse.json(res, { status: 200 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") ?? "";
  const token = searchParams.get("token") ?? "";
  const res = await changeCookie(name, token);
  return NextResponse.json(res, { status: 200 });
}
