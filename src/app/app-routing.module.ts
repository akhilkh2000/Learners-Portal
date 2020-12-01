import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { FriendsComponent } from './components/friends/friends.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MentorDashboardComponent } from './components/mentor-dashboard/mentor-dashboard.component';
import { MentorProfileComponent } from './components/mentor-profile/mentor-profile.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { RegisterComponent } from './components/register/register.component';
import { RequestListComponent } from './components/request-list/request-list.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SearchComponent } from './components/search/search.component';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { AuthGuard } from './guards/auth.guard';
import { MguardGuard } from './guards/mguard.guard';
import { SguardGuard } from './guards/sguard.guard';


const routes: Routes = [
  { path: "", component : HomeComponent  },
  { path: "register", component : RegisterComponent },
  { path: "setNewPassword/:token", component : ResetPasswordComponent },
  { path: "forgotPassword", component : ForgotPasswordComponent },
  { path: "login", component : LoginComponent },
  { path: "sdashboard", component : StudentDashboardComponent , canActivate: [AuthGuard] },
  { path: "allmentors", component : SearchComponent , canActivate: [SguardGuard] },
  { path: "pubprofile/:userId", component : PublicProfileComponent , canActivate: [AuthGuard] },
  { path: "mdashboard", component : MentorDashboardComponent , canActivate: [MguardGuard] },
  { path: "sprofile", component : StudentProfileComponent , canActivate: [SguardGuard] },
  // { path: "mprofile", component : MentorProfileComponent , canActivate: [MguardGuard] },
  { path: "friends", component : FriendsComponent , canActivate: [AuthGuard] },
  { path: "chat/:chatId", component : ChatComponent , canActivate: [AuthGuard] },
  { path: "profile/edit/:userId", component : EditProfileComponent , canActivate: [AuthGuard] },
  { path: "requestList", component : RequestListComponent , canActivate: [AuthGuard] },
  { path: "", redirectTo: "/", pathMatch: "full" }, // redirect to `first-component`
  { path: "**", component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
