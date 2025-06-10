import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { User } from "../../../models/Users/user.model";
import { UserService } from "../../../services/User/user.service";
import { Address } from "../../../models/Addresses/address.model";
import { AddressService } from "../../../services/Address/address.service";
import * as L from "leaflet"; // Importa Leaflet

@Component({
  selector: "app-manage",
  templateUrl: "./manage.component.html",
})
export class ManageComponent implements OnInit {
  mode: number;
  address: Address;
  users: User[] = []; // Lista de usuarios
  theFormGroup: FormGroup; // Policía de formulario
  trySend: boolean;
  map: L.Map;
  marker: any;
  userHasAddressWarning: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private addressesService: AddressService,
    private router: Router,
    private theFormBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.trySend = false;
    // Inicializar fechas como null para que el validador required funcione
    this.address = {
      id: 0,
      user_id: [],
      street: "",
      number: "",
      latitude: 0,
      longitude: 0,
      created_at: null,
      updated_at: null,
    };
    this.configFormGroup();
  }

  ngOnInit(): void {
    this.loadUsers();
    const currentUrl = this.activatedRoute.snapshot.url.join("/");
    if (currentUrl.includes("view")) {
      this.mode = 1;
    } else if (currentUrl.includes("create")) {
      this.mode = 2;
    } else if (currentUrl.includes("update")) {
      this.mode = 3;
    }
    if (this.activatedRoute.snapshot.params.id) {
      this.address.id = this.activatedRoute.snapshot.params.id;
      this.getAddresses(this.address.id);
    } else {
      // Solo inicializa el mapa aquí si NO es modo ver
      if (this.mode !== 1) {
        this.fixLeafletIcons();
        setTimeout(() => this.initMap(), 0);
      }
    }
    if (this.mode === 1) {
      this.theFormGroup.disable();
    }

    this.fixLeafletIcons();
    setTimeout(() => this.initMap(), 0); // Asegúrate de que el DOM cargue
  }
  loadUsers() {
    this.userService.list().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        this.users = [];
      },
    });
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      id: [0, []], // Cambiado a string vacío por defecto
      user_id: [[], [Validators.required]], // null por defecto
      street: ["", [Validators.required, Validators.minLength(3)]], // null por defecto
      number: ["", [Validators.required, Validators.minLength(3)]], // null por defecto
      latitude: [0, [Validators.required]], // null por defecto
      longitude: [0, [Validators.required]], // null por defecto
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getAddresses(id: number) {
    this.addressesService.view(id).subscribe({
      next: (response) => {
        this.address = response;
        this.theFormGroup.patchValue({
          id: this.address.id,
          user_id: this.address.user_id,
          street: this.address.street,
          number: this.address.number,
          latitude: this.address.latitude,
          longitude: this.address.longitude,
        });
        // Solo inicializa el mapa aquí en modo ver
        if (this.mode === 1) {
          this.fixLeafletIcons();
          setTimeout(
            () =>
              this.loadMap(this.address.latitude, this.address.longitude, true),
            0
          );
        }
        console.log("addresses fetched successfully:", this.address);
      },
      error: (error) => {
        console.error("Error fetching addresses:", error);
      },
    });
  }
  back() {
    this.router.navigate(["/addresses/list"]);
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: "Error!",
        text: "Por favor, complete todos los campos requeridos.",
        icon: "error",
      });
      return;
    }

    this.addressesService.create(this.theFormGroup.value).subscribe({
      next: (addresses) => {
        console.log("Addresscreated successfully:", addresses);
        Swal.fire({
          title: "Creado!",
          text: "Registro creado correctamente.",
          icon: "success",
        });
        this.router.navigate(["/addresses/list"]);
      },
      error: (error) => {
        // Mostrar mensaje de error del backend si el usuario ya tiene dirección
        let mensaje =
          "Ocurrió un error, el usuario ya tiene una dirección registrada";
        if (error?.error?.mensaje) {
          mensaje = error.error.mensaje;
        } else if (error?.error?.message) {
          mensaje = error.error.message;
        }
        Swal.fire({
          title: "Error!",
          text: mensaje,
          icon: "error",
        });
        console.error("Error creating address:", error);
      },
    });
  }

  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: "Error!",
        text: "Por favor, complete todos los campos requeridos.",
        icon: "error",
      });
      return;
    }

    this.addressesService.update(this.theFormGroup.value).subscribe({
      next: (addresses) => {
        console.log("Address updated successfully:", addresses);
        Swal.fire({
          title: "Actualizado!",
          text: "Registro actualizado correctamente.",
          icon: "success",
        });
        this.router.navigate(["/addresses/list"]);
      },
      error: (error) => {
        console.error("Error updating role:", error);
      },
    });
  }

  private fixLeafletIcons(): void {
    // @ts-ignore (evita error por tipos)
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }

  initMap(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          this.loadMap(lat, lng);
        },
        () => {
          // Si el usuario niega la ubicación, usar coordenadas por defecto
          this.loadMap(4.60971, -74.08175); // Bogotá, por ejemplo
        }
      );
    } else {
      this.loadMap(4.60971, -74.08175);
    }
  }

  loadMap(lat: number, lng: number, readonly: boolean = false): void {
    this.map = L.map("map").setView([lat, lng], 15);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(this.map);

    this.marker = L.marker([lat, lng], { draggable: false }).addTo(this.map);

    // Solo actualiza el formulario si NO es solo lectura
    if (!readonly) {
      this.setFormLocation(lat, lng);
    }

    // Solo permite click si NO es solo lectura
    if (!readonly) {
      this.map.on("click", (e: any) => {
        if (this.mode !== 1) {
          const clickedLat = e.latlng.lat;
          const clickedLng = e.latlng.lng;

          this.marker.setLatLng([clickedLat, clickedLng]);
          this.setFormLocation(clickedLat, clickedLng);
        }
      });
    }
  }

  setFormLocation(lat: number, lng: number): void {
    this.theFormGroup.patchValue({
      latitude: lat,
      longitude: lng,
    });

    // Llamamos a la API de Nominatim para obtener la calle y el número
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    )
      .then((res) => res.json())
      .then((data) => {
        const address = data.address;
        const street = address.road || address.street || "";
        const number = address.house_number || "";

        this.theFormGroup.patchValue({
          street,
          number,
        });
      });
  }
}
