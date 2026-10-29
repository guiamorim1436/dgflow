/**
 * Gerador de Payload PIX Estático (Padrão BR Code oficial do Banco Central do Brasil)
 */

function formatEmvField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

function normalizeText(text: string, maxLen: number): string {
  return text
    .normalize('NFD')
    .replace(/[^\x20-\x7E]/g, '')
    .toUpperCase()
    .trim()
    .substring(0, maxLen)
    .trim();
}

function calculateCrc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export interface PixOptions {
  pixKey: string;
  beneficiaryName: string;
  city?: string;
  amount?: number;
  txId?: string;
}

export function generatePixPayload(options: PixOptions): string {
  const {
    pixKey,
    beneficiaryName,
    city = 'SAO PAULO',
    amount,
    txId = '***',
  } = options;

  let payload = '';

  // 00 - Payload Format Indicator (01)
  payload += formatEmvField('00', '01');

  // 26 - Merchant Account Information (GUI + Chave)
  const gui = formatEmvField('00', 'br.gov.bcb.pix');
  const key = formatEmvField('01', pixKey.trim());
  payload += formatEmvField('26', gui + key);

  // 52 - Merchant Category Code (0000 = Padrão)
  payload += formatEmvField('52', '0000');

  // 53 - Transaction Currency (986 = BRL)
  payload += formatEmvField('53', '986');

  // 54 - Transaction Amount
  if (amount && amount > 0) {
    payload += formatEmvField('54', amount.toFixed(2));
  }

  // 58 - Country Code (BR)
  payload += formatEmvField('58', 'BR');

  // 59 - Beneficiary Name (máx 25 carac)
  payload += formatEmvField('59', normalizeText(beneficiaryName, 25) || 'TENNO FLOW');

  // 60 - Merchant City (máx 15 carac)
  payload += formatEmvField('60', normalizeText(city, 15) || 'SAO PAULO');

  // 62 - Additional Data Field Template (TXID)
  const txIdField = formatEmvField('05', normalizeText(txId, 25) || '***');
  payload += formatEmvField('62', txIdField);

  // 63 - CRC16
  payload += '6304';
  const crc = calculateCrc16(payload);

  return payload + crc;
}
