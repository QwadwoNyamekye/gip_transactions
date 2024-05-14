import { NgModule } from "@angular/core";
import { NgxEchartsModule } from "ngx-echarts";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ChartModule } from "angular2-chartjs";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { HighchartsChartModule } from "highcharts-angular";
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
import { EchartsBarComponent } from "./error_responses/echarts-bar.component";
import { EchartsPieComponent } from "./nec_ftc_ratio/echarts-pie.component";

const components = [
  EchartsBarComponent,
  EchartsPieComponent,
];

@NgModule({
  imports: [
    HighchartsChartModule,
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
