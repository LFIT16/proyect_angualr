import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SecurityQuestionRoutingModule } from './security-question-routing.module';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { HttpClientModule } from '@angular/common/http';
import { SecurityquestionService } from '../../services/SecurityQuestion/securityquestion.service';

@NgModule({
  declarations: [
    ListComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    SecurityQuestionRoutingModule
  ],
  providers: [
    SecurityquestionService
  ]
})
export class SecurityQuestionModule { }
