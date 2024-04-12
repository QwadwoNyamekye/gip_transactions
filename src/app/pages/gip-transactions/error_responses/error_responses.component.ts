import { ChangeDetectorRef, Component } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";

@Component({
  selector: "ngx-echarts",
  styleUrls: ["./error_responses.component.scss"],
  templateUrl: "./error_responses.component.html",
})
export class ErrorResponsesComponent {
  toggle = false;
  source: LocalDataSource = new LocalDataSource();
  settings = {
    pager: {
      perPage: 6,
    },
    hideSubHeader: true,
    actions: {
      position: "right",
      add: false, //  if you want to remove add button
      edit: false, //  if you want to remove edit button
      delete: false, //  if you want to remove delete button
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" aria-hidden="true"></i>',
      confirmDelete: true,
    },
    columns: {
      sessionId: {
        title: "Issuer",
        type: "string",
      },
      destInstitution: {
        title: "119",
        type: "string",
      },
      destInstitutionName: {
        title: "100",
        type: "string",
      },
      destAccountNumber: {
        title: "114",
        type: "string",
      },
      destAccountName: {
        title: "116",
        type: "string",
      },
      srcInstitution: {
        title: "909",
        type: "string",
      },
      srcInstitutionName: {
        title: "912",
        type: "string",
      },
      actionCode: {
        title: "Others",
        type: "string",
      },
    },
  };
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
