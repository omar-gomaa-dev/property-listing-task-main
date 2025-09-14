import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PropertyDetailsComponent } from './components/property-details/property-details.component';
import { PropertyTableComponent } from './components/property-table/property-table.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'property-listing-task';
}
