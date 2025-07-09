import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from './menu.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

interface MenuItem {
    _id: string;
    label: string;
    icon: string;
    roles: string[];
    children: ChildItem[];
}

interface ChildItem {
    label: string;
    route: string;
    roles: string[];
}

@Component({
    selector: 'app-menu-form',
    templateUrl: './menu-form.component.html',
    styleUrls: ['./menu-form.component.scss']
})
export class MenuFormComponent implements OnInit {
    form: FormGroup;
    menuId: string | null = null;
    allRoles: string[] = ['admin', 'superadmin', 'user'];
    isLoading: boolean = false;
    menus: MenuItem[] = [];

    constructor(
        private fb: FormBuilder,
        private menuService: MenuService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.form = this.fb.group({
            label: ['', Validators.required],
            icon: ['fa-solid fa-list'],
            roles: this.fb.array([], Validators.required),
            children: this.fb.array([]),
        });
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.menuId = params.get('id');
            if (this.menuId) {
                this.loadMenuData();
            } else {
                this.form.reset({ icon: 'fa-solid fa-list' });
                this.roles.clear();
                this.children.clear();
            }
        });

        this.loadAllMenus();
    }


    private loadAllMenus(): void {
        this.isLoading = true;
        this.menuService.getallmenu().subscribe((resp: any) => {
            this.menus = resp;
            this.isLoading = false;
        },
            (error) => {
                this.isLoading = false;
                console.error('Failed to load menus');
            }
        );
    }

    private loadMenuData(): void {
        this.isLoading = true;
        this.menuService.getMenuById(this.menuId!).subscribe({
            next: (menu: MenuItem) => {
                this.populateForm(menu);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
                console.error('Failed to load menu data');
            }
        });
    }

    private populateForm(menu: MenuItem): void {
        this.form.patchValue({
            label: menu.label,
            icon: menu.icon,
        });

        // Set roles
        this.roles.clear();
        menu.roles.forEach(role => {
            this.roles.push(new FormControl(role));
        });

        // Set children
        this.children.clear();
        menu.children.forEach(child => {
            this.addChild(child);
        });
    }

    get roles(): FormArray {
        return this.form.get('roles') as FormArray;
    }

    get children(): FormArray {
        return this.form.get('children') as FormArray;
    }

    addChild(child?: ChildItem): void {
        const group = this.fb.group({
            label: [child?.label || '', Validators.required],
            route: [child?.route || '', Validators.required],
            roles: this.fb.array(child?.roles?.map(role => new FormControl(role)) || [], Validators.required),
        });
        this.children.push(group);
    }

    removeChild(index: number): void {
        this.children.removeAt(index);
    }

    isRoleChecked(rolesArray: FormArray, role: string): boolean {
        return rolesArray.value.includes(role);
    }

    onRoleChange(event: MatCheckboxChange, rolesArray: FormArray): void {
        const role = event.source.value;
        const isChecked = event.checked;

        const existingIndex = rolesArray.controls.findIndex(ctrl => ctrl.value === role);

        if (isChecked && existingIndex === -1) {
            rolesArray.push(new FormControl(role));
        } else if (!isChecked && existingIndex !== -1) {
            rolesArray.removeAt(existingIndex);
        }
    }

    getRolesArray(group: AbstractControl): FormArray {
        return group.get('roles') as FormArray;
    }

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        const data = this.form.value;

        const operation = this.menuId
            ? this.menuService.updateMenu(this.menuId, data)
            : this.menuService.createMenu(data);

        operation.subscribe({
            next: () => {
                this.loadAllMenus();
                if (!this.menuId) {
                    this.form.reset({ icon: 'fa-solid fa-list' });
                    this.roles.clear();
                    this.children.clear();
                }
                this.isLoading = false;
                this.router.navigate(['/admin/menu/']);


            },
            error: () => {
                this.isLoading = false;
                console.error('Operation failed');
            }
        });
    }

deleteMenu(menuId: string): void {
  if (!confirm('Are you sure you want to delete this menu?')) return;

  this.isLoading = true;
  this.menuService.deleteMenu(menuId).subscribe({
    next: () => {
      this.loadAllMenus(); // Refresh the menu list after deletion
      this.isLoading = false;
      alert("Menu deleted");
    },
    error: (error) => {
      this.isLoading = false;
      console.error('Failed to delete menu:', error);
    }
  });
}


}