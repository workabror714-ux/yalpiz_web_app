export const TELEGRAM_BOT_USERNAME = 'restoran_buyurtma_bot';
export const TELEGRAM_BOT_URL = `https://t.me/${TELEGRAM_BOT_USERNAME}`;

export function openTelegramBot(): void {
  window.open(TELEGRAM_BOT_URL, '_blank', 'noopener,noreferrer');
}
