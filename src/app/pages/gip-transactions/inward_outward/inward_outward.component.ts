import { Component, OnInit } from "@angular/core";
import { APIService } from "../../../@core/mock/nec.service";
import * as Highcharts from "highcharts";
import exporting from "highcharts/modules/exporting";
import exportingData from "highcharts/modules/export-data";

@Component({
  selector: "ngx-echarts",
  styleUrls: ["./inward_outward.component.scss"],
  templateUrl: "./inward_outward.component.html",
})
export class InwardOutwardComponent implements OnInit {
  toggle = false;
  stats: any;
  timestamp: any;
  period: any;
  allDay: any;

  Highcharts: typeof Highcharts = Highcharts;

  constructor(private apiService: APIService) {}

  ngOnInit(): void {
    exporting(Highcharts);
    exportingData(Highcharts);
    this.getStats();
    this.getSendLineChart();
    this.getRecieveLineChart();
  }

  toggleFunc($event) {
    if ($event) {
      this.getSendLineChart();
    } else {
      this.getRecieveLineChart();
    }
  }

  getSendLineChart() {
    this.apiService.getSendLineChart().subscribe(
      (data: any) => {
        var formattedData = [];

        for (var key in data) {
          var color = "";
          if (key == "MTN") {
            color = "#E6DD0F";
          } else if (key == "Vodafone") {
            color = "#E6160F";
          } else if (key == "AirtelTigo") {
            color = "#073082";
          } else if (key == "FinTechs") {
            color = "#40A832";
          } else if (key == "GhanaPay") {
            color = "#FFA500";
          }
          var singleObject = {
            name: "",
            data: [],
            color: "",
          };
          singleObject.name = key;
          singleObject.color = color;
          for (var i = 0; i < data[key].length; i++) {
            singleObject.data.push([
              Date.parse(data[key][i].x),
              0 + data[key][i].ftcCount,
            ]);
          }
          formattedData.push(singleObject);
          this.drawSendGraph(formattedData, "Outward", "container");
        }
      },
      (error) => {},
      () => {}
    );
  }

  getRecieveLineChart() {
    this.apiService.getRecieveLineChart().subscribe(
      (data: any) => {
        var formattedData = [];

        for (var key in data) {
          var color = "";
          if (key == "MTN") {
            color = "#E6DD0F";
          } else if (key == "Vodafone") {
            color = "#E6160F";
          } else if (key == "AirtelTigo") {
            color = "#073082";
          } else if (key == "FinTechs") {
            color = "#40A832";
          } else if (key == "GhanaPay") {
            color = "#FFA500";
          }
          var singleObject = {
            name: "",
            data: [],
            color: "",
          };
          singleObject.name = key;
          singleObject.color = color;
          for (var i = 0; i < data[key].length; i++) {
            singleObject.data.push([
              Date.parse(data[key][i].x),
              0 + data[key][i].ftcCount,
            ]);
          }
          formattedData.push(singleObject);
          this.drawSendGraph(formattedData, "Outward", "container");
        }
      },
      (error) => {},
      () => {}
    );
  }

  getStats() {
    this.apiService.getStats().subscribe(
      (data) => {
        this.stats = data;
        this.timestamp = this.stats.period.period;
        this.period = [
          {
            value: this.stats.period.total,
            title: "TOTAL VOLUME",
            color: "gray",
          },
          {
            value: this.stats.period.approved,
            title: "APPROVED VOLUME",
            color: "#00ff00",
          },
          {
            value: this.stats.period.failed,
            title: "FAILED VOLUME",
            color: "red",
          },
          {
            value: this.stats.period.rate,
            title: "FAILURE VOLUME",
            color: "#ff00ff",
          },
        ];
        this.allDay = [
          {
            value: this.stats.allday.total,
            title: "TOTAL VOLUME",
            color: "gray",
          },
          {
            value: this.stats.allday.approved,
            title: "APPROVED VOLUME",
            color: "#00ff00",
          },
          {
            value: this.stats.allday.failed,
            title: "FAILED VOLUME",
            color: "red",
          },
          {
            value: this.stats.allday.rate,
            title: "FAILURE VOLUME",
            color: "#ff00ff",
          },
        ];
      },
      (error) => {},
      () => {}
    );
  }

  drawSendGraph(formattedData, direction, target) {
    Highcharts.chart(target, {
      chart: {
        height: 500,
        scrollablePlotArea: {
          minWidth: 700,
          minHeight: 700,
        },
      },
      title: {
        text: "GIP TRANSACTIONS",
      },
      subtitle: {
        text: direction,
      },
      xAxis: {
        tickInterval: 3600 * 1000,
        tickWidth: 0,
        gridLineWidth: 1,
        title: {
          text: "Transaction Time",
        },
        labels: {
          formatter: function () {
            var chart = Highcharts.charts[0];
            // return Highcharts.dateFormat('%H:%M', this.value);
            return Highcharts.dateFormat("%l%p", Number(this.value));
          },
        },
      },
      yAxis: [
        {
          title: {
            text: "Transaction Volume",
          },
          showFirstLabel: true,
        },
        {
          // right y axis
          linkedTo: 0,
          gridLineWidth: 0,
          opposite: true,
          title: {
            text: null,
          },
        },
      ],
      legend: {
        align: "left",
        verticalAlign: "top",
        borderWidth: 0,
      },
      tooltip: {
        shared: true,
        shape: "rect",
        formatter: function () {
          return this.points.reduce(function (s, point) {
            return s + "<br/>" + point.series.name + ": " + point.y;
          }, "<b>" + Highcharts.dateFormat("%H:%M", Number(this.x)) + "</b>");
        },
      },
      plotOptions: {
        series: {
          cursor: "pointer",
          point: {
            events: {
              click: function (e) {
                console.log("Draw Modal");
              },
            },
          },
          marker: {
            lineWidth: 1,
            enabled: false,
          },
        },
      },
      series: formattedData,
      exporting: {
        enabled: true,
      },
    });
  }
}
