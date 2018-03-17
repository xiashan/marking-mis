import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { OrdersComponent } from './order/orders.component';
import { OrderAgentsComponent } from './order/order-agents.component';
import { OrderMembersComponent } from './order/order-members.component';
import { TopicsComponent } from './topic/topics.component';
import { MembersComponent } from './members/members.component';
import { AgentsComponent } from './agents/agents.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AccountComponent } from './account/account.component';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';

const routes: Routes = [
  { path: '', component: TopicsComponent },
  { path: 'orders', component: OrdersComponent},
  { path: 'order/members/:id', component: OrderMembersComponent},
  { path: 'order/agents/:id', component: OrderAgentsComponent},
  { path: 'topics', component: TopicsComponent},
  { path: 'members', component: MembersComponent},
  { path: 'agents', component: AgentsComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuardLogin] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuardAdmin] },
  { path: 'notfound', component: NotFoundComponent },
  { path: '**', redirectTo: '/notfound' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class RoutingModule {}
