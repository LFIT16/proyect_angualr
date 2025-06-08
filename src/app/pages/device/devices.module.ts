import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DevicesRoutingModule } from './devices-routing.module';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';

// 👇 Importa los módulos de Angular Material necesarios
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    ListComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DevicesRoutingModule,

    // 👇 Añádelos aquí
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class DeviceModule { }
