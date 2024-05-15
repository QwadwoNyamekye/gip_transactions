import { ChangeDetectorRef, Component } from "@angular/core";
import * as Highcharts from "highcharts";
import exporting from "highcharts/modules/exporting";
import { NbThemeService } from "@nebular/theme";
import exportingData from "highcharts/modules/export-data";
import { APIService } from "../../../@core/mock/nec.service";

@Component({
  selector: "ngx-echarts",
  styleUrls: ["./nec_ftc_ratio.component.scss"],
  templateUrl: "./nec_ftc_ratio.component.html",
})
export class NECFTCRatioComponent {
  Highcharts: typeof Highcharts = Highcharts;

  constructor(private theme: NbThemeService, private apiService: APIService) {}

  ngOnInit(): void {
    exporting(Highcharts);
    exportingData(Highcharts);
    this.getData();
  }

  getData() {
    this.apiService.getNecFtcRatio().subscribe(
      (result) => {
        console.log("++++++++++++++++");
        console.log(result);
        for (var key in result) {
          if (key == "period") {
            var data = [];
            var series = [];
            var text = "";
            for (var i = 0; i < result["period"].length; i++) {
              var object = { name: "", y: 0, sliced: true, selected: true };
              object.name = result["period"][i].name;
              object.y = parseFloat(result["period"][i].y);
              (object.sliced = true),
                (object.selected = true),
                data.push(object);
              text = result["period"][i].period;
            }
            var seriesObject = {
              name: "NEC - FTC RATIO",
              colorByPoint: true,
              data: data,
            };
            series.push(seriesObject);
            this.drawPeriodPie(series, "NEC - FTC RATIO " + text);
          } else {
            var data = [];
            var series = [];

            for (i = 0; i < result["allday"].length; i++) {
              var object = { name: "", y: 0, sliced: true, selected: true };
              object.name = result["allday"][i].name;
              object.y = parseFloat(result["allday"][i].y);
              (object.sliced = true),
                (object.selected = true),
                data.push(object);
            }
            var seriesObject = {
              name: "NEC - FTC RATIO",
              colorByPoint: true,
              data: data,
            };
            series.push(seriesObject);
            this.drawAllPie(series, "NEC - FTC RATIO ALL DAY");
          }
        }
      },
      (error) => {
        console.log("++++++++++++++++");
        console.log(error);
      },
      () => {}
    );
  }

  drawPeriodPie(series, text) {
    Highcharts.chart("container1", {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
      },
      title: {
        text: text,
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %",
          },
          showInLegend: true,
        },
      },
      series: series,
    });
  }
  drawAllPie(series, text) {
    Highcharts.chart("container2", {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
      },
      title: {
        text: text,
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %",
          },
          showInLegend: true,
        },
      },
      series: series,
    });
  }
}
