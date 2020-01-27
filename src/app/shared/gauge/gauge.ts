import * as d3 from 'd3';
import { Needle } from './needle';
import { percToRad } from './utils';

export class Gauge {

    private width;
    private svg;
    private chart;
    private arc2;
    private arc1;
    private percent;
    private needle;

    constructor(selector) {
        const gaugeElt: any = d3.select(selector);

        this.percent = .5;
        const numSections = 1;
        const sectionPerc = 1 / numSections / 2;

        const chartInset = 10;

        const margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 20
        };
        const offsetWidth = gaugeElt._groups[0][0].offsetWidth;
        this.width = Math.max(offsetWidth, margin.left + margin.right) - margin.left - margin.right;
        const height = this.width;
        const radius = Math.min(this.width, height) / 2;
        const barWidth = 40 * this.width / 300;

        // Create SVG element
        this.svg = gaugeElt.append('svg')
            .attr('width', this.width + margin.left + margin.right)
            .attr('height', (height / 2) + margin.top + margin.bottom);

        // Add layer for the panel
        this.chart = this.svg.append('g')
            .attr('transform', 'translate(' + ((this.width + margin.left) / 2) + ', ' + ((height + margin.top) / 2) + ')');
        this.chart.append('path').attr('class', 'arc chart-filled');
        this.chart.append('path').attr('class', 'arc chart-empty');

        this.arc2 = d3.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth);
        this.arc1 = d3.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth);


        this.needle = new Needle(this.chart, this.width);

        this.repaint(this.percent);

    }

    moveTo(perc) {
        const self = this;
        const oldValue = this.percent;
        this.percent = perc;

        // Move needle and repaint gauge
        this.chart.transition().delay(300).ease(d3.easeBounce).duration(1500).select('.needle').tween('progress', function () {
            return (percentOfPercent) => {
                const progress = oldValue + ((perc - oldValue) * percentOfPercent);

                self.repaint(progress);
            };
        });

    }

    repaint(perc) {
        const padRad = 0.025;
        const totalPercent = .75;

        let next_start = totalPercent;
        let arcStartRad = percToRad(next_start);
        let arcEndRad = arcStartRad + percToRad(perc / 2);
        next_start += perc / 2;


        this.arc1.startAngle(arcStartRad).endAngle(arcEndRad);

        arcStartRad = percToRad(next_start);
        arcEndRad = arcStartRad + percToRad((1 - perc) / 2);

        this.arc2.startAngle(arcStartRad + padRad).endAngle(arcEndRad);


        this.chart.select('.chart-filled').attr('d', this.arc1);
        const color = this.getChartColor();
        this.chart.select('.chart-filled').style('fill', color(perc));
        this.chart.select('.chart-empty').attr('d', this.arc2);

        this.needle.repaint(perc);
    }

    getChartColor() {

        return (<any>d3.scaleLinear()
            .domain([0, 0.375, 0.5, 1]))
            .range(['#28a745', '#ffc107', '#dc3545', '#88202a']); // ['green', 'yellow', 'red', 'dark red']

    }
}
