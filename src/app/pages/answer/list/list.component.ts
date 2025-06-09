import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Answer } from '../../../models/Answer/answer.model';
import { AnswerService } from '../../../services/Answer/answer.service';
import { UserService } from '../../../services/User/user.service';
import { SecurityquestionService } from '../../../services/SecurityQuestion/securityquestion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  answers: Answer[] = [];
  users: any[] = [];
  securityQuestions: any[] = [];
  isLoading: boolean = false;

  constructor(
    private answerService: AnswerService,
    private userService: UserService,
    private securityQuestionService: SecurityquestionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadSecurityQuestions();
    this.loadAnswers();
  }

  loadUsers(): void {
    this.userService.list().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => console.error('Error loading users:', error)
    });
  }

  loadSecurityQuestions(): void {
    this.securityQuestionService.list().subscribe({
      next: (questions) => {
        this.securityQuestions = questions;
      },
      error: (error) => console.error('Error loading security questions:', error)
    });
  }

  loadAnswers(): void {
    this.isLoading = true;
    this.answerService.list().subscribe({
      next: (response) => {
        this.answers = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar respuestas:', error);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las respuestas'
        });
      }
    });
  }

  create(): void {
    this.router.navigate(['/answers/create']);
  }

  edit(answer: Answer): void {
    this.router.navigate(['/answers/edit', answer.id]);
  }

  delete(id: number): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.answerService.delete(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'La respuesta fue eliminada correctamente.'
            });
            this.loadAnswers();
          },
          error: (error) => {
            console.error('Error al eliminar respuesta:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar la respuesta'
            });
          }
        });
      }
    });
  }

  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.name : 'Usuario no encontrado';
  }

  getQuestionText(questionId: number): string {
    const question = this.securityQuestions.find(q => q.id === questionId);
    return question ? question.name : 'Pregunta no encontrada';
  }
}
