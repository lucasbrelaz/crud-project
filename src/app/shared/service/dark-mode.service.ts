import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

const APP_THEMES = [
  { name: 'Tema Escuro', value: 'theme-dark' },
  { name: 'Tema Claro', value: 'theme-light' },
];

export type TAppTheme = (typeof APP_THEMES)[number]['value'];

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private readonly document = inject(DOCUMENT);
  private readonly _currentTheme = signal<TAppTheme>('theme-light');
  readonly currentTheme = this._currentTheme.asReadonly();

  private readonly allThemeClasses = APP_THEMES.map((t) => t.value);

  constructor() {
    effect(() => {
      const theme = this._currentTheme();
      this.updateBodyTheme(theme);
    });
  }
  /**
   * Updates the application theme.
   * @param theme The theme class name to apply.
   */
  setTheme(theme: TAppTheme): void {
    this._currentTheme.set(theme);
  }

  /**
   * Uses classList to toggle theme classes efficiently.
   */
  private updateBodyTheme(theme: TAppTheme): void {
    const classList = this.document.body.classList;
    classList.remove(...this.allThemeClasses);
    classList.add(theme);
  }
}
