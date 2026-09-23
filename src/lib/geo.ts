import UAParser from "ua-parser-js";

export interface ClientDetails {
  ip: string;
  location: string;
  city: string;
  country: string;
  region: string;
  operatingSystem: string;
  browser: string;
  deviceType: "Desktop 💻" | "Mobile 📱" | "Tablet 📱";
  deviceModel: string;
  userAgent: string;
}

export function extractClientDetails(req: Request): ClientDetails {
  // 1. Extract IP Address from Vercel / proxy headers
  const forwarded = req.headers.get("x-forwarded-for") || "";
  const ip =
    forwarded.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "Unknown IP";

  // 2. Extract Geolocation from Vercel edge headers
  const countryCode = req.headers.get("x-vercel-ip-country") || "";
  const regionCode = req.headers.get("x-vercel-ip-country-region") || "";
  let city = "";
  try {
    const rawCity = req.headers.get("x-vercel-ip-city");
    if (rawCity) {
      city = decodeURIComponent(rawCity);
    }
  } catch {
    city = req.headers.get("x-vercel-ip-city") || "";
  }

  // Country display name
  const countryName = countryCode === "DZ" ? "الجزائر 🇩🇿" : countryCode || "Unknown Country";

  // Build clean location string
  const locationParts: string[] = [];
  if (city) locationParts.push(city);
  if (regionCode) locationParts.push(`ولاية ${regionCode}`);
  if (countryName) locationParts.push(countryName);

  const location = locationParts.length > 0 ? locationParts.join(" - ") : "غير محدد (Local / Proxy)";

  // 3. Parse User-Agent
  const uaString = req.headers.get("user-agent") || "";
  const parser = new UAParser(uaString).getResult();

  const operatingSystem = parser.os.name
    ? `${parser.os.name} ${parser.os.version || ""}`.trim()
    : "Unknown OS";

  const browser = parser.browser.name
    ? `${parser.browser.name} ${parser.browser.version || ""}`.trim()
    : "Unknown Browser";

  const rawDeviceType = parser.device.type;
  const deviceType: "Desktop 💻" | "Mobile 📱" | "Tablet 📱" =
    rawDeviceType === "mobile"
      ? "Mobile 📱"
      : rawDeviceType === "tablet"
      ? "Tablet 📱"
      : "Desktop 💻";

  const deviceModel =
    [parser.device.vendor, parser.device.model].filter(Boolean).join(" ") ||
    `${operatingSystem} (${deviceType})`;

  return {
    ip,
    location,
    city: city || "غير محدد",
    country: countryName,
    region: regionCode || "",
    operatingSystem,
    browser,
    deviceType,
    deviceModel,
    userAgent: uaString,
  };
}
