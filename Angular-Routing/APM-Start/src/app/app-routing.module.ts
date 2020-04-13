import { SelectiveStrategy } from "./selective-strategy.service";
import { AuthGuard } from "./user/auth.guard";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { WelcomeComponent } from "./home/welcome.component";
import { PageNotFoundComponent } from "./page-not-found.component";

const ROUTES = [
  { path: "welcome", component: WelcomeComponent },
  { path: "", redirectTo: "welcome", pathMatch: "full" },
  {
    //lazy loading, if not required add ProductModule in app.module.ts and then add products route in product.module.ts
    path: "products",
    data: { preload: false },
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./products/product.module").then((m) => m.ProductModule),
  },
  { path: "**", component: PageNotFoundComponent },
];
@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES, {
      enableTracing: true,
      //   preloadingStrategy: SelectiveStrategy,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
