import { Component, AfterViewInit, OnDestroy, OnInit } from "@angular/core";
import { NbThemeService } from "@nebular/theme";
import { APIService } from "../../../@core/mock/nec.service";

@Component({
  selector: "ngx-echarts-multiple-xaxis",
  template: ` <div echarts [options]="options" class="echart"></div> `,
})
export class EchartsMultipleXaxisComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  options: any = {};
  themeSubscription: any;
  sendLineResponse: any;
  recieveLineResponse: any;
  stats: any;
  dataKeys: any;
  sendLineData: {}[];
  recieveLineData: {}[];

  constructor(private theme: NbThemeService, private apiService: APIService) {}

  ngOnInit(): void {
    this.getSendLineChart();
    this.getRecieveLineChart();
    this.getStats();
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        animation: true,
        backgroundColor: echarts.bg,
        color: [colors.success, colors.info],
        tooltip: {
          trigger: "none",
          axisPointer: {
            type: "cross",
          },
        },
        legend: {
          data: this.dataKeys,
          bottom: 10,
          textStyle: {
            color: echarts.textColor,
          },
        },
        grid: {
          top: 70,
          bottom: 50,
        },
        xAxis: this.dataKeys.forEach((key) => {
          [
            {
              type: "category",
              axisTick: {
                alignWithLabel: true,
              },
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: colors.success,
                },
              },
              axisLabel: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
              axisPointer: {
                label: {
                  formatter: (params) => {
                    return (
                      "Precipitation  " +
                      params.value +
                      (params.seriesData.length
                        ? "：" + params.seriesData[0].data
                        : "")
                    );
                  },
                },
              },
              data: this.getSendLineChart[key].dataPoints,
            },
          ];
        }),
        yAxis: [
          {
            type: "value",
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        series: [
          {
            name: "2015 Precipitation",
            type: "line",
            xAxisIndex: 1,
            smooth: true,
            data: [
              2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0,
              2.3,
            ],
          },
          {
            name: "2016 Precipitation",
            type: "line",
            smooth: true,
            data: [
              3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3,
              0.7,
            ],
          },
        ],
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  getSendLineChart() {
    this.apiService.sendLineChart().subscribe(
      (data) => {
        this.sendLineResponse = data;
        this.sendLineData = this.populateDataPoints(this.sendLineResponse);
      },
      (error) => {},
      () => {}
    );
  }

  getRecieveLineChart() {
    this.apiService.recieveLineChart().subscribe(
      (data) => {
        this.recieveLineResponse = data;
        this.recieveLineData = this.populateDataPoints(
          this.recieveLineResponse
        );
      },
      (error) => {},
      () => {}
    );
  }

  getStats() {
    this.apiService.getStats().subscribe(
      (data) => {
        this.stats = data;
      },
      (error) => {},
      () => {}
    );
  }

  populateDataPoints(response) {
    var lineData: any = {};
    this.dataKeys = Object.keys(response);
    console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW");
    console.log(this.dataKeys);

    this.dataKeys.forEach((key) => {
      var data_ = {
        necCount: [],
        ftcCount: [],
        dataPoints: [],
      };
      response[key].forEach((data) => {
        data_["necCount"].push(data["necCount"]);
        data_["ftcCount"].push(data["ftcCount"]);
        data_["dataPoints"].push(data["x"]);
      });
      lineData[key] = data_;
      console.log("OOOOOOOOOOOOOOOOOOOOOOOO");
      console.log(lineData);
    });
    return lineData;
  }
}
