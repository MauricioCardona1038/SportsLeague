import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'enumLabel', standalone: true })
export class EnumLabelPipe implements PipeTransform {
  transform(value: number | null | undefined, labels: Record<number, string>): string {
    if (value === null || value === undefined) {
      return '';
    }
    return labels[value] ?? String(value);
  }
}
