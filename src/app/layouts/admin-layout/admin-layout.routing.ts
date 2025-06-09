import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TableListComponent } from '../../pages/table-list/table-list.component';
import { TypographyComponent } from '../../pages/typography/typography.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../pages/upgrade/upgrade.component';
import { ListComponent } from '../../pages/profile/list/list.component';
import { ManageComponent } from '../../pages/profile/manage/manage.component';

 
export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'profiles', component: ListComponent },
    { path: 'profiles/create/:userId', component: ManageComponent },
    { path: 'profiles/edit/:id', component: ManageComponent },
    { path: 'upgrade',        component: UpgradeComponent },
    {
        path: 'users',
        children: [
            {
                path: '',
                loadChildren: () => import('../../pages/user/users.module').then(m => m.UsersModule)
            }
        ]
    },
    {
        path: 'roles',
        children: [
            {
                path: '',
                loadChildren: () => import('../../pages/role/roles.module').then(m => m.RolesModule)
            }
        ]
    },
    {
        path: 'permissions',
        children: [
            {
                path: '',
                loadChildren: () => import('../../pages/permission/permissions.module').then(m => m.PermissionsModule)
            }
        ]
    },
    {
        path: 'role-permissions',
        children: [
            {
                path: '',
                loadChildren: () => import('../../pages/role-permission/role-permissions.module').then(m => m.RolePermissionsModule)
            }
        ]
    },



];
