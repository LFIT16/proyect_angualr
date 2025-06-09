import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Answer } from '../../../models/Answer/answer.model';
import { AnswerService } from '../../../services/Answer/answer.service';
import { UserService } from '../../../services/User/user.service';
import { SecurityquestionService } from '../../../services/SecurityQuestion/securityquestion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  mode: number = 0;
  answer: Answer;
  theFormGroup: FormGroup;
  trySend: boolean = false;
  users: any[] = [];
  securityQuestions: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private answerService: AnswerService,
    private userService: UserService,
    private securityQuestionService: SecurityquestionService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.theFormGroup = this.formBuilder.group({
      user_id: ['', [Validators.required]],
      security_question_id: ['', [Validators.required]],
      content: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadSecurityQuestions();
    this.determineMode();

    if (this.mode === 1 || this.mode === 3) {
      const id = Number(this.activatedRoute.snapshot.params['id']);
      if (id) {
        this.loadAnswer(id);
      }
    }
  }

  private determineMode(): void {
    const url = this.router.url;
    if (url.includes('view')) {
      this.mode = 1;
    } else if (url.includes('create')) {
      this.mode = 2;
    } else if (url.includes('update')) {
      this.mode = 3;
    }
  }

  private loadAnswer(id: number): void {
    this.answerService.view(id).subscribe({
      next: (answer) => {
        this.answer = answer;
        this.theFormGroup.patchValue({
          ...answer,
          created_at: new Date(answer.created_at),
          updated_at: new Date(answer.updated_at)
        });
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cargar la respuesta', 'error');
        this.router.navigate(['/answers/list']);
      }
    });
  }

  create(): void {
    this.trySend = true;

    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
      return;
    }

    const formData = this.theFormGroup.value;
    const data = {
      content: formData.content
    };

    this.answerService.create(
      formData.user_id,
      formData.security_question_id,
      data
    ).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Respuesta creada correctamente', 'success');
        this.router.navigate(['/answers/list']);
      },
      error: (error) => {
        console.error('Error creating answer:', error);
        let errorMessage = 'No se pudo crear la respuesta';
        if (error.error?.error) {
          errorMessage = error.error.error;
        }
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  update(): void {
    this.trySend = true;

    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
      return;
    }

    if (!this.answer?.id) {
      Swal.fire('Error', 'No se puede actualizar la respuesta', 'error');
      return;
    }

    const formData = this.theFormGroup.value;
    const data = {
      content: formData.content
    };

    this.answerService.update(this.answer.id, data).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Respuesta actualizada correctamente', 'success');
        this.router.navigate(['/answers/list']);
      },
      error: (error) => {
        console.error('Error updating answer:', error);
        let errorMessage = 'No se pudo actualizar la respuesta';
        if (error.error?.error) {
          errorMessage = error.error.error;
        }
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  back(): void {
    this.router.navigate(['/answers/list']);
  }

  loadUsers(): void {
    this.userService.list().subscribe({
      next: (users) => this.users = users,
      error: (error) => console.error('Error loading users:', error)
    });
  }

  loadSecurityQuestions(): void {
    this.securityQuestionService.list().subscribe({
      next: (questions) => {
        console.log('Security Questions loaded:', questions); // For debugging
        this.securityQuestions = questions;
      },
      error: (error) => {
        console.error('Error loading security questions:', error);
        Swal.fire('Error', 'No se pudieron cargar las preguntas de seguridad', 'error');
      }
    });
  }
}
