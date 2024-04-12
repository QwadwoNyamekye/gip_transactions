import {
  ChangeDetectorRef,
  Component,
} from "@angular/core";

@Component({
  selector: "ngx-echarts",
  styleUrls: ["./inward_outward.component.scss"],
  templateUrl: "./inward_outward.component.html",
})
export class InwardOutwardComponent {
  toggle = false;
  items = [
    { value: 10, title: "Item 1", color: "#ff0000" }, // Red
    { value: 20, title: "Item 2", color: "#00ff00" }, // Green
    { value: 30, title: "Item 3", color: "#0000ff" }, // Blue
    { value: 40, title: "Item 4", color: "#ffff00" }, // Yellow
    { value: 50, title: "Item 5", color: "#ff00ff" }, // Magenta
  ];

  constructor(private cd: ChangeDetectorRef) {}

  toggleFunc($event) {
    console.log($event);
    this.toggle = $event;
    this.cd.markForCheck();
  }
}
