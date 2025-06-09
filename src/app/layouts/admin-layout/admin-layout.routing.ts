import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TableListComponent } from '../../pages/table-list/table-list.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';

 
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
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
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
        path: 'user-roles',
        children: [
            {
                path: '',
                loadChildren: () => import('../../pages/userRole/usersRoles.module').then(m => m.UsersRolesModule)
            }
        ]
    },
    {
        path: 'passwords',
        children: [
            {
                path: '',
                loadChildren: () => import('../../pages/password/passwords.module').then(m => m.PasswordsModule)
            }
        ]
    },
    {
        path: 'addresses',
        children: [
            {
                path: '',
                loadChildren: () => import('../../pages/address/addresses.module').then(m => m.AddressesModule)
            }
        ]
    },
    {
    path: 'devices',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../pages/device/devices.module').then(m => m.DeviceModule)
      }
    ]
  },

  {
    path: 'security-questions',
    children: [
      {
        path: '',
        loadChildren: () => import('../../pages/security-question/security-question.module')
          .then(m => m.SecurityQuestionModule)
      }
    ]
  },

  {
    path: 'answers',
    children: [
      {
        path: '',
        loadChildren: () => import('../../pages/answer/answer.module')
          .then(m => m.AnswerModule)
      }
    ]
  },


];
