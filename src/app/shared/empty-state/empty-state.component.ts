import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
  imports: [MatIconModule],
})
export class EmptyStateComponent {
  @Input() icon = 'storage';
  @Input() title = 'O banco de dados está vazio';
  @Input() subtitle? = '"Comece adicionando um novo registro.';
}
