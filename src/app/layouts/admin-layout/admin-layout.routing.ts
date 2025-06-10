import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
 
export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
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

  {
    path: 'digital-signatures',
    children: [
      {
        path: '',
        loadChildren: () => import('../../pages/digitalsignature/digitalsignature.module')
          .then(m => m.DigitalsignatureModule)
      }
    ]
  },
    {
        path: 'profiles',
        children: [
            {
                path: '',
                loadChildren: () => import('../../pages/profile/profile.module').then(m => m.ProfileModule)
            }
        ]
    },
];
