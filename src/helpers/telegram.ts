const tg = window.Telegram.WebApp;

export const tgEnabled = tg.platform !== 'unknown';
export const tgButton = tg.MainButton;
export const tgBackButton = tg.BackButton;
export const tgUser = tg.initDataUnsafe?.user;
export const tgConfirm = tg.showConfirm;
export const tgAlert = tg.showAlert;

export const tgButtonAwaiting = (state: boolean) => {
    if (tgEnabled) {
        if (state) {
            tgButton.showProgress();
            tgButton.disable();
        } else {
            tgButton.hideProgress();
            tgButton.enable();
        }
    }
}

