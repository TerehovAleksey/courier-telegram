import {App} from 'antd';
import {tgAlert, tgConfirm, tgEnabled} from "../helpers/telegram";

export function useAdapter() {

    const {modal, notification} = App.useApp();

    const showAlert = (message: string, callback?: () => void | undefined) => {
        if (tgEnabled) {
            tgAlert(message, callback);
        } else {
            modal.warning({
                content: message,
                afterClose: callback
            });
        }
    };

    const showNoInternetAlert = () => showAlert('Произошла ошибка! Возможно отсутствует доступ к интернет или нестабильное соединение.');
    const showUnknownAlert = () => showAlert('Ошибка! Попробуйте обновить страницу.');

    const showConfirm = (message: string, callback: () => void) => {
        if (tgEnabled) {
            tgConfirm(message, ok => {
                if (ok) {
                    callback();
                }
            })
        } else {
            modal.confirm({
                content: message,
                onOk: () => callback(),
                okText: 'Да',
                cancelText: 'Отмена'
            });
        }
    }

    const showNotification = (message: string) => {
        if (tgEnabled) {
            tgAlert(message);
        } else {
            notification.success({message});
        }
    }

    return {showAlert, showNoInternetAlert, showUnknownAlert, showConfirm, showNotification};
}
