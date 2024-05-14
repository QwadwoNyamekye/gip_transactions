import { Component, OnDestroy, OnInit } from "@angular/core";
import { NbThemeService } from "@nebular/theme";
import { APIService } from "../../../@core/mock/nec.service";

@Component({
  selector: "ngx-echarts-bar",
  template: ` <div echarts [options]="options" class="echart"></div> `,
})
export class EchartsBarComponent implements OnDestroy, OnInit {
  options: any = {};
  themeSubscription: any;
  issuerErrors: any;
  dataKeys: any;
  period: any;
  allDay: any;
  data: any;

  constructor(
    private theme: NbThemeService,
    private apiService: APIService
  ) {}

  ngOnInit(): void {
    this.apiService.getIssuerErrors().subscribe(
      (data) => {
        var values: any;
        var issuerBanks: any;

        this.issuerErrors = data;
        this.dataKeys = Object.keys(this.issuerErrors);
        values = this.populateDataPoints(this.issuerErrors);
        if (this.data) {
          values = values[0];
        } else {
          values = values[1];
        }
        issuerBanks = this.extractIssuerBanks(this.issuerErrors);
        console.log("^^^^^^^^^^^^^^^^^^^^^");
        console.log(issuerBanks);
        console.log(values);
        this.generateGraph(values, issuerBanks);
      },
      (error) => {},
      () => {}
    );
  }

  generateGraph(series, issuerBanks) {
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
          formatter: (params) => {
            // custom tooltip formatter
            const { name, value } = params[0]; // get the name and value of the hovered bar
            return `${name}: ${value}`; // display only the name and value
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
            data: issuerBanks,
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
        series: series,
        exporting: {
          enabled: true
        }
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }

  extractIssuerBanks(data: { [key: string]: any[] }): string[] {
    const issuerBanksSet = new Set<string>();

    for (const [, values] of Object.entries(data)) {
      values.forEach((item) => {
        issuerBanksSet.add(item.issuer_bank);
      });
    }

    return Array.from(issuerBanksSet);
  }

  // Function to convert data to the desired format
  populateDataPoints(data: { [key: string]: any[] }): any {
    const transformedDataArray = [];

    for (const key in data) {
      const dataArr = data[key];
      const transformedData = {
        name: key,
        type: "bar",
        data: [],
        barWidth: "10%",
        label: {
          show: true,
          position: "inside",
        },
      };

      for (const obj of dataArr) {
        const categoryData: number[] = [];

        for (const innerKey in obj) {
          // Exclude 'issuer_bank' from the transformation
          if (innerKey !== "issuer_bank") {
            const value = obj[innerKey];
            categoryData.push(value);
          }
        }

        transformedData.data.push(categoryData);
      }

      transformedDataArray.push(transformedData);
    }
    console.log("**********************");
    console.log(transformedDataArray);
    return transformedDataArray;
  }
}
