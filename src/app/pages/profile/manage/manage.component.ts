import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../../services/profile/profile.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  isEdit: boolean = false;
  profileId?: number;
  userId?: number;
  form: any = {
    phone: ''
  };
  photoPreview?: string;
  photoFile?: File;
  baseUrl: string = `${environment.url_ms_security}/profiles`;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.profileId = params['id'] ? +params['id'] : undefined;
      this.userId = params['userId'] ? +params['userId'] : undefined;
      this.isEdit = !!this.profileId;

      if (this.isEdit && this.profileId) {
        this.profileService.getById(this.profileId).subscribe({
          next: (data) => {
            this.form.phone = data.phone;
            this.userId = data.user_id;
            if (data.photo) {
              this.photoPreview = `${this.baseUrl}/${data.photo}`;
            }
          },
          error: (err) => console.error('Error loading profile', err)
        });
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.photoFile = file;
      const reader = new FileReader();
      reader.onload = e => this.photoPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.isEdit && this.profileId) {
      this.profileService.update(this.profileId, this.form, this.photoFile || null).subscribe({
        next: () => this.router.navigate(['/profiles']),
        error: (err) => console.error('Error updating profile', err)
      });
    } else if (this.userId) {
      this.profileService.create(this.userId, this.form, this.photoFile || null).subscribe({
        next: () => this.router.navigate(['/profiles']),
        error: (err) => console.error('Error creating profile', err)
      });
    }
  }
}
