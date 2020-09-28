import endpoints from './endpoints';
import apiErrors from './errors';
import { instance, openNotification } from './instance';

export const getError = (error) => {
    const detailsErrorCodes = [400, 401, 403, 404, 422];
    if (
        // eslint-disable-next-line no-prototype-builtins
        error.hasOwnProperty('response')
        && error.response
        && (detailsErrorCodes.includes(error.response.status))
    ) {
        const message = error.response.data.detail
            || error.response.data.message
            || error.response.data[Object.keys(error.response.data)[0]];
        return {
            status: apiErrors.AXIOSERRORSTATUS,
            message,
        };
    } if (
        // eslint-disable-next-line no-prototype-builtins
        error.hasOwnProperty('response')
        && error.response
        && error.response.status === 500
    ) {
        return {
            status: apiErrors.AXIOSERRORSTATUS,
            message: apiErrors.AXIOSCOMMONERROR,
        };
    } if (error.message === apiErrors.AXIOSNETWORKERROR) {
        return {
            status: apiErrors.AXIOSERRORSTATUS,
            message: apiErrors.AXIOSNETWORKERRORMSG,
        };
    }
    return {
        status: apiErrors.AXIOSERRORSTATUS,
        message: error.message,
    };
};

export const getMeetingById = (id) => instance
    .get(`${endpoints.getMeetingId + id}/`)
    .then((res) => res.data)
    .catch((error) => {
        const refinedError = getError(error);
        openNotification('error', 'Error', refinedError.message);
        return refinedError;
    });

export const getCallTranscript = (id) => instance.get(`${endpoints.transcriptEndpoint + id}/`)
    .then((res) => res.data)
    .catch((error) => getError(error));

export const updateCallTranscript = (id, data) => instance.patch(`${endpoints.transcriptEndpoint}update/${id}/`, data)
    .then((res) => res.data)
    .catch((error) => {
        const refinedError = getError(error);
        openNotification('error', 'Error', refinedError.message);
        return refinedError;
    });

export const getCallMedia = (id) => (`${instance.defaults.baseURL + endpoints.callMediaEndpoint + id}/?auth=${instance.defaults.headers.common.Authorization.split('JWT ')[1]}`);
