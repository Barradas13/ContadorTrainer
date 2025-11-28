import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { TelaIndexComponent } from './app/tela-index/tela-index.component';

bootstrapApplication(TelaIndexComponent, {
  providers: [
    provideHttpClient()
  ]
}).catch(err => console.error(err));
