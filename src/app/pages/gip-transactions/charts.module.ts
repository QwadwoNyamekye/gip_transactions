import { NgModule } from "@angular/core";
import { NgxEchartsModule } from "ngx-echarts";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ChartModule } from "angular2-chartjs";
import { Ng2SmartTableModule } from "ng2-smart-table";
import {
  NbButtonModule,
  NbCardModule,
  NbButtonGroupModule,
  NbLayoutModule,
  NbInputModule,
  NbDatepickerModule,
} from "@nebular/theme";

import { ThemeModule } from "../../@theme/theme.module";

import { ChartsRoutingModule, routedComponents } from "./charts-routing.module";
import { EchartsMultipleXaxisComponent } from "./inward_outward/echarts-multiple-xaxis.component";
import { EchartsBarComponent } from "./error_responses/echarts-bar.component";
import { EchartsPieComponent } from "./nec_ftc_ratio/echarts-pie.component";

const components = [
  EchartsMultipleXaxisComponent,
  EchartsBarComponent,
  EchartsPieComponent,
];

@NgModule({
  imports: [
    NbInputModule,
    NbDatepickerModule,
    Ng2SmartTableModule,
    NbLayoutModule,
    NbButtonGroupModule,
    NbButtonModule,
    ThemeModule,
    ChartsRoutingModule,
    NgxEchartsModule,
    NgxChartsModule,
    ChartModule,
    NbCardModule,
  ],
  declarations: [...routedComponents, ...components],
})
export class ChartsModule {}
