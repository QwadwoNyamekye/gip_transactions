import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { NbDateService } from "@nebular/theme";

@Component({
  selector: "ngx-echarts",
  styleUrls: ["./inward_outward_filtered.component.scss"],
  templateUrl: "./inward_outward_filtered.component.html",
})
export class InwardOutwardFilteredComponent implements OnInit {
  toggle = false;
  max: Date;
  min: Date;
  yesterdate: any;
  data: any;
  items = [
    { value: 10, title: "Item 1", color: "#ff0000" }, // Red
    { value: 20, title: "Item 2", color: "#00ff00" }, // Green
    { value: 30, title: "Item 3", color: "#0000ff" }, // Blue
    { value: 40, title: "Item 4", color: "#ffff00" }, // Yellow
    { value: 50, title: "Item 5", color: "#ff00ff" }, // Magenta
  ];

  constructor(
    private cd: ChangeDetectorRef,
    protected dateService: NbDateService<Date>
  ) {}
  ngOnInit(): void {
    this.yesterdate = ((d) =>
      new Date(d.setDate(d.getDate() - 1)).toISOString().split("T")[0])(
      new Date()
    );
    this.max = this.dateService.addDay(this.dateService.today(), 0);
    this.data = [];
  }

  toggleFunc($event) {
    console.log($event);
    this.toggle = $event;
    this.cd.markForCheck();
  }

  filterDate($event){
    console.log($event)
  }
}
