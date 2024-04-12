import { AfterViewInit, Component, OnDestroy } from "@angular/core";
import { NbThemeService } from "@nebular/theme";

@Component({
  selector: "ngx-echarts-bar",
  template: ` <div echarts [options]="options" class="echart"></div> `,
})
export class EchartsBarComponent implements AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService) {}

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        legend: {
          data: ["A", "B"],
          bottom: 10,
        },
        backgroundColor: echarts.bg,
        color: [colors.primaryLight],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "15%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
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
            name: "A",
            type: "bar",
            barWidth: "25%",
            data: [10, 52, 200, 334, 390, 330, 220],
            itemStyle: {
              color: "#d48265",
            },
          },
          {
            name: "B",
            type: "bar",
            barWidth: "25%",
            data: [10, 52, 200, 334, 390, 330, 220],
            itemStyle: {
              color: "#61a0a8",
            },
          },
        ],
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
