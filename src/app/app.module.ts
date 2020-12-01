import { BrowserModule } from '@angular/platform-browser'; //essential to run angular in browser
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { MentorDashboardComponent } from './components/mentor-dashboard/mentor-dashboard.component';
import { RequestListComponent } from './components/request-list/request-list.component';
import { FriendsComponent } from './components/friends/friends.component';
import { ChatComponent } from './components/chat/chat.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { MentorProfileComponent } from './components/mentor-profile/mentor-profile.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SearchComponent } from './components/search/search.component';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { SearchPipe } from './pipes/search.pipe';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { CreatePaymentComponent } from './components/create-payment/create-payment.component';
import { ModalModule } from "ngx-bootstrap/modal";
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    StudentDashboardComponent,
    MentorDashboardComponent,
    RequestListComponent,
    FriendsComponent,
    ChatComponent,
    StudentProfileComponent,
    MentorProfileComponent,
    SidebarComponent,
    SearchComponent,
    PublicProfileComponent,
    EditProfileComponent,
    SearchPipe,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    CreatePaymentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, 
    HttpClientModule,
    AppRoutingModule,
    ModalModule.forRoot(),
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptorService,
    multi: true,
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
