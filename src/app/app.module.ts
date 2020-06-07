import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot([
            { path: '', pathMatch: 'full', redirectTo: 'signup' },
            { path: 'signup', loadChildren: () => import('./features/signup').then((module) => module.SignupFeatureModule) },
            { path: 'welcome', loadChildren: () => import('./features/welcome').then((module) => module.WelcomeFeatureModule) }
        ])
    ],
    providers: [],
    declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
