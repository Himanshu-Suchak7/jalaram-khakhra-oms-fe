import crypto from "crypto";
import InvoiceDocument from "@/components/invoice/InvoiceDocument";

export const dynamic = "force-dynamic";

function base64urlToBuffer(input) {
    const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
    const padLen = (4 - (normalized.length % 4)) % 4;
    const padded = normalized + "=".repeat(padLen);
    return Buffer.from(padded, "base64");
}

function safeEqual(a, b) {
    const aBuf = Buffer.from(a);
    const bBuf = Buffer.from(b);
    if (aBuf.length !== bBuf.length) return false;
    return crypto.timingSafeEqual(aBuf, bBuf);
}

function verifyToken(token, secret) {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadB64, sigB64] = parts;

    const expectedSig = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
    if (!safeEqual(expectedSig, sigB64)) return null;

    const payloadJson = base64urlToBuffer(payloadB64).toString("utf8");
    const payload = JSON.parse(payloadJson);
    if (!payload || typeof payload !== "object") return null;

    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp !== "number" || payload.exp < now) return null;
    if (!payload.invoice || typeof payload.invoice !== "object") return null;

    return payload;
}

export default async function InvoicePdfPage({ searchParams }) {
    const resolvedSearchParams = await Promise.resolve(searchParams);
    const token = resolvedSearchParams?.token;
    const secret = process.env.OMS_PDF_TOKEN_SECRET;

    if (!secret) {
        return (
            <div className="p-8 text-center text-red-600 font-bold">
                Missing OMS_PDF_TOKEN_SECRET
            </div>
        );
    }

    if (!token || typeof token !== "string") {
        return <div className="p-8 text-center text-red-600 font-bold">Missing token</div>;
    }

    let payload = null;
    try {
        payload = verifyToken(token, secret);
    } catch {
        payload = null;
    }

    if (!payload) {
        return <div className="p-8 text-center text-red-600 font-bold">Invalid token</div>;
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <InvoiceDocument data={payload.invoice} />
        </div>
    );
}
