import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbModule, NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';

import { RoutingModule } from './routing.module';
import { SharedModule } from './shared/shared.module';

import { MarkerService } from './services/marker.service';
import { AgentService } from './services/agent.service';
import { CatService } from './services/cat.service';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';
import { AppComponent } from './app.component';
import { MarkersComponent } from './markers/markers.component';
import { AgentsComponent } from './agents/agents.component';
import { CatsComponent } from './cats/cats.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AccountComponent } from './account/account.component';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    MarkersComponent,
    AgentsComponent,
    CatsComponent,
    AboutComponent,
    RegisterComponent,
    LoginComponent,
    LogoutComponent,
    AccountComponent,
    AdminComponent,
    NotFoundComponent
  ],
  imports: [
    RoutingModule,
    SharedModule,
    NgbModule.forRoot()
  ],
  providers: [
    AuthService,
    AuthGuardLogin,
    AuthGuardAdmin,
    MarkerService,
    AgentService,
    CatService,
    UserService,
    NgbPaginationConfig
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
