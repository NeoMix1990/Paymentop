import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-other',
  standalone: true,
  templateUrl: './other.page.html',
  styleUrl: './other.page.scss',
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OtherPage { }
