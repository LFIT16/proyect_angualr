import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityquestionService } from '../../../services/SecurityQuestion/securityquestion.service';
import { Securityquestion } from '../../../models/SecurityQuestion/securityquestion.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  mode: number = 0; // 1: view, 2: create, 3: update
  securityQuestion: Securityquestion;
  theFormGroup: FormGroup;
  trySend: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private securityQuestionService: SecurityquestionService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.theFormGroup = this.formBuilder.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      createdAt: [new Date()],
      updatedAt: [new Date()]
    });
  }

  ngOnInit(): void {
    this.determineMode();
    if (this.mode === 1 || this.mode === 3) {
      const id = this.activatedRoute.snapshot.params['id'];
      if (id) {
        this.loadQuestion(id);
      }
    }
  }

  private determineMode(): void {
    const url = this.activatedRoute.snapshot.url.join('/');
    if (url.includes('view')) {
      this.mode = 1;
    } else if (url.includes('create')) {
      this.mode = 2;
    } else if (url.includes('update')) {
      this.mode = 3;
    }
  }

  private loadQuestion(id: number): void {
    this.securityQuestionService.view(id).subscribe({
      next: (question) => {
        this.securityQuestion = question;
        this.theFormGroup.patchValue(question);
      },
      error: (error) => {
        console.error('Error loading question:', error);
        Swal.fire('Error', 'No se pudo cargar la pregunta', 'error');
      }
    });
  }

  create(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
      return;
    }

    const questionData = {
      ...this.theFormGroup.value,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.securityQuestionService.create(questionData).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Pregunta creada correctamente', 'success');
        this.router.navigate(['/security-questions/list']);
      },
      error: (error) => {
        console.error('Error creating question:', error);
        Swal.fire('Error', 'No se pudo crear la pregunta', 'error');
      }
    });
  }

  update(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
      return;
    }

    this.securityQuestionService.update(this.theFormGroup.value).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Pregunta actualizada correctamente', 'success');
        this.router.navigate(['/security-questions/list']);
      },
      error: (error) => {
        console.error('Error updating question:', error);
        Swal.fire('Error', 'No se pudo actualizar la pregunta', 'error');
      }
    });
  }

  back(): void {
    this.router.navigate(['/security-questions/list']);
  }
}
