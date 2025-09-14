import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { ApiService } from './api.service';
import { Property } from '../models/property.models';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private api = inject(ApiService);
  private endpoint = 'properties';

  // جلب properties مع pagination
  // Fallback to load all data if pagination is not supported
  getProperties(page = 1, limit = 10) {
    return this.api.get<Property[]>(this.endpoint).pipe(
      map((res) => {
        const body = res.body as Property[];
        const total = +(res.headers.get('X-Total-Count') || body.length || 0);

        // Simulate pagination locally without warning
        if (!res.headers.get('X-Total-Count')) {
          const startIndex = (page - 1) * limit;
          const endIndex = page * limit;
          return {
            items: body.slice(startIndex, endIndex),
            total: body.length,
          };
        }

        return { items: body, total };
      })
    );
  }

  // جلب property واحدة بالتفاصيل
  getPropertyById(id: number) {
    return this.api.getById<Property>(this.endpoint, id);
  }
}
