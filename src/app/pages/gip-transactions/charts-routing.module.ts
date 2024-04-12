import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ChartsComponent } from "./charts.component";
import { InwardOutwardComponent } from "./inward_outward/inward_outward.component";
import { ErrorResponsesComponent } from "./error_responses/error_responses.component";
import { NECFTCRatioComponent } from "./nec_ftc_ratio/nec_ftc_ratio.component";
import { ErrorResponsesTableComponent } from "./error_responses_table/error_responses.component";
import { IssuerErrorResponsesComponent } from "./issuer_error_responses/issuer_error_responses.component";
import { InwardOutwardFilteredComponent } from "./inward_outward_filtered/inward_outward_filtered.component";

const routes: Routes = [
  {
    path: "",
    component: ChartsComponent,
    children: [
      {
        path: "inward_outward",
        component: InwardOutwardComponent,
      },
      {
        path: "error_responses",
        component: ErrorResponsesComponent,
      },
      {
        path: "nec_ftc_ratio",
        component: NECFTCRatioComponent,
      },
      {
        path: "error_responses_table",
        component: ErrorResponsesTableComponent,
      },
      {
        path: "issuer_error_responses_table",
        component: IssuerErrorResponsesComponent,
      },
      {
        path: "inward_outward_filtered",
        component: InwardOutwardFilteredComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChartsRoutingModule {}

export const routedComponents = [
  ChartsComponent,
  InwardOutwardComponent,
  ErrorResponsesComponent,
  NECFTCRatioComponent,
  ErrorResponsesTableComponent,
  IssuerErrorResponsesComponent,
  InwardOutwardFilteredComponent
];
