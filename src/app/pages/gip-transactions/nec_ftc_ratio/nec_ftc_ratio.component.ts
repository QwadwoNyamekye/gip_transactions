import {
  ChangeDetectorRef,
  Component,
} from "@angular/core";

@Component({
  selector: "ngx-echarts",
  styleUrls: ["./nec_ftc_ratio.component.scss"],
  templateUrl: "./nec_ftc_ratio.component.html",
})
export class NECFTCRatioComponent {
  toggle = false;
  title_timestamp = "NEC - FTC RATIO @";
  title_all_day = " NEC - FTC RATIO ALL DAY";

  constructor(private cd: ChangeDetectorRef) {}

  toggleFunc($event) {
    console.log($event);
    this.toggle = $event;
    this.cd.markForCheck();
  }
}
