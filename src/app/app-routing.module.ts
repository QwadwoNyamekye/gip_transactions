import { ExtraOptions, RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthGuard } from "./auth-guard.service";

export const routes: Routes = [
  {
    path: "pages",
    // canActivate: [AuthGuard],
    loadChildren: () =>
      import("./pages/pages.module").then((m) => m.PagesModule),
  },
  { path: "", redirectTo: "pages/charts/inward-outward", pathMatch: "full" },
  { path: "error", redirectTo: "miscellaneous/404", pathMatch: "full" },
  { path: "**", redirectTo: "pages/charts/inward-outward" },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
