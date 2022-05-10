import { NgModule } from '@angular/core';
import { StudentsComponent} from "./pages/students/students.component";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {path:'students', component: StudentsComponent },
  {path:'students/new', component: StudentsComponent },
  {path:'students/id', component: StudentsComponent },

]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
