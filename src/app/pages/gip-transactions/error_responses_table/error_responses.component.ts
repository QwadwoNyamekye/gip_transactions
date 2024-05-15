import { ChangeDetectorRef, Component } from "@angular/core";
import * as Highcharts from "highcharts";
import exporting from "highcharts/modules/exporting";
import { NbThemeService } from "@nebular/theme";
import exportingData from "highcharts/modules/export-data";
import { APIService } from "../../../@core/mock/nec.service";
import { CompatClient, Stomp } from "@stomp/stompjs";
// import * as SockJS from "sockjs-client";
import SockJS from "sockjs-client";
import { NbToastrService } from "@nebular/theme";
import { environment } from "../../../../environments/environment.prod";
import { Subject } from "rxjs/Subject";

@Component({
  selector: "ngx-echarts",
  styleUrls: ["./error_responses.component.scss"],
  templateUrl: "./error_responses.component.html",
})
export class ErrorResponsesTableComponent {
  Highcharts: typeof Highcharts = Highcharts;

  constructor(private theme: NbThemeService, private apiService: APIService) {}

  ngOnInit(): void {
    exporting(Highcharts);
    exportingData(Highcharts);
    this.getloadNecFtcBar();
    this.getSendingRecievingBar();
  }

  getloadNecFtcBar() {
    this.apiService.getNecFtcCount().subscribe(
      (result) => {
        console.log("++++++++++++++++");
        console.log(result);
        var formattedData = [];
        var categories = [];
        var necSingleObject = {
          name: "NEC",
          data: [],
        };
        var ftcSingleObject = {
          name: "FTC",
          data: [],
        };
        for (var key in result) {
          console.log(key);
          categories.push(key);

          for (var i = 0; i < result[key].length; i++) {
            necSingleObject.data.push(result[key][i].necCount);
            ftcSingleObject.data.push(result[key][i].ftcCount);
          }
        }
        formattedData.push(necSingleObject, ftcSingleObject);
        this.drawNecFtcBar(categories, formattedData);
      },
      (error) => {
        console.log("++++++++++++++++");
        console.log(error);
      },
      () => {}
    );
  }
  
  getSendingRecievingBar() {
    this.apiService.getSendRecNecFtcCount().subscribe(
      (result) => {
        console.log("++++++++++++++++");
        console.log(result);
        var formattedData = [];
        var categories = [];
        var sendSingleObject = {
          name: "OUTWARD",
          data: [],
        };
        var receiveSingleObject = {
          name: "INWARD",
          data: [],
        };
        for (var key in result) {
          console.log(key);
          categories.push(key);

          sendSingleObject.data.push(result[key][0].ftcCount);
          receiveSingleObject.data.push(result[key][1].ftcCount);
        }
        formattedData.push(sendSingleObject, receiveSingleObject);
        this.drawSendingReceivingBar(categories, formattedData);
      },
      (error) => {
        console.log("++++++++++++++++");
        console.log(error);
      },
      () => {}
    );
  }

  loadNecFtc_SendReceiveWS() {
    var stompClient = null;
    var socket = new SockJS("/graph_data");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
      console.log("Connected: " + frame);
      stompClient.subscribe("/topic/nec_ftc_count", function (result) {
        var metrics = JSON.parse(result.body);
        for (var key in metrics) {
          var formattedData = [];
          var categories = [];
          var necSingleObject = {
            name: "NEC",
            data: [],
          };
          var ftcSingleObject = {
            name: "FTC",
            data: [],
          };
          for (key in metrics) {
            console.log(key);
            categories.push(key);

            for (var i = 0; i < metrics[key].length; i++) {
              necSingleObject.data.push(metrics[key][i].necCount);
              ftcSingleObject.data.push(metrics[key][i].ftcCount);
            }
          }
          formattedData.push(necSingleObject, ftcSingleObject);
          this.drawNecFtcBar(categories, formattedData);
        }
      });

      stompClient.subscribe("/topic/send_receive_count", function (result) {
        var metrics = JSON.parse(result.body);
        var formattedData = [];
        var categories = [];
        var sendSingleObject = {
          name: "OUTWARD",
          data: [],
        };
        var receiveSingleObject = {
          name: "INWARD",
          data: [],
        };
        for (var key in metrics) {
          console.log(key);
          categories.push(key);

          sendSingleObject.data.push(metrics[key][0].ftcCount);
          receiveSingleObject.data.push(metrics[key][1].ftcCount);
        }
        formattedData.push(sendSingleObject, receiveSingleObject);
        this.drawSendingReceivingBar(categories, formattedData);
      });
    });
  }

  drawNecFtcBar(categories, formattedData) {
    Highcharts.chart("container3", {
      chart: {
        type: "column",
        height: 500,
      },
      title: {
        text: "GIP Transactions",
      },
      subtitle: {
        text: "Outward",
      },
      xAxis: {
        categories: categories,
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: "Number of Transactions",
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y} </b></td></tr>',
        footerFormat: "</table>",
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: formattedData,
    });
  }

  drawSendingReceivingBar(categories, formattedData) {
    Highcharts.chart("container4", {
      chart: {
        type: "column",
        height: 500,
      },
      title: {
        text: "Funds Transfers",
      },
      subtitle: {
        text: null,
      },
      xAxis: {
        categories: categories,
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: "Number of Transactions",
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y} </b></td></tr>',
        footerFormat: "</table>",
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: formattedData,
    });
  }
}
