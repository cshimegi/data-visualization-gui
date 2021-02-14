import { Injectable } from '@angular/core';
import { BaseChartService } from './base.chart';
import * as d3 from 'd3';

@Injectable({ providedIn: 'root' })

export class CandleStickChartService extends BaseChartService{
    protected chartType: string = "candleStick";
    private rootLayer: any;
    private axisLayer: any;
    private xAxisLayer: any;
    private yAxisLayer: any;
    private lineLayer: any;
    private rectLayer: any;
    private strokeWidth: string = "2px";
    private colors: any = {
        raiseUp: "red",
        fallDown: "green",
        equal: "grey"
    };

    constructor()
    {
        super();
    }

    initRootLayer ()
    {
        this.rootLayer = this.svg.append('g')
            .attr('transform', `translate(${this.padding.left}, ${this.padding.right})`);
        
        return this
    }

    initAxisLayer ()
    {
        this.axisLayer = this.rootLayer.append('g');
        
        return this;
    }

    initLineLayer ()
    {
        this.lineLayer = this.rootLayer.append('g');
        
        return this;
    }

    initRectLayer ()
    {
        this.rectLayer = this.rootLayer.append('g');
        
        return this;
    }

    private setTimeExtentX ()
    {
        this.setExtentX([
            d3.min(this.data, d => new Date(d.period)),
            d3.max(this.data, d => new Date(d.period))
        ]);
    }

    private setTimeScaleX ()
    {
        const scaleX = d3.scaleTime()
            .rangeRound([0, this.innerWidth])
            .domain(this.xExtent);
        
        this.setScaleX(scaleX);
    }

    private addTickToAxisX ()
    {
        this.getAxisX().tickFormat(d3.timeFormat("%y/%m/%d %H:%M"));
    }

    initTimeAxisX (isBottom: boolean)
    {
        this.setTimeExtentX();
        this.setTimeScaleX();
        this.setAxisX(isBottom);
        this.addTickToAxisX();
        
        this.xAxisLayer = this.axisLayer.append('g')
            .attr('transform', `translate(0, ${this.innerHeight})`)
            .call(this.xAxis);
        
        return this;
    }

    private setCandleExtentY () {
        this.setExtentY([
            d3.min(this.data, d => d.low * 0.9),
            d3.max(this.data, d => d.high * 1.1)
        ]);
    }

    private setCandleScaleY () {
        const scaleY = d3.scaleLinear()
            .domain(this.yExtent)
            .range([this.innerHeight, this.padding.top + this.padding.bottom])
            .nice();
        
        this.setScaleY(scaleY);
    }

    initCandleAxisY (isLeft: boolean)
    {
        this.setCandleExtentY();
        this.setCandleScaleY();
        this.setAxisY(isLeft);

        this.yAxisLayer = this.axisLayer.append('g').call(this.yAxis);

        return this;
    }

    addTitle (options: any) {
        if (!options.attrs) {
            options.attrs = {
                transform: `translate(${this.innerWidth / 2}, ${this.padding.top})`
            };
        } else if (!options.attrs.transform) {
            options.attrs.transform = `translate(${this.innerWidth / 2}, ${this.padding.top})`;
        }

        this.addText(options);
        
        return this;
    }

    addAxisXLabel (options: any) {
        if (!options.attrs) {
            const translateX = this.width - (this.padding.right+this.padding.left);
            const translateY = this.height - this.padding.bottom;
            const transform = `translate(${translateX}, ${translateY})`;
            options.attrs = {
                transform: transform
            };
        } else if (!options.attrs.transform) {
            const translateX = this.width - (this.padding.right+this.padding.left);
            const translateY = this.height - this.padding.bottom;
            const transform = `translate(${translateX}, ${translateY})`;
            options.attrs.transform = transform;
        }

        this.addText(options);
        
        return this;
    }

    addAxisYLabel (options: any) {
        if (!options.attrs) {
            options.attrs = {
                x: this.padding.left,
                y: this.padding.top
            };
        } else if (!options.attrs.x || !options.attrs.y) {
            options.attrs.x = options.attrs.x ?? this.padding.left;
            options.attrs.y = options.attrs.y ?? this.padding.top;
        }

        this.addText(options);
        
        return this;
    }

    setChartOptions (options?: any)
    {
        if (options) {
            if (options.strokeWidth) {
                this.strokeWidth = options.strokeWidth;
            }
    
            if (options.colors) {
                if (options.colors.raiseUp) {
                    this.colors.raiseUp = options.colors.raiseUp;
                }
                
                if (options.colors.fallDown) {
                    this.colors.fallDown = options.colors.fallDown;
                }
                
                if (options.colors.equal) {
                    this.colors.equal = options.colors.equal;
                }
            }
        }

        return this;
    }

    private drawLine (): void
    {
        this.lineLayer
            .selectAll('line')
            .data(this.data, d => d.period)
            .enter()
            .append('line')
            .attr('class', 'line')
            .attr('x1', (d, i) => this.xScale(new Date(d.period+1500)))
            .attr('x2', (d, i) => this.xScale(new Date(d.period+1500)))
            .attr('y1', d => this.yScale(d.high))
            .attr('y2', d => this.yScale(d.low))
            .attr("stroke-width", this.strokeWidth)
            .attr("stroke", d => {
                return (d.open === d.close)
                    ? this.colors.equal
                    : (d.open > d.close)
                        ? this.colors.fallDown
                        : this.colors.raiseUp;
            });
    }

    private drawRect (): void
    {
        this.rectLayer
            .selectAll('rect')
            .data(this.data, d => d.period)
            .enter()
            .append('rect')
            .attr('class', 'rect')
            .attr('x', d => this.xScale(new Date(d.period)))
            .attr('y', d => this.yScale(Math.max(d.open, d.close)))
            .attr('width', "5px")
            .attr('height', d => Math.abs(this.yScale(d.open) - this.yScale(d.close)))
            .attr('fill', d => (d.open > d.close) ? this.colors.fallDown: this.colors.raiseUp)
    }

    draw (): void
    {
        this.drawLine();
        this.drawRect();
    }
}