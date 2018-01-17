import { latinMap } from './latin-map';
import { latinRegexpMap } from './latin-regexp-map';

export function latinize(str: string): string {
    if (!str) {
        return '';
    }

    return str.replace(/[^A-Za-z0-9\[\] ]/g, function (a: string): string {
        return latinMap[a] || a;
    });
}

export function latinizeRegexp(str: string): string {
    if (!str) {
        return '';
    }

    return str.replace(/(a|c|e|i|o|u|ae|oe)/g, function (a: string): string {
        return latinRegexpMap[a] || a;
    });
}

