import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Answer } from '../../models/Answer/answer.model';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  private readonly BASE_URL = `${environment.url_ms_security}/answers`;

  constructor(private http: HttpClient) {}

  list(): Observable<Answer[]> {
    return this.http.get<Answer[]>(this.BASE_URL);
  }

  view(id: number): Observable<Answer> {
    return this.http.get<Answer>(`${this.BASE_URL}/${id}`);
  }

  getByUser(userId: number): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.BASE_URL}/user/${userId}`);
  }

  getByQuestion(questionId: number): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.BASE_URL}/question/${questionId}`);
  }

  getByUserAndQuestion(userId: number, questionId: number): Observable<Answer> {
    return this.http.get<Answer>(
      `${this.BASE_URL}/user/${userId}/question/${questionId}`
    );
  }

  create(userId: number, questionId: number, data: { content: string }): Observable<Answer> {
    return this.http.post<Answer>(
      `${this.BASE_URL}/user/${userId}/question/${questionId}`,
      data
    );
  }

  update(answerId: number, data: { content: string }): Observable<Answer> {
    return this.http.put<Answer>(`${this.BASE_URL}/${answerId}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }

  // Helper method to validate answer data
  private validateAnswerData(data: any): boolean {
    return data && data.content && 
           typeof data.content === 'string' && 
           data.content.trim().length > 0;
  }
}
