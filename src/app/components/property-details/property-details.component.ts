import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.models';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css'],
})
export class PropertyDetailsComponent {
  private route = inject(ActivatedRoute);
  private propertyService = inject(PropertyService);

  property = signal<Property | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  prop: any;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.error.set('Invalid property ID');
      return;
    }

    this.fetchProperty(id);
  }

  private fetchProperty(id: number) {
    this.loading.set(true);
    this.error.set(null);

    this.propertyService.getPropertyById(id).subscribe({
      next: (res) => {
        this.property.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load property details');
        this.loading.set(false);
      },
    });
  }
}
