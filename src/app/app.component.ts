import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
  ],
  template: `
    <div class="main">
      <router-outlet />
    </div>
  `,
  styles: `
    .main {
      margin: 10px 80px;
      padding: 10px 30px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent { }
