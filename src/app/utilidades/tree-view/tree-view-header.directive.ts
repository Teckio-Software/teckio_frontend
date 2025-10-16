import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[treeHeader]',
})
export class TreeViewHeaderDirective {
  constructor(public template: TemplateRef<unknown>) {}
}
