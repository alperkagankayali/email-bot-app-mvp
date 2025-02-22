import { IResponseType } from "@/types/responseType";
import type { GetProp, UploadProps } from "antd";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export const servicesBaseUrl =
  process.env.NODE_ENV === "production"
    ? "https://email-bot-app-mvp-mx28.vercel.app/api"
    : `http://localhost:${process.env.PORT || 3000}/api`;

export function jsonToQueryString(json: any) {
  return (
    "?" +
    Object.keys(json)
      .map(function (key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
      })
      .join("&")
  );
}

export function queryStringTo(str: string) {
  return Object.fromEntries(new URLSearchParams(str));
}

export const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const message200: IResponseType = {
  status: 200,
  color: "success",
  data: null,
  message: "success-200",
  success: true,
};
export const message201: IResponseType = {
  status: 201,
  color: "success",
  data: null,
  message: "success-201",
  success: true,
};
export const message401: IResponseType = {
  status: 401,
  color: "danger",
  data: null,
  message: "danger-401",
  success: false,
};
export const message404: IResponseType = {
  status: 404,
  color: "danger",
  data: null,
  message: "danger-404",
  success: false,
};
export const message500: IResponseType = {
  status: 500,
  color: "danger",
  data: null,
  message: "danger-500",
  success: false,
};
export const message403: IResponseType = {
  status: 403,
  color: "danger",
  data: null,
  message: "danger-403",
  success: false,
};
export const noImage =
  "data:image/png;base64,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";

export function base64ToBlob(base64: string, mimeType: string) {
  const byteString = atob(base64.split(",")[1]); // Base64'ü çöz
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeType });
}
const color = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
  "#f50",
  "#2db7f5",
  "#87d068",
  "#108ee9",
];
export const randomColor = () => {
  return color[Math.floor(Math.random() * color.length)];
};

export const languageCodeLists = [
  "ab",
  "af",
  "ak",
  "sq",
  "am",
  "ar",
  "an",
  "hy",
  "as",
  "av",
  "ae",
  "ay",
  "az",
  "bm",
  "ba",
  "eu",
  "be",
  "bn",
  "bh",
  "bi",
  "nb",
  "bs",
  "br",
  "bg",
  "my",
  "ca",
  "km",
  "ch",
  "ce",
  "ny",
  "zh",
  "cu",
  "cv",
  "kw",
  "co",
  "cr",
  "hr",
  "cs",
  "da",
  "dv",
  "nl",
  "dz",
  "en",
  "eo",
  "et",
  "ee",
  "fo",
  "fj",
  "fi",
  "fr",
  "ff",
  "gd",
  "gl",
  "lg",
  "ka",
  "de",
  "el",
  "gn",
  "gu",
  "ht",
  "ha",
  "he",
  "hz",
  "hi",
  "ho",
  "hu",
  "is",
  "io",
  "ig",
  "id",
  "ia",
  "ie",
  "iu",
  "ik",
  "ga",
  "it",
  "ja",
  "jv",
  "kl",
  "kn",
  "kr",
  "ks",
  "kk",
  "ki",
  "rw",
  "ky",
  "kv",
  "kg",
  "ko",
  "kj",
  "ku",
  "lo",
  "la",
  "lv",
  "li",
  "ln",
  "lt",
  "lu",
  "lb",
  "mk",
  "mg",
  "ms",
  "ml",
  "mt",
  "gv",
  "mi",
  "mr",
  "mh",
  "mn",
  "na",
  "nv",
  "nd",
  "nr",
  "ng",
  "ne",
  "se",
  "no",
  "nn",
  "oc",
  "oj",
  "or",
  "om",
  "os",
  "pi",
  "pa",
  "fa",
  "pl",
  "pt",
  "ps",
  "qu",
  "ro",
  "rm",
  "rn",
  "ru",
  "sm",
  "sg",
  "sa",
  "sc",
  "sr",
  "sn",
  "ii",
  "sd",
  "si",
  "sk",
  "sl",
  "so",
  "st",
  "es",
  "su",
  "sw",
  "ss",
  "sv",
  "tl",
  "ty",
  "tg",
  "ta",
  "tt",
  "te",
  "th",
  "bo",
  "ti",
  "to",
  "ts",
  "tn",
  "tr",
  "tk",
  "tw",
  "ug",
  "uk",
  "ur",
  "uz",
  "ve",
  "vi",
  "vo",
  "wa",
  "cy",
  "fy",
  "wo",
  "xh",
  "yi",
  "yo",
  "za",
  "zu",
];

export type languageEnum =
  | "ab"
  | "af"
  | "ak"
  | "sq"
  | "am"
  | "ar"
  | "an"
  | "hy"
  | "as"
  | "av"
  | "ae"
  | "ay"
  | "az"
  | "bm"
  | "ba"
  | "eu"
  | "be"
  | "bn"
  | "bh"
  | "bi"
  | "nb"
  | "bs"
  | "br"
  | "bg"
  | "my"
  | "ca"
  | "km"
  | "ch"
  | "ce"
  | "ny"
  | "zh"
  | "cu"
  | "cv"
  | "kw"
  | "co"
  | "cr"
  | "hr"
  | "cs"
  | "da"
  | "dv"
  | "nl"
  | "dz"
  | "en"
  | "eo"
  | "et"
  | "ee"
  | "fo"
  | "fj"
  | "fi"
  | "fr"
  | "ff"
  | "gd"
  | "gl"
  | "lg"
  | "ka"
  | "de"
  | "el"
  | "gn"
  | "gu"
  | "ht"
  | "ha"
  | "he"
  | "hz"
  | "hi"
  | "ho"
  | "hu"
  | "is"
  | "io"
  | "ig"
  | "id"
  | "ia"
  | "ie"
  | "iu"
  | "ik"
  | "ga"
  | "it"
  | "ja"
  | "jv"
  | "kl"
  | "kn"
  | "kr"
  | "ks"
  | "kk"
  | "ki"
  | "rw"
  | "ky"
  | "kv"
  | "kg"
  | "ko"
  | "kj"
  | "ku"
  | "lo"
  | "la"
  | "lv"
  | "li"
  | "ln"
  | "lt"
  | "lu"
  | "lb"
  | "mk"
  | "mg"
  | "ms"
  | "ml"
  | "mt"
  | "gv"
  | "mi"
  | "mr"
  | "mh"
  | "mn"
  | "na"
  | "nv"
  | "nd"
  | "nr"
  | "ng"
  | "ne"
  | "se"
  | "no"
  | "nn"
  | "oc"
  | "oj"
  | "or"
  | "om"
  | "os"
  | "pi"
  | "pa"
  | "fa"
  | "pl"
  | "pt"
  | "ps"
  | "qu"
  | "ro"
  | "rm"
  | "rn"
  | "ru"
  | "sm"
  | "sg"
  | "sa"
  | "sc"
  | "sr"
  | "sn"
  | "ii"
  | "sd"
  | "si"
  | "sk"
  | "sl"
  | "so"
  | "st"
  | "es"
  | "su"
  | "sw"
  | "ss"
  | "sv"
  | "tl"
  | "ty"
  | "tg"
  | "ta"
  | "tt"
  | "te"
  | "th"
  | "bo"
  | "ti"
  | "to"
  | "ts"
  | "tn"
  | "tr"
  | "tk"
  | "tw"
  | "ug"
  | "uk"
  | "ur"
  | "uz"
  | "ve"
  | "vi"
  | "vo"
  | "wa"
  | "cy"
  | "fy"
  | "wo"
  | "xh"
  | "yi"
  | "yo"
  | "za"
  | "zu";

export const languageColor = {
  ab: "#B4D3B2",
  af: "#F6C9B7",
  ak: "#E2B5D7",
  sq: "#B0D9F0",
  am: "#F1D0A0",
  ar: "#D8D9A6",
  an: "#C1C7D1",
  hy: "#C4C9A5",
  as: "#D5B0A1",
  av: "#B5A8C9",
  ae: "#E4D1B2",
  ay: "#D9B8A6",
  az: "#B0C1C8",
  bm: "#A9D6C4",
  ba: "#E0D3A1",
  eu: "#D8B7A0",
  be: "#B8D1D7",
  bn: "#F0D1A9",
  bh: "#E0B8D0",
  bi: "#D3D3A0",
  nb: "#B4A7D4",
  bs: "#D4D6A1",
  br: "#C3B8D5",
  bg: "#C1D4B0",
  my: "#B5D6E2",
  ca: "#D9C5B6",
  km: "#A6D2C9",
  ch: "#F2C6D2",
  ce: "#C2D4D3",
  ny: "#A5C9B4",
  zh: "#C0E1C7",
  cu: "#D3D1B7",
  cv: "#E0D9D1",
  kw: "#C6C8A5",
  co: "#C3C1D3",
  cr: "#F0D6B1",
  hr: "#B2D2C9",
  cs: "#D4C0A7",
  da: "#A9D6F0",
  dv: "#D3C1E1",
  nl: "#E2D4C7",
  dz: "#B1C7D5",
  en: "#2db7f5",
  eo: "#F1C9D1",
  et: "#D3E1C6",
  ee: "#A9C7D9",
  fo: "#D0B8D3",
  fj: "#D1E6B5",
  fi: "#A5B8C9",
  fr: "#D0B9C7",
  ff: "#E2D1D9",
  gd: "#F1B8D5",
  gl: "#D1C7B3",
  lg: "#C8B0D2",
  ka: "#B7D3A8",
  de: "#f49c70",
  el: "#B1C6C7",
  gn: "#C4D2B3",
  gu: "#D0A9C8",
  ht: "#E2D1C3",
  ha: "#B9D4E1",
  he: "#D9C8D2",
  hz: "#A6C2D3",
  hi: "#B8C9D7",
  ho: "#D1C5B7",
  hu: "#C4D1A9",
  is: "#C7D0D2",
  io: "#A1D3C0",
  ig: "#D2C7D4",
  id: "#D1D9A3",
  ia: "#C8B1A7",
  ie: "#A8C9E2",
  iu: "#D4C2B0",
  ik: "#D3B5D1",
  ga: "#C9C1D4",
  it: "#D8A9C1",
  ja: "#C1D8C6",
  jv: "#D0D3B2",
  kl: "#B2D1C3",
  kn: "#E2D0A3",
  kr: "#A9C8D7",
  ks: "#B8D4D1",
  kk: "#C6D3A9",
  ki: "#A7C9D2",
  rw: "#D8C1B1",
  ky: "#B3D0C6",
  kv: "#C6B8D3",
  kg: "#C7D8B2",
  ko: "#B9D3C6",
  kj: "#D1D2A9",
  ku: "#B7C8D5",
  lo: "#A9D1C7",
  la: "#E2C9B4",
  lv: "#D0D1A8",
  li: "#C8D1A9",
  ln: "#A9D4C6",
  lt: "#C8B1D0",
  lu: "#D2C7B1",
  lb: "#A9C2D1",
  mk: "#D1A9C8",
  mg: "#D2C6B9",
  ms: "#B7D4C8",
  ml: "#D1C1A9",
  mt: "#B9D2C6",
  gv: "#A1D2C6",
  mi: "#C3B7D8",
  mr: "#B8C9D0",
  mh: "#A6D1D0",
  mn: "#D0C9B2",
  na: "#B1D0C3",
  nv: "#C8A1D3",
  nd: "#C9D7A9",
  nr: "#A6C9D8",
  ng: "#D7C1A9",
  ne: "#C8D1B0",
  se: "#A9D1C8",
  no: "#D0D9A1",
  nn: "#B1D2C9",
  oc: "#C1B9D3",
  oj: "#D1D8A9",
  or: "#D8A9B7",
  om: "#B8C2D3",
  os: "#D0A6C9",
  pi: "#C7B8D7",
  pa: "#B6D0C3",
  fa: "#D3C0D7",
  pl: "#C7D1B9",
  pt: "#B3C9D1",
  ps: "#C1D8B7",
  qu: "#A8D1C6",
  ro: "#B9D2A6",
  rm: "#D8C6B8",
  rn: "#C9D1A9",
  ru: "#D1B8C2",
  sm: "#B2D1A7",
  sg: "#D9C8B3",
  sa: "#C8D2B9",
  sc: "#B1D3A6",
  sr: "#D2B1A9",
  sn: "#B9D2C6",
  ii: "#D1A9C8",
  sd: "#C7D1B8",
  si: "#A9C7D3",
  sk: "#D0C6B8",
  sl: "#B8D2C7",
  so: "#C8D2A9",
  st: "#A9C7D1",
  es: "#D9A9C8",
  su: "#C8D3A9",
  sw: "#D2C9A9",
  ss: "#C6D2B8",
  sv: "#D3C1B2",
  tl: "#A9D0D2",
  ty: "#C1D2B0",
  tg: "#B9D0C7",
  ta: "#D8B1C7",
  tt: "#A9C7D2",
  te: "#C7D1A9",
  th: "#D1C8B9",
  bo: "#A9D2C7",
  ti: "#C6D8A1",
  to: "#B9D8A9",
  ts: "#C8D1B7",
  tn: "#B8D0A9",
  tr: "#f50",
  tk: "#A9D8C6",
  tw: "#D2A9C6",
  ug: "#C8D1A9",
  uk: "#D1B9C8",
  ur: "#B9D2A6",
  uz: "#A9C7D2",
  ve: "#D2A9B7",
  vi: "#B7D1C8",
  vo: "#C8B9D1",
  wa: "#D9C1A9",
  cy: "#B9D8A9",
  fy: "#D8B9A9",
  wo: "#C8D2A1",
  xh: "#B1D8C7",
  yi: "#D9A9B8",
  yo: "#A9D1B7",
  za: "#D8C9A1",
  zu: "#B7C8D1",
};

export const handleEmailVariableChange = (
  template: string,
  variables: Record<string, string>
): string => {
  return template.replace(/{{(.*?)}}/g, (_, variable) => {
    // variables içindeki karşılık gelen değeri al veya boş bir string döndür
    return variables[variable.trim()] || "";
  });
};

export const cookiesOpt = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 7, // One week
  path: "/",
};


// Cookie'den token'ı almak için yardımcı fonksiyon
export const getTokenFromCookie = () => {
 const token = localStorage.getItem("token");
 return JSON.parse(token ?? "");
};
