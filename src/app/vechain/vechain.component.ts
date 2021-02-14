import { Component, OnInit } from '@angular/core';
import { VechainRepositoryService } from '@app/_repos_';
import { DateService, CandleStickChartService } from '@app/_services_';
import { HttpErrorResponse } from '@angular/common/http';
import { Vechain } from '@app/_models_';

declare var $: any;

@Component({
  selector: 'app-vechain',
  templateUrl: './vechain.component.html',
  styleUrls: ['./vechain.component.scss']
})

export class VechainComponent implements OnInit {
    private fromDate: number;
    data: any[];

    constructor(
        private vechainRepoService: VechainRepositoryService,
        private dateService: DateService,
        private candleStickService: CandleStickChartService
    ) {
        this.fromDate = this.dateService.getUnixDatetime(this.dateService.getStringPastDatetime(15));
    }

    ngOnInit(): void
    {
        this.getVechainBy();
    }

    private getVechainBy()
    {
        this.vechainRepoService.getVechainBy({fromDate: this.fromDate})
            .subscribe(
                (data: any) => {
                    this.data = data as Vechain[];
                    this.drawCandlestickChart(this.data.slice(0,10));
                },
                (error: HttpErrorResponse) => {
                    console.error(error);
                }
            );
    }

    showCandleStickWith(minutes: number, event)
    {
        $('.nav-tabs').find('a').removeClass('active');
        event.target.classList.toggle('active');
    }

    private drawCandlestickChart(data: Vechain[])
    {
        const options = {
            width: 1200,
            height: 700,
            padding: {
                top: 15,
                right: 10,
                bottom: 15,
                left: 80
            }
        };

        this.candleStickService
            .setOptions(options)
            .setData(data)
            .setViewBox()
            .createSvg("candle-stick")
            .initRootLayer()
            .initAxisLayer()
            .initTimeAxisX(true)
            .initCandleAxisY(true)
            .initLineLayer()
            .initRectLayer()
            .addTitle(this.getChartTitleOptions())
            .addAxisXLabel(this.getAxisXLabelOptions())
            .addAxisYLabel(this.getAxisYLabelOptions())
            .draw();
    }

    private getChartTitleOptions (): any
    {
        return {
            styles: {
                "text-anchor": "middle",
                "font-weight": "bold"
            },
            content: "Vechain"
        }
    }

    private getAxisXLabelOptions (): any
    {
        return {
            attrs: {
                dx: "1em"
            },
            styles: {
                "text-anchor": "middle",
                "font-weight": "bold"
            },
            content: "Date"
        };
    }

    private getAxisYLabelOptions (): any
    {
        return {
            styles: {
                "text-anchor": "middle",
                "font-weight": "bold"
            },
            content: "Price"
        };
    }
}
