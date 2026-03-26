import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ProductService } from './services/product.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './components/product-list/product-list.component';
import { RouterModule, Routes } from '@angular/router';
import { routes } from './app.routes';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    CommonModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [
    provideHttpClient(),
    ProductService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
