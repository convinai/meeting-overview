import Axios from 'axios';
import { notification } from 'antd';

export const instance = Axios.create();

export function openNotification(type, title, msg) {
    notification[type]({
        message: title,
        description: msg,
    });
}

instance.interceptors.request.use((req) => {
    if (instance.defaults.headers.common.Authorization) {
        return req;
    }
    openNotification('error', 'Error', 'No auth token provided');
    return false;
}, (error) => Promise.reject(error));

export default instance;
