import { ChangeDetectorRef, Component } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";

@Component({
  selector: "ngx-echarts",
  styleUrls: ["./issuer_error_responses.component.scss"],
  templateUrl: "./issuer_error_responses.component.html",
})
export class IssuerErrorResponsesComponent {
  toggle = false;
  title_timestamp = "Issuer Error Responses @";
  title_all_day = "Issuer Error Responses All Day";
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
        title: "Action Code",
        type: "string",
      },
      destInstitutionName: {
        title: "Description",
        type: "string",
      },
      destAccountNumber: {
        title: "Count",
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
