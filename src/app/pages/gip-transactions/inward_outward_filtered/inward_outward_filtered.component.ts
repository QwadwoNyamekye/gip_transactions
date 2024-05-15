import { Component, OnInit } from "@angular/core";
import { APIService } from "../../../@core/mock/nec.service";
import * as Highcharts from "highcharts";
import exporting from "highcharts/modules/exporting";
import exportingData from "highcharts/modules/export-data";
import { NbDateService } from "@nebular/theme";

@Component({
  selector: "ngx-echarts",
  styleUrls: ["./inward_outward_filtered.component.scss"],
  templateUrl: "./inward_outward_filtered.component.html",
})
export class InwardOutwardFilteredComponent implements OnInit {
  toggle = false;
  timestamp: any;
  loading: boolean = false;
  period: any;
  allDay: any;
  Highcharts: typeof Highcharts = Highcharts;
  date: Date;
  max: Date;
  data: any;
  yesterdate: any;

  constructor(
    private apiService: APIService,
    protected dateService: NbDateService<Date>
  ) {}

  ngOnInit(): void {
    this.yesterdate = ((d) =>
      new Date(d.setDate(d.getDate() - 1)).toISOString().split("T")[0])(
      new Date()
    );
    this.max = this.dateService.addDay(this.dateService.today(), 0);
    this.data = [];
    exporting(Highcharts);
    exportingData(Highcharts);
  }

  toggleFunc($event) {
    this.toggle = $event;
  }

  setDate(event) {
    this.date = event;
  }

  sendRequest() {
    if (!this.date) {
      this.date = new Date();
    }
    if (this.toggle) {
      this.getSendLineChart();
      this.loading = true;
      this.getStats();
    } else {
      this.getRecieveLineChart();
      this.loading = true;
      this.getStats();
    }
  }

  getSendLineChart() {
    var dateString = new Date(
      this.date.getTime() - this.date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];
    this.apiService.sendLineChartHist(dateString).subscribe(
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
    var dateString = new Date(
      this.date.getTime() - this.date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];
    this.apiService.recieveLineChartHist(dateString).subscribe(
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
    var dateString = new Date(
      this.date.getTime() - this.date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];
    this.apiService.getStatsHist(dateString).subscribe(
      (data: any) => {
        console.log("!!!!!!!!!!!!!!!!!")
        console.log(data)
        console.log(data.allday.period)
        this.loading = false;
        this.timestamp = data.allday.period;
        this.allDay = [
          {
            value: data.allday.total,
            title: "TOTAL VOLUME",
            color: "gray",
          },
          {
            value: data.allday.approved,
            title: "APPROVED VOLUME",
            color: "#00ff00",
          },
          {
            value: data.allday.failed,
            title: "FAILED VOLUME",
            color: "red",
          },
          {
            value: data.allday.rate,
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
