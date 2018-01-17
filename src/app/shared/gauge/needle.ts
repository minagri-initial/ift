import { percToRad } from './utils';

export class Needle {

    needleElt;
    chart;
    len;
    radius;

    constructor(chart, width) {
        this.chart = chart;
        this.len = width / 3;
        this.radius = this.len / 6;

        this.chart.append('circle').attr('class', 'needle-center').attr('cx', 0).attr('cy', 0).attr('r', this.radius);
        this.needleElt = this.chart.append('path').attr('class', 'needle');
    }

    /**
     * Helper function that returns the `d` value
     * for moving the needle
     **/
    recalcPointerPos(perc) {
        const thetaRad = percToRad(perc / 2);
        const centerX = 0;
        const centerY = 0;
        const topX = centerX - this.len * Math.cos(thetaRad);
        const topY = centerY - this.len * Math.sin(thetaRad);
        const leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2);
        const leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2);
        const rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2);
        const rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);
        return 'M ' + leftX + ' ' + leftY + ' L ' + topX + ' ' + topY + ' L ' + rightX + ' ' + rightY;
    }

    repaint(perc) {
        this.needleElt.attr('d', this.recalcPointerPos(perc));
    }
}
