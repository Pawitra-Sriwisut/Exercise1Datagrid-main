import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DisplayUserComponent } from './display-user/display-user.component';
import { ModifiedUserComponent } from './modified-user/modified-user.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/display-user', pathMatch: 'full' },
    { path: 'display-user', component: DisplayUserComponent },
    { path: 'modified-user', component: ModifiedUserComponent, children: [
        { path: 'new', component: ModifiedUserComponent},
        { path: ':id/edit', component: ModifiedUserComponent}
    ] }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
})
export class AppRoutingModule {

}