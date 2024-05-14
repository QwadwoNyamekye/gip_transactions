import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { APIService } from "../../../@core/mock/nec.service";
import * as Highcharts from "highcharts";
import { CompatClient, Stomp } from "@stomp/stompjs";
// import * as SockJS from "sockjs-client";
import SockJS from "sockjs-client";
import exporting from "highcharts/modules/exporting";
import exportingData from "highcharts/modules/export-data";
import { environment } from "../../../../environments/environment.prod";

@Component({
  selector: "ngx-echarts",
  styleUrls: ["./error_responses.component.scss"],
  templateUrl: "./error_responses.component.html",
})
export class ErrorResponsesComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  toggle = false;
  keys: any;
  public stompClient: CompatClient;
  issuerErrors: any;
  key: any;

  constructor(private cd: ChangeDetectorRef, private apiService: APIService) {}

  ngOnInit(): void {
    this.loadIssuerErrorResponsesDataWS();
  }
  loadIssuerErrorResponsesDataHTTP() {
    this.apiService.getIssuerErrors().subscribe(
      (result) => {
        var iss_error_all_body = document.getElementById("iss_error_all_body");
        iss_error_all_body.innerHTML = "";

        var iss_error_period_body = document.getElementById(
          "iss_error_period_body"
        );
        iss_error_period_body.innerHTML = "";
        var period = "";
        for (var key in result) {
          this.key = key;
          if (key == "allday") {
            for (var i = 0; i < result["allday"].length; i++) {
              iss_error_all_body.innerHTML +=
                "<tr>" +
                "<td>(" +
                result["allday"][i].issuer_bank +
                ")</td>" +
                "<td>" +
                result["allday"][i]._119 +
                "</td>" +
                "<td>" +
                result["allday"][i]._100 +
                "</td>" +
                "<td>" +
                result["allday"][i]._114 +
                "</td>" +
                "<td>" +
                result["allday"][i]._116 +
                "</td>" +
                "<td>" +
                result["allday"][i]._909 +
                "</td>" +
                "<td>" +
                result["allday"][i]._912 +
                "</td>" +
                "<td>" +
                result["allday"][i].others +
                "</td>" +
                "</tr>";
            }
          } else {
            period = key;

            for (i = 0; i < result[key].length; i++) {
              iss_error_period_body.innerHTML +=
                "<tr>" +
                "<td>(" +
                result[key][i].issuer_bank +
                ")</td>" +
                "<td>" +
                result[key][i]._119 +
                "</td>" +
                "<td>" +
                result[key][i]._100 +
                "</td>" +
                "<td>" +
                result[key][i]._114 +
                "</td>" +
                "<td>" +
                result[key][i]._116 +
                "</td>" +
                "<td>" +
                result[key][i]._909 +
                "</td>" +
                "<td>" +
                result[key][i]._912 +
                "</td>" +
                "<td>" +
                result[key][i].others +
                "</td>" +
                "</tr>";
            }
          }
        }
      },
      (error) => {},
      () => {
        this.periodErrorsBar(this.key);
        this.allDayErrorsBar();
      }
    );
  }

  loadIssuerErrorResponsesDataWS() {
    var websocket = environment.websocket;
    const serverUrl = websocket;
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(() => {
      return ws;
    });
    this.stompClient.connect({}, function (frame) {
      console.log("Connected: " + frame);
      this.stompClient.subscribe("/topic/iss_error_responses", function (result) {
        var metrics = JSON.parse(result.body);

        var iss_error_all_body = document.getElementById("iss_error_all_body");
        iss_error_all_body.innerHTML = "";

        var iss_error_period_body = document.getElementById(
          "iss_error_period_body"
        );
        iss_error_period_body.innerHTML = "";
        var period = "";

        for (var key in metrics) {
          if (key == "allday") {
            for (var i = 0; i < metrics["allday"].length; i++) {
              iss_error_all_body.innerHTML +=
                "<tr>" +
                "<td>(" +
                metrics["allday"][i].issuer_bank +
                ")</td>" +
                "<td>" +
                metrics["allday"][i]._119 +
                "</td>" +
                "<td>" +
                metrics["allday"][i]._100 +
                "</td>" +
                "<td>" +
                metrics["allday"][i]._114 +
                "</td>" +
                "<td>" +
                metrics["allday"][i]._116 +
                "</td>" +
                "<td>" +
                metrics["allday"][i]._909 +
                "</td>" +
                "<td>" +
                metrics["allday"][i]._912 +
                "</td>" +
                "<td>" +
                metrics["allday"][i].others +
                "</td>" +
                "</tr>";
            }
          } else {
            period = key;

            for (i = 0; i < metrics[key].length; i++) {
              iss_error_period_body.innerHTML +=
                "<tr>" +
                "<td>(" +
                metrics[key][i].issuer_bank +
                ")</td>" +
                "<td>" +
                metrics[key][i]._119 +
                "</td>" +
                "<td>" +
                metrics[key][i]._100 +
                "</td>" +
                "<td>" +
                metrics[key][i]._114 +
                "</td>" +
                "<td>" +
                metrics[key][i]._116 +
                "</td>" +
                "<td>" +
                metrics[key][i]._909 +
                "</td>" +
                "<td>" +
                metrics[key][i]._912 +
                "</td>" +
                "<td>" +
                metrics[key][i].others +
                "</td>" +
                "</tr>";
            }
          }
        }

        this.periodErrorsBar(key);
        this.allDayErrorsBar();
      });
    });
  }

  allDayErrorsBar() {
    Highcharts.chart("container", {
      data: {
        table: "iss_error_all_dt",
      },
      chart: {
        type: "column",
        height: 500,
        scrollablePlotArea: {
          minWidth: 700,
          minHeight: 700,
        },
      },
      title: {
        text: "Issuer Error Responses",
      },
      subtitle: {
        text: "All Day",
      },
      yAxis: {
        allowDecimals: false,
        title: {
          text: "Number of Errors",
        },
      },
      xAxis: {
        labels: {
          rotation: 90,
        },
        type: "category",
        gridLineWidth: 2,
        tickLength: 20,
        tickWidth: 2,
        tickmarkPlacement: "between",
      },
      tooltip: {
        formatter: function () {
          return (
            "<b>" +
            this.series.name +
            "</b><br/>" +
            this.point.y +
            " " +
            this.point.name.toLowerCase()
          );
        },
      },
    });
  }

  periodErrorsBar(period) {
    Highcharts.chart("container_period", {
      data: {
        table: "iss_error_period_dt",
      },
      chart: {
        type: "column",
        height: 500,
        scrollablePlotArea: {
          minWidth: 700,
          minHeight: 700,
        },
      },
      title: {
        text: "Issuer Error Responses",
      },
      subtitle: {
        text: "Errors " + period,
      },
      yAxis: {
        allowDecimals: false,
        title: {
          text: "Number of Errors",
        },
      },
      xAxis: {
        labels: {
          rotation: 90,
        },
        type: "category",
        gridLineWidth: 2,
        tickLength: 20,
        tickWidth: 2,
        tickmarkPlacement: "between",
      },
      tooltip: {
        formatter: function () {
          return (
            "<b>" +
            this.series.name +
            "</b><br/>" +
            this.point.y +
            " " +
            this.point.name.toLowerCase()
          );
        },
      },
    });
  }

  toggleFunc($event) {
    console.log($event);
    this.toggle = $event;
    this.cd.markForCheck();
  }
}
