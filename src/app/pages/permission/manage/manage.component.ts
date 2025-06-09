import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionService } from '../../../services/permission/permission.service';
import { Permission } from '../../../models/permission/permission.model';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number = 1; // 1=view, 2=create, 3=update
  theFormGroup: FormGroup;
  trySend: boolean = false;
  permission: Permission;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private theFormBuilder: FormBuilder,
    private permissionService: PermissionService
  ) {
    this.theFormGroup = this.theFormBuilder.group({
      id: [0, []],
      url: ['', [Validators.required, Validators.minLength(3)]],
      method: ['', [Validators.required]],
      entity: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    if (this.activateRoute.snapshot.params.id) {
      const id = this.activateRoute.snapshot.params.id;
      this.permissionService.view(id).subscribe(
        (data) => {
          this.theFormGroup.patchValue(data);
        },
        (error) => {
          console.error('Error loading permission:', error);
        }
      );
    }
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  create() {
    if (this.theFormGroup.invalid) {
      this.trySend = true;
      console.log('Form is invalid:', this.theFormGroup.errors);
      console.log('Form values:', this.theFormGroup.value);
      return;
    }

    console.log('Creating permission with data:', this.theFormGroup.value);
    
    this.permissionService.create(this.theFormGroup.value).subscribe(
      (response) => {
        console.log('Permission created successfully:', response);
        this.router.navigate(['/permissions/list']);
      },
      (error) => {
        console.error('Error creating permission:', error);
        if (error.error) {
          console.error('Error details:', error.error);
        }
      }
    );
  }

  update() {
    if (this.theFormGroup.invalid) {
      this.trySend = true;
      return;
    }

    this.permissionService.update(this.theFormGroup.value).subscribe(
      () => {
        this.router.navigate(['/permissions/list']);
      },
      (error) => {
        console.error('Error updating permission:', error);
        if (error.error) {
          console.error('Error details:', error.error);
        }
      }
    );
  }

  back() {
    this.router.navigate(['/permissions/list']);
  }
} 