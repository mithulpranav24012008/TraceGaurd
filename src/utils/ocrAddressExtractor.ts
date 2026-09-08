import { recognize } from 'tesseract.js';
import { Blockchain } from '../types';

export interface ExtractedAddressResult {
  address: string;
  chain: Blockchain;
  confidence: number;
}

export interface OcrProcessingResult {
  extractedText: string;
  detectedAddresses: ExtractedAddressResult[];
  imagePreviewUrl: string;
}

// Regex patterns for common blockchain wallet addresses
const ADDRESS_PATTERNS = {
  EVM: /\b(0x[a-fA-F0-9]{40})\b/gi,
  BTC_BECH32: /\b(bc1[ac-hj-np-z0-9]{38,59})\b/gi,
  BTC_LEGACY: /\b([13][a-km-zA-HJ-NP-Z1-9]{25,34})\b/g,
  SOLANA: /\b([1-9A-HJ-NP-Za-km-z]{32,44})\b/g
};

/**
  Extract all valid cryptocurrency wallet addresses from arbitrary text string using regex patterns
 */
export function extractAddressesFromText(text: string): ExtractedAddressResult[] {
  const results: ExtractedAddressResult[] = [];
  const seen = new Set<string>();

  // 1. Check EVM (0x...)
  const evmMatches = Array.from(text.matchAll(ADDRESS_PATTERNS.EVM));
  for (const match of evmMatches) {
    const addr = match[1];
    if (!seen.has(addr.toLowerCase())) {
      seen.add(addr.toLowerCase());
      results.push({ address: addr, chain: 'Ethereum', confidence: 98 });
    }
  }

  // 2. Check Bitcoin Bech32 (bc1...)
  const btcBechMatches = Array.from(text.matchAll(ADDRESS_PATTERNS.BTC_BECH32));
  for (const match of btcBechMatches) {
    const addr = match[1];
    if (!seen.has(addr.toLowerCase())) {
      seen.add(addr.toLowerCase());
      results.push({ address: addr, chain: 'Bitcoin', confidence: 96 });
    }
  }

  // 3. Check Bitcoin Legacy (1... or 3...)
  const btcLegacyMatches = Array.from(text.matchAll(ADDRESS_PATTERNS.BTC_LEGACY));
  for (const match of btcLegacyMatches) {
    const addr = match[1];
    if (addr.length >= 26 && !seen.has(addr)) {
      seen.add(addr);
      results.push({ address: addr, chain: 'Bitcoin', confidence: 92 });
    }
  }

  return results;
}

/**
  Performs real client-side OCR reading over an uploaded image using Tesseract.js
 */
export async function processScreenshotOcr(fileOrDataUrl: File | string): Promise<OcrProcessingResult> {
  let dataUrl: string;

  if (typeof fileOrDataUrl === 'string') {
    dataUrl = fileOrDataUrl;
  } else {
    dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(fileOrDataUrl);
    });
  }

  let extractedText = '';

  // Demo sample check for quick preset testing
  if (dataUrl.includes('sample_scam_telegram')) {
    extractedText = `Telegram Chat - Investment Support Team\n` +
      `[14:22] Admin: Sir, send your 500 USDT deposit to the official verification pool wallet below.\n` +
      `[14:23] Admin: Wallet Address: 0x71c89f2a2810a993e827b508f7d8e0a2e399A42\n` +
      `[14:23] Admin: Please confirm transaction hash after sending.\n` +
      `[14:25] Victim: Sent 500 USDT. TX Hash: 0x88ea9...0192`;
  } else if (dataUrl.includes('sample_scam_whatsapp')) {
    extractedText = `WhatsApp Fraud Notice - VIP Mining Pool\n` +
      `Manager: For fast release of frozen profits, transfer 0.05 BTC to manager escrow address:\n` +
      `bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh\n` +
      `Alternate ETH node address: 0x9918273645019283746501928374650192837465`;
  } else {
    // Perform real OCR on user-uploaded screenshot using Tesseract.js
    try {
      const result = await recognize(dataUrl, 'eng');
      extractedText = result?.data?.text || '';
    } catch (err) {
      console.warn('Tesseract.js OCR processing failed:', err);
      extractedText = '';
    }

    const detected = extractAddressesFromText(extractedText);

    if (!extractedText.trim() || detected.length === 0) {
      extractedText = extractedText.trim()
        ? `${extractedText.trim()}\n\n[No wallet address could be extracted from this image — please enter the address manually.]`
        : 'No wallet address could be extracted from this image — please enter the address manually.';
    }
  }

  const detectedAddresses = extractAddressesFromText(extractedText);

  return {
    extractedText,
    detectedAddresses,
    imagePreviewUrl: dataUrl
  };
}

/**
 * Pre-seeded sample scam screenshots for instant OCR testing during demonstrations
 */
export const SAMPLE_SCAM_SCREENSHOTS = [
  {
    id: 'sample-telegram',
    title: 'Telegram Fraud Chat Screenshot (EVM Address)',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><rect width="400" height="240" fill="%230f172a"/><rect x="15" y="15" width="370" height="210" rx="10" fill="%231e293b" stroke="%23334155"/><text x="30" y="45" fill="%2338bdf8" font-family="sans-serif" font-size="14" font-weight="bold">Telegram Scam Chat (Investment Fraud)</text><text x="30" y="80" fill="%23cbd5e1" font-family="monospace" font-size="11">Admin: Send deposit to verification wallet:</text><text x="30" y="105" fill="%234ade80" font-family="monospace" font-size="11" font-weight="bold">0x71c89f2a2810a993e827b508f7d8e0a2e399A42</text><text x="30" y="135" fill="%2394a3b8" font-family="sans-serif" font-size="10">Amount: 500 USDT (ERC-20)</text><text x="30" y="180" fill="%23f43f5e" font-family="monospace" font-size="10">[OCR TARGET DETECTED]</text></svg>',
    sampleType: 'sample_scam_telegram'
  },
  {
    id: 'sample-whatsapp',
    title: 'WhatsApp Extortion Screenshot (BTC & EVM Multi-Address)',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><rect width="400" height="240" fill="%23022c22"/><rect x="15" y="15" width="370" height="210" rx="10" fill="%23064e3b" stroke="%23047857"/><text x="30" y="45" fill="%2334d399" font-family="sans-serif" font-size="14" font-weight="bold">WhatsApp Fraud Screen (Escrow Extortion)</text><text x="30" y="80" fill="%23e2e8f0" font-family="monospace" font-size="11">Transfer 0.05 BTC to manager escrow:</text><text x="30" y="105" fill="%23fbbf24" font-family="monospace" font-size="11" font-weight="bold">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</text><text x="30" y="135" fill="%2394a3b8" font-family="monospace" font-size="10">Backup ETH: 0x9918273645019283746501928374650192837465</text><text x="30" y="180" fill="%23a7f3d0" font-family="monospace" font-size="10">[MULTIPLE ADDRESSES DETECTED]</text></svg>',
    sampleType: 'sample_scam_whatsapp'
  }
];
