import {
    Component,
    ContentChild,
    Input,
    OnInit,
    TemplateRef,
  } from '@angular/core';
  import { TreeView } from './tsTreeView';
  
  @Component({
    selector: 'tree-view',
    templateUrl: './tree-view.component.html',
    styleUrls: ['./tree-view.component.css'],
  })
  export class TreeViewComponent<T extends TreeView> implements OnInit {
    constructor() {}
  
    ngOnInit(): void {}
  
    @Input()
    public treeData: T[] = [];
  
    @ContentChild(TemplateRef)
    public nodeTemplate: TemplateRef<any> | null = null;
  
    public ngAfterContentInit(): void {
      if (!this.nodeTemplate) {
        throw new Error('This component needs ng-template for the tree node.');
      }
    }
  }
  