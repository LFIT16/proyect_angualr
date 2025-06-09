import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DigitalSignatureService } from '../../../services/DigitalSignature/digitalsignature.service';
import { UserService } from '../../../services/User/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'] // Cambiar de .scss a .css
})
export class ManageComponent implements OnInit {
  form!: FormGroup;
  mode: number = 1;
  title: string = 'Crear firma digital';
  imageUrl: string | null = null;
  selectedFile: File | null = null;
  signatureError: string = '';
  users: any[] = [];  // Agregar esta propiedad
  imagePreviewUrl: string | null = null;  // Agregar esta propiedad

  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private drawing = false;

  constructor(
    private fb: FormBuilder,
    private dsService: DigitalSignatureService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inicializar el formulario
    this.form = this.fb.group({
      id: [null],
      user_id: ['', Validators.required],
      photo: [null]
    });

    // Cargar usuarios
    this.loadUsers();
    
    // Determinar el modo
    const id = this.route.snapshot.params['id'];
    if (id) {
      if (this.route.snapshot.url.some(segment => segment.path === 'view')) {
        this.mode = 1; // Ver
        this.title = 'Ver Firma Digital';
      } else {
        this.mode = 3; // Editar
        this.title = 'Editar Firma Digital';
      }
      this.loadSignature(id);
    } else {
      this.mode = 2; // Crear
      this.title = 'Crear Firma Digital';
    }
  }

  ngAfterViewInit(): void {
    // Inicializar canvas después de que la vista se haya cargado
    if (this.mode === 2 || this.mode === 3) {
      // Usar requestAnimationFrame en lugar de setTimeout
      requestAnimationFrame(() => {
        this.initializeCanvas();
      });
    }
  }

  // Nuevo método para inicializar el canvas
  private initializeCanvas(): void {
    if (!this.canvas) {
      console.error('Canvas element not found');
      return;
    }

    const canvasEl = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d')!;
    
    if (!this.ctx) {
      console.error('Could not get canvas context');
      return;
    }

    // Configurar el contexto
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';

    // Limpiar el canvas
    this.ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    // Mouse events
    canvasEl.addEventListener('mousedown', (e) => this.startDrawing(e));
    canvasEl.addEventListener('mousemove', (e) => this.draw(e));
    canvasEl.addEventListener('mouseup', () => this.stopDrawing());
    canvasEl.addEventListener('mouseleave', () => this.stopDrawing());

    // Touch events
    canvasEl.addEventListener('touchstart', (e) => this.startDrawing(e));
    canvasEl.addEventListener('touchmove', (e) => this.draw(e));
    canvasEl.addEventListener('touchend', () => this.stopDrawing());
  }

  startDrawing(event: MouseEvent | TouchEvent): void {
    this.drawing = true;
    this.ctx.beginPath();
    
    if (event instanceof MouseEvent) {
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.ctx.moveTo(x, y);
    } else {
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      const x = event.touches[0].clientX - rect.left;
      const y = event.touches[0].clientY - rect.top;
      this.ctx.moveTo(x, y);
    }
  }

  stopDrawing(): void {
    this.drawing = false;
    this.ctx.closePath();
  }

  draw(event: MouseEvent | TouchEvent): void {
    if (!this.drawing) return;

    event.preventDefault();
    
    if (event instanceof MouseEvent) {
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    } else {
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      const x = event.touches[0].clientX - rect.left;
      const y = event.touches[0].clientY - rect.top;
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    }
  }

  clearCanvas(): void {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.imagePreviewUrl = null;
      this.selectedFile = null;
    }
  }

  saveSignature(): void {
    const dataURL = this.canvas.nativeElement.toDataURL('image/png');
    this.imagePreviewUrl = dataURL;
    
    // Convert canvas content to a File object
    this.urlToFile(dataURL, 'signature.png').then((file) => {
      this.selectedFile = file;
      this.signatureError = '';
    });
  }

  urlToFile(url: string, filename: string): Promise<File> {
    return fetch(url)
      .then(res => res.blob())
      .then(blob => new File([blob], filename, { type: 'image/png' }));
  }

  create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      if (!this.selectedFile) this.signatureError = 'La firma es obligatoria.';
      return;
    }

    if (!this.selectedFile) {
      this.signatureError = 'La firma es obligatoria.';
      return;
    }

    const formData = new FormData();
    formData.append('user_id', this.form.value.user_id);
    formData.append('photo', this.selectedFile);

    this.dsService.create(formData).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Firma digital creada con éxito', 'success');
        this.router.navigate(['/digital-signatures/list']);
      },
      error: (error) => {
        console.error('Error creating signature:', error);
        Swal.fire('Error', 'Error al crear la firma digital', 'error');
      }
    });
  }

  update(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      if (!this.selectedFile && !this.imageUrl) this.signatureError = 'La firma es obligatoria.';
      return;
    }

    const formData = new FormData();
    formData.append('user_id', this.form.value.user_id);

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
      this.enviarUpdate(formData);
    } else if (this.imageUrl) {
      // Convert existing image to File
      this.urlToFile(this.imageUrl, 'signature.png').then((file) => {
        formData.append('photo', file);
        this.enviarUpdate(formData);
      });
    } else {
      this.signatureError = 'La firma es obligatoria.';
    }
  }

  enviarUpdate(formData: FormData): void {
    this.dsService.update(this.form.value.id, formData).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Firma digital actualizada con éxito', 'success');
        this.router.navigate(['/digital-signatures/list']); // Corregida
      },
      error: () => {
        Swal.fire('Error', 'Error al actualizar la firma digital', 'error');
      }
    });
  }

  // Agregar este método
  loadUsers(): void {
    this.userService.list().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => console.error('Error loading users:', error)
    });
  }

  // Agregar método back
  back(): void {
    this.router.navigate(['/digital-signatures/list']); // Corregida
  }

  loadSignature(id: number): void {
    this.dsService.get(id).subscribe({
      next: (response: any) => {
        if (response) {
          // Actualizar el formulario con los datos
          this.form.patchValue({
            id: response.id,
            user_id: response.user_id
          });

          // Guardar la imagen si existe
          if (response.photo) {
            this.imageUrl = response.photo;
            this.imagePreviewUrl = response.photo;
          }

          // Si estamos en modo editar, inicializar el canvas
          if (this.mode === 3 && this.canvas) {
            requestAnimationFrame(() => {
              this.initializeCanvas();
              if (response.photo) {
                this.loadImageToCanvas(response.photo);
              }
            });
          }
        }
      },
      error: (error) => {
        console.error('Error loading signature:', error);
        Swal.fire('Error', 'No se pudo cargar la firma digital', 'error');
      }
    });
  }

  // Método auxiliar para cargar imagen en el canvas
  private loadImageToCanvas(imageUrl: string): void {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Necesario para imágenes de otros dominios
    
    img.onload = () => {
      if (!this.canvas || !this.ctx) return;
      
      const canvas = this.canvas.nativeElement;
      
      // Limpiar el canvas
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calcular dimensiones manteniendo proporción
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;
      
      // Dibujar la imagen
      this.ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    img.onerror = () => {
      console.error('Error loading image to canvas');
      Swal.fire('Error', 'No se pudo cargar la imagen en el canvas', 'error');
    };

    img.src = imageUrl;
  }
}
