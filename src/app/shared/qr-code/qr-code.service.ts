import { Injectable } from '@angular/core';
import * as QRCode from 'qrcode';

@Injectable()
export class QRCodeService {

    generateQRCode(url) {
        return QRCode.toDataURL(url);
    }
}
