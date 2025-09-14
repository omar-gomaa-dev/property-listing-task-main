import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.models';
import { CacheService } from '../../core/cache.service';

@Component({
  selector: 'app-property-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-table.component.html',
  styleUrls: ['./property-table.component.css'],
})
export class PropertyTableComponent implements OnInit, OnDestroy {
  private propertyService = inject(PropertyService);
  private router = inject(Router);
  private cacheService = inject(CacheService);

  private cacheKey = 'property-list';
  private limit = 10;

  properties = signal<Property[]>([]);
  total = signal(0);
  page = signal(1);
  loading = signal(false);
  error = signal<string | null>(null);

  // Add filtering functionality to the property table
  statusesList = ['for sale', 'for rent', 'already taken'];
  selectedStatusFilter = signal<string | null>(null);

  // Improved caching to ensure data is retained when navigating back from details to the table
  ngOnInit(): void {
    const cached = this.cacheService.getListCache<Property>(this.cacheKey);
    if (cached) {
      const pages = Object.keys(cached.pages)
        .map((p) => +p)
        .sort((a, b) => a - b);

      for (const p of pages) {
        this.properties.update((arr) => [...arr, ...cached.pages[p]]);
      }

      this.total.set(cached.total || this.properties().length);
      this.page.set(pages.length ? Math.max(...pages) : 1);

      setTimeout(() => {
        if (cached.scrollY !== undefined) window.scrollTo(0, cached.scrollY);
      });
    } else {
      this.loadPage(1);
    }
  }

  // Enhanced overall app performance by optimizing data handling and caching
  // Add additional logging to debug Load More functionality
  // Update loadPage to handle missing X-Total-Count header
  // Add detailed logging to debug server response in loadPage
  // Ensure Load More fetches and displays new pages correctly
  loadPage(p: number) {
    console.log(`Attempting to load page: ${p}`);
    if (this.loading()) {
      console.log('Load Page prevented: already loading');
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    this.propertyService.getProperties(p, this.limit).subscribe({
      next: (res: { items: Property[]; total: number }) => {
        console.log(
          `Page ${p} loaded successfully with ${res.items.length} items.`
        );
        console.log('Full server response:', res);

        // Append new items to the properties list
        this.properties.update((arr) => {
          const updatedProperties = [...arr, ...res.items];
          console.log('Updated properties:', updatedProperties);
          return updatedProperties;
        });

        // Update total and current page
        this.total.set(res.total);
        this.page.set(p);

        // Save to cache
        this.cacheService.savePage(this.cacheKey, p, res.items, res.total);
        this.loading.set(false);
      },
      error: (err) => {
        console.log('Failed to load page', err);
        this.error.set('Failed to load properties');
        this.loading.set(false);
      },
    });
  }

  // Ensure Load More works until all data is loaded
  loadMore() {
    console.log('Load More button clicked');
    console.log('Current page:', this.page());
    console.log('Total pages:', Math.ceil(this.total() / this.limit));

    if (!this.hasMorePages()) {
      console.log('No more pages to load');
      return;
    }

    this.loadPage(this.page() + 1);
  }

  // Add a method to log the state of the disabled condition
  logDisabledState(): boolean {
    const isDisabled = this.properties().length >= this.total();
    console.log('Disabled state:', isDisabled);
    console.log('Properties length:', this.properties().length);
    console.log('Total properties:', this.total());
    return isDisabled;
  }

  // Add logic to check for additional pages
  hasMorePages(): boolean {
    const totalPages = Math.ceil(this.total() / this.limit);
    return this.page() < totalPages;
  }

  // Add filtering functionality to the property table
  statuses = ['for sale', 'for rent', 'already taken'];
  selectedStatus = signal<string | null>(null);

  filterProperties(): void {
    const status = this.filterStatus.toLowerCase().trim();
    const query = this.searchQuery.toLowerCase().trim();

    const allLoadedProperties =
      this.cacheService.getListCache<Property>(this.cacheKey)?.pages || {};

    const allProperties = Object.values(allLoadedProperties).flat();

    console.log('Filtering properties with status:', status);
    console.log('Search query:', query);
    console.log('All loaded properties:', allProperties);

    let filtered = allProperties;

    if (status) {
      filtered = filtered.filter((property) => {
        const propertyStatus = property.status?.toLowerCase().trim();
        console.log('Property status:', propertyStatus);
        return propertyStatus === status;
      });
    }

    if (query) {
      filtered = filtered.filter(
        (property) =>
          property['name'].toLowerCase().includes(query) ||
          (property.address && property.address.toLowerCase().includes(query))
      );
    }

    console.log('Filtered properties:', filtered);
    this.properties.set(filtered);
  }

  // Add search functionality to the property table
  searchQuery: string = '';
  filterStatus: string = '';

  searchProperties(): void {
    const query = this.searchQuery.toLowerCase();
    if (!query) {
      this.properties.set(
        this.cacheService.getListCache<Property>(this.cacheKey)?.pages[1] || []
      );
      return;
    }
    const searched = this.properties().filter(
      (property) =>
        property['name'].toLowerCase().includes(query) ||
        (property.address && property.address.toLowerCase().includes(query))
    );
    this.properties.set(searched);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.searchQuery = input.value;
      this.searchProperties();
    }
  }

  onFilter(event: Event): void {
    const select = event.target as HTMLSelectElement;
    if (select) {
      this.filterStatus = select.value;
      this.filterProperties();
    }
  }

  navigateToDetails(id: number): void {
    this.router.navigate(['/details', id]);
  }

  trackById(_: number, item: Property) {
    return item.id;
  }

  @HostListener('window:beforeunload')
  saveScrollBeforeUnload() {
    this.cacheService.saveScroll(this.cacheKey, window.scrollY);
  }

  ngOnDestroy() {
    this.cacheService.saveScroll(this.cacheKey, window.scrollY);
  }
}
