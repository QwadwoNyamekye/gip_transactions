import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { NbAuthService, NbAuthJWTToken } from "@nebular/auth";
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
    private authService: NbAuthService,
    private toastrService: NbToastrService
  ) {
    this.initializeVars();
    this.initializeWebSocketConnection();
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
    setTimeout(this.initializeWebSocketConnection, 10000);
    console.log("STOMP: Reconecting in 10 seconds");
  }

  initializeWebSocketConnection() {
    var websocket = environment.websocket;
    const serverUrl = websocket;
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(() => {
      return ws;
    });

    const that = this;
    console.log("STOMP CLIENT");
    console.log(this.stompClient);
    // this.stompClient.reconnect_delay = 1000;
    this.stompClient.reconnectDelay = 1000;

    this.stompClient.connect(
      {},
      (frame) => {
        console.log("WEBSOCKET CONNECTED");
        that.stompClient.subscribe("/realtime/alert", (message) => {
          console.log("NEW WEBSOCKET CONNECTION");
          console.log(message);
          var websocketdata = message.body.split(":");
          var websocketMessage = websocketdata[0];
          console.log(that.user);
          if (
            websocketMessage != "" &&
            [websocketdata[1], websocketdata[2]].includes(String(that.user.id))
          ) {
            that.toastrService.success(
              websocketMessage,
              "Bulk File Processing",
              {
                duration: 8000,
                destroyByClick: true,
                duplicatesBehaviour: "previous",
                preventDuplicates: true,
              }
            );
            that.compInstance.next();
          }
        });
      },
      (error) => {},
      (frame) => {}
    );
  }

  sendLineChart() {
    return this.http
      .get(this.baseUrl + "/send_linechart")
      .pipe((response) => response);
  }

  recieveLineChart() {
    return this.http
      .get(this.baseUrl + "/receive_linechart")
      .pipe((response) => response);
  }

  getStats() {
    return this.http
      .get(this.baseUrl + "/get_stats")
      .pipe((response) => response);
  }
}
