import * as QRCode from 'qrcode';
import * as fs from 'fs';

async function generateQRCode(data: string, outputPath: string): Promise<void> {
  try {
    const qrCodeBuffer: Buffer = await QRCode.toBuffer(data);
    fs.writeFileSync(outputPath, qrCodeBuffer);
    console.log(`QR Code generated and saved at: ${outputPath}`);
  } catch (error) {
    console.error('Error generating QR Code:', error);
  }
}

// Example usage
const dataToEncode = 'https://example.com';
const outputPath = 'qrcode.png';

generateQRCode(dataToEncode, outputPath);

export default QRCode;
