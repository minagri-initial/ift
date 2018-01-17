import { HttpParameterCodec } from '@angular/common/http';

/**
 * Temporary fixes Angular HttpClient bug:
 * https://github.com/angular/angular/issues/18261
 */
export class CustomEncoder implements HttpParameterCodec {
    encodeKey(key: string): string {
        return encodeURIComponent(key);
    }

    encodeValue(value: string): string {
        return encodeURIComponent(value);
    }

    decodeKey(key: string): string {
        return decodeURIComponent(key);
    }

    decodeValue(value: string): string {
        return decodeURIComponent(value);
    }
}
