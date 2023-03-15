import { App } from 'antd';
import {tgEnabled} from "../helpers/telegram";

const tg = window.Telegram.WebApp;

export function useAdapter() {

    const {modal } = App.useApp();

    const showAlert = (message: string, callback?: () => void | undefined) => {
        if(tgEnabled){
            tg.showAlert(message, callback);
        }else{
            modal.warning({
                content: message,
                afterClose: callback
            });
        }
    };

    const showConfirm = (message: string, callback: () => void) => {
        if(tgEnabled){
            tg.showConfirm(message, ok => {
                if (ok){
                    callback();
                }
            })
        }else{
            modal.confirm({
                content: message,
                onOk: callback,
                okText: 'Да',
                cancelText: 'Отмена'
            });
        }
    }

    return {showAlert, showConfirm};
}
