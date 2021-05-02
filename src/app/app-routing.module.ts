import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component'
import { AuthGuard } from './guards/auth.guard';
import { ConfigurationComponent } from './component/configuration/configuration.component';
import { ProjectComponent } from './component/project/project.component';
import { SigninComponent } from './component/member/signin/signin.component'
import { SignupComponent } from './component/member/signup/signup.component'
import { LogoutComponent } from './component/logout/logout.component'
import { MyinfoComponent } from './component/member/myinfo/myinfo.component';
import { BoardComponent } from './component/board/board.component';
import { HomeComponent } from './component/home.component';
import { PostComponent } from './component/board/post.component';
import { PostModifyComponent } from './component/board/post-modify.component';
import { BoardResolve } from './component/board/resolve/board-resolve';
import { AppBoardComponent } from './component/app.board/app.board.component';
import { MainViewComponent } from './component/pages/main-view/main-view.component';
import { Error404Component } from './component/common/error/error404.component';

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'license', component: ConfigurationComponent, canActivate: [AuthGuard]},
  {path: 'projects', component: ProjectComponent, canActivate: [AuthGuard]},
  {path: 'signin', component: SigninComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'logout', component: LogoutComponent, canActivate: [AuthGuard]},
  {path: 'myinfo', component: MyinfoComponent, canActivate: [AuthGuard]},
  {path: 'apps', component: AppBoardComponent, canActivate: [AuthGuard]},
  {path: 'board/:boardName', component: BoardComponent, resolve:{posts: BoardResolve}},
  {path: 'board/:boardName/post', component: PostComponent, canActivate: [AuthGuard]},
  {path: 'board/:boardName/post/:uid/modify', component: PostModifyComponent, canActivate: [AuthGuard]},
  {path: 'kanban/:boardName', component: MainViewComponent},
  {path: '**', component: Error404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  // imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
