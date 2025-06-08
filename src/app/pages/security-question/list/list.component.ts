import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Securityquestion } from '../../../models/SecurityQuestion/securityquestion.model';
import { SecurityquestionService } from '../../../services/SecurityQuestion/securityquestion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  securityQuestions: Securityquestion[] = [];

  constructor(
    private securityQuestionService: SecurityquestionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSecurityQuestions();
  }

  loadSecurityQuestions() {
    this.securityQuestionService.list().subscribe({
        next: (response) => {
            console.log('Security questions received:', response); // Para debuggear
            this.securityQuestions = response;
        },
        error: (error) => {
          console.error('Error loading questions:', error);
          Swal.fire({
            title: 'Error',
            text: 'No se pudieron cargar las preguntas de seguridad',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
    });
  }

  create() {
    this.router.navigate(['/security-questions/create']);
  }

  edit(question: Securityquestion) {
    this.router.navigate(['/security-questions/update', question.id]);
  }

  view(question: Securityquestion) {
    this.router.navigate(['/security-questions/view', question.id]);
  }

  delete(id: number) {
    Swal.fire({
      title: '¿Está seguro?',
      text: "¿Desea eliminar esta pregunta de seguridad?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.securityQuestionService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'La pregunta ha sido eliminada', 'success');
            this.loadSecurityQuestions();
          },
          error: (error) => {
            console.error('Error deleting question:', error);
            Swal.fire('Error', 'No se pudo eliminar la pregunta', 'error');
          }
        });
      }
    });
  }
}
