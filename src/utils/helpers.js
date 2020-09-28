/* eslint-disable prefer-template */
/* eslint-disable radix */
export const getRandomColors = (string) => {
    const colors = [
        '#e51c23',
        '#e91e63',
        '#9c27b0',
        '#673ab7',
        '#3f51b5',
        '#5677fc',
        '#03a9f4',
        '#00bcd4',
        '#009688',
        '#259b24',
        '#8bc34a',
        '#afb42b',
        '#ff9800',
        '#ff5722',
        '#795548',
        '#607d8b',
    ];
    let hash = 0;
    if (string.length === 0) return hash;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < string.length; i++) {
        // eslint-disable-next-line no-bitwise
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
        // eslint-disable-next-line no-bitwise
        hash &= hash;
    }
    hash = ((hash % colors.length) + colors.length) % colors.length;
    return colors[hash];
};

export const isEmpty = (value) => {
    if (value == null || value === undefined) {
        return true;
    }
    if (value.prop && value.prop.constructor === Array) {
        return value.length === 0;
    }
    if (typeof value === 'object') {
        return Object.keys(value).length === 0 && value.constructor === Object;
    }
    if (typeof value === 'string') {
        return value.length === 0;
    }
    if (typeof value === 'number') {
        return value === 0;
    } if (!value) {
        return true;
    }
    return false;
};

export const secondsToTime = (seconds = 0) => {
    let hours = 0;
    let minutes = 0;
    let secs = 0;
    let timeToCalc = seconds;

    if (timeToCalc >= 3600) {
        hours = parseInt(timeToCalc / 3600);
        timeToCalc = parseInt(timeToCalc % 3600);
    }

    if (timeToCalc >= 60) {
        minutes = parseInt(timeToCalc / 60);
        timeToCalc = parseInt(timeToCalc % 60);
    }

    secs = parseInt(timeToCalc);

    let display = '';
    display += hours ? `${hours >= 10 ? hours : `0${hours}`}:` : '';
    display
        += `${minutes >= 10 ? minutes : `0${minutes}`
        }:${
            secs >= 10 ? secs : `0${secs}`}`;

    return display;
};

/*
  # selector: any query selector say: .card.active etc...
  # block: start | center | end | nearest;
  # behavior: smooth | auto;
*/
export const scrollElementInView = (
    selector,
    block = 'center',
    behavior = 'smooth',
    element,
) => {
    if (selector) {
        if (document.querySelector(selector)) {
            document
                .querySelector(selector)
                .scrollIntoView({ block, behavior });
        }
    } else {
        element.scrollIntoView({ block, behavior });
    }
};

export const getDuration = (start, end) => {
    // get total seconds between the times
    let delta = Math.abs(new Date(end).getTime() - new Date(start).getTime()) / 1000;

    // calculate (and subtract) whole days
    let days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    let minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    let seconds = delta % 60;

    if (days < 10) {
        days = '0' + days;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    if (days > 0) {
        return `${days}d, ${hours}:${minutes}:${seconds}`;
    }
    return `${hours}:${minutes}:${Math.ceil(seconds)}`;
};

export const getMatchRegex = (arr) => new RegExp(arr.map((key) => `\\b${key}\\b`).join('|'), 'gi');

export const getDurationInSeconds = (start = new Date(), end = new Date()) => {
    return Math.abs(new Date(end).getTime() - new Date(start).getTime()) / 1000;
};
