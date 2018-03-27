import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbModule, NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';

import { RoutingModule } from './routing.module';
import { SharedModule } from './shared/shared.module';

import { OrderService } from './services/order.service';
import { TopicService } from './services/topic.service';
import { MemberService } from './services/member.service';
import { AgentService } from './services/agent.service';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';
import { AppComponent } from './app.component';
import { OrderMembersComponent } from './order/order-members.component';
import { OrderAgentsComponent } from './order/order-agents.component';
import { OrdersComponent } from './order/orders.component';
import { TopicsComponent } from './topic/topics.component';
import { MembersComponent } from './members/members.component';
import { AgentsComponent } from './agents/agents.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AccountComponent } from './account/account.component';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [
    AppComponent,
    OrderMembersComponent,
    OrderAgentsComponent,
    OrdersComponent,
    TopicsComponent,
    MembersComponent,
    AgentsComponent,
    RegisterComponent,
    LoginComponent,
    LogoutComponent,
    AccountComponent,
    AdminComponent,
    NotFoundComponent,
    WelcomeComponent
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
    OrderService,
    TopicService,
    MemberService,
    AgentService,
    UserService,
    NgbPaginationConfig
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
