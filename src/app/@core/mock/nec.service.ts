import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CompatClient, Stomp } from "@stomp/stompjs";
// import * as SockJS from "sockjs-client";
import SockJS from "sockjs-client";
import { NbToastrService } from "@nebular/theme";
import { environment } from "../../../environments/environment.prod";
import { Subject } from "rxjs/Subject";

@Injectable({ providedIn: "root" })
export class APIService {
  user: any;
  baseUrl = environment.baseUrl;
  data: any;
  public stompClient: CompatClient;
  private compInstance = new Subject<any>();
  comp$ = this.compInstance.asObservable();

  constructor(
    private http: HttpClient,
    private toastrService: NbToastrService
  ) {
    this.initializeVars();
    this.issuerErrorResponseWebsocket();
  }

  initializeVars() {
    this.user = JSON.parse(sessionStorage.getItem("user")); // here we receive a payload from the token and assigns it to our `user` variable
    console.log(this.user);
  }

  websocketSuccessCallback() {
    this.stompClient.subscribe("/info", (message) => {
      console.log("WEBSOCKET MESSAGE");
      console.log(message);
      var websocketdata = message.body.split(":");
      var websocketMessage = websocketdata[0];
      var websocketUser = websocketdata[1];
      console.log(this.user);
      if (websocketMessage != "" && websocketUser == this.user.id) {
        this.toastrService.success(websocketMessage, "Bulk File Processing", {
          duration: 8000,
          destroyByClick: true,
          duplicatesBehaviour: "previous",
          preventDuplicates: true,
        });
      }
    });
  }

  websocketFailureCallback(error) {
    console.log("STOMP: " + error);
    setTimeout(this.issuerErrorResponseWebsocket, 10000);
    console.log("STOMP: Reconecting in 10 seconds");
  }

  issuerErrorResponseWebsocket() {
    var websocket = environment.websocket;
    const serverUrl = websocket;
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(() => {
      return ws;
    });

    const that = this;
    // this.stompClient.reconnect_delay = 1000;
    this.stompClient.reconnectDelay = 1000;

    this.stompClient.connect(
      {},
      (frame) => {
        that.stompClient.subscribe("/topic/iss_error_responses", (message) => {
          console.log("Issuer Error Response Websocket");
          console.log(message);
          var formattedData = [];
          var metrics = JSON.parse(message.body);
          for (var key in metrics) {
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
            for (var i = 0; i < metrics[key].length; i++) {
              singleObject.data.push([
                Date.parse(metrics[key][i].x),
                0 + metrics[key][i].ftcCount,
              ]);
            }
            formattedData.push(singleObject);
            {
              that.toastrService.success("", "Bulk File Processing", {
                duration: 8000,
                destroyByClick: true,
                duplicatesBehaviour: "previous",
                preventDuplicates: true,
              });
              that.compInstance.next();
            }
          }
        });
      },
      (error) => {},
      (frame) => {}
    );
  }

  getSendLineChart() {
    return this.http
      .get(this.baseUrl + "/send_linechart")
      .pipe((response) => response);
  }

  getRecieveLineChart() {
    return this.http
      .get(this.baseUrl + "/receive_linechart")
      .pipe((response) => response);
  }

  getStats() {
    return this.http
      .get(this.baseUrl + "/get_stats")
      .pipe((response) => response);
  }  
  
  getStatsHist(date) {
    return this.http
      .get(this.baseUrl + "/get_stats_hist/"  + date)
      .pipe((response) => response);
  }

  getIssuerErrors() {
    return this.http
      .get(this.baseUrl + "/get_issuer_errors")
      .pipe((response) => response);
  }

  getNecFtcRatio() {
    return this.http
      .get(this.baseUrl + "/get_nec_ftc_ratio")
      .pipe((response) => response);
  }

  getNecFtcCount() {
    return this.http
      .get(this.baseUrl + "/get_nec_ftc_count")
      .pipe((response) => response);
  }

  getSendRecNecFtcCount() {
    return this.http
      .get(this.baseUrl + "/get_send_rec_nec_ftc_count")
      .pipe((response) => response);
  }

  getIssuerResponses() {
    return this.http
      .get(this.baseUrl + "/get_issuer_responses")
      .pipe((response) => response);
  }

  sendLineChartHist(date) {
    return this.http
      .get(this.baseUrl + "/send_linechart_hist/" + date)
      .pipe((response) => response);
  }
  
  recieveLineChartHist(date) {
    return this.http
      .get(this.baseUrl + "/receive_linechart_hist/" + date)
      .pipe((response) => response);
  }
}
