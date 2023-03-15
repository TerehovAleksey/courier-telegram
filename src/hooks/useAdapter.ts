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

    return {showAlert};
}
