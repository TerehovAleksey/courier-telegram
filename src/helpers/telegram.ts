const tg = window.Telegram.WebApp;

export const tgEnabled = tg.platform !== 'unknown';
export const tgButton = tg.MainButton;
export const tgBackButton = tg.BackButton;
