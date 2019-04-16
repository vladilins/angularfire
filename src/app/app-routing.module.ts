import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { ListingsComponent } from "./components/listings/listings.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "listings", component: ListingsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
