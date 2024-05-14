import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { NbThemeService } from "@nebular/theme";
import { APIService } from "../../../@core/mock/nec.service";

@Component({
  selector: "ngx-echarts-pie",
  template: ` <div echarts [options]="options" class="echart"></div> `,
})
export class EchartsPieComponent implements AfterViewInit, OnDestroy, OnInit {
  options: any = {};
  themeSubscription: any;
  allDayTitles: any = [];
  allDayValues: any = [];
  periodTitles: string[] = [];
  periodValues: any = [];

  constructor(private theme: NbThemeService, private apiService: APIService) {}

  ngOnInit(): void {
    this.apiService.getNecFtcRatio().subscribe(
      (data) => {
        for (var key in data) {
          for (var key_ in data[key]) {
            if (key == "allday") {
              this.allDayTitles.push(data[key][key_]["name"]);
              this.allDayValues.push({
                value: data[key][key_]["name"],
                name: data[key][key_]["y"],
              });
            } else if (key == "period") {
              this.periodTitles.push(data[key][key_]["name"]);
              this.periodValues.push({
                value: data[key][key_]["name"],
                name: data[key][key_]["y"],
              });
            }
          }
        }
        console.log("*******************");
        console.log(this.allDayValues);
        console.log(this.periodValues);
      },
      (error) => {},
      () => {}
    );
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
      const colors = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [
          colors.warningLight,
          colors.infoLight,
          colors.dangerLight,
          colors.successLight,
          colors.primaryLight,
        ],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: this.periodTitles,
          textStyle: {
            color: echarts.textColor,
          },
        },
        series: [
          {
            name: "NEC FTC Ratio",
            type: "pie",
            radius: "80%",
            center: ["50%", "50%"],
            data: [
              { value: 335, name: "Germany" },
              { value: 310, name: "France" },
              { value: 234, name: "Canada" },
              { value: 135, name: "Russia" },
              { value: 1548, name: "USA" },
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: echarts.itemHoverShadowColor,
              },
            },
            label: {
              normal: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
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
