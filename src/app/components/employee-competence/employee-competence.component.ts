import {Component, OnInit} from '@angular/core';
import {Employee} from '../_model/employee';
import {Competence} from '../_model/competence';
import {EmployeeService} from '../_services/employee.service';
import {Toast, ToasterService} from 'angular2-toaster';
import {CompetencesService} from '../_services/competences.service';
import * as _ from 'lodash';
import {NgbModal, NgbModalRef, NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import {EmployeeCompetence} from '../_model/employee-competence';
import {PreferencesService} from '../_services/preferences.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../_services/auth.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";


@Component({
  selector: 'app-competence',
  templateUrl: './employee-competence.component.html',
  styleUrls: ['./employee-competence.component.scss'],
  providers: [
    EmployeeService,
    CompetencesService,
    ToasterService,
    NgbRatingConfig
  ]
})
export class EmployeeCompetenceComponent implements OnInit {
  rating: any;
  numberOfYears: number;
  competence: string;

  openItem:EmployeeCompetence = null;
  openItemSource:EmployeeCompetence = null;
  openItemIsNew(){
    return this.openItemSource==null;
  }
  groups = [];
  competences: Competence[] = [];
  
 
  addGroup(){
    console.log("Add group");
    this.groups.push({
        id: 4,
        title: "Group 4",
        items: [
          {
            name: "Item 1 - Group 1"
          },
          {
            name: "Item 2 - Group 1"
          },
          {
            name: "Item 3 - Group 1"
          }
        ]
      });
  }

  showDropDown = false;

  q: any
  search($event){
    this.q= $event.target.value
    
  }

  // selectValue(value) {
  //   this.q.patchValue({"search": value});
  //   this.showDropDown = false;
  // }
   closeDropDown() {
     this.showDropDown = !this.showDropDown;
   }
 
   openDropDown() {
     this.showDropDown = false;
   }
 
  //  getSearchValue() {
  //    return this.q.value.search;
  //  }

  addCompetenceInGroup(groupId){
    console.log("Add competence groupId="+groupId);
    this.groups.forEach(gr => {
      if(gr.id==groupId){
        gr.items.push({
          name: "NEW ITEM"
        });
      }

    });
  }
  
  dropItem(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  getConnectedList(): any[] {
    return this.groups.map(x => `${x.id}`);
  }

  dropGroup(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.groups, event.previousIndex, event.currentIndex);
  }

  loadGroups(eCompetences: EmployeeCompetence[]){
    let groups=[];
    let groupsMap = {};
    if(!eCompetences) return;
    eCompetences.forEach(function(item){
      console.log(item);
      let grID = item.group;
      // Search the group
      let group = groupsMap[grID];
      if(!group){
        // Add new group
        group = {
          id:grID,
          title:"Group #"+grID,
          items:[]
        };
        groupsMap[grID] = group;
        groups.push(group);
      }
      // Append the competence to the group
      group.items.push(item);
    });
    // Update the global list
    this.groups = groups;
  }

  onEditItem(item, content){
    console.log("OnEditItem "+item.id);
    this.openItemSource = item;
    this.openItem = new EmployeeCompetence(item);
    this.modal = this.modalService.open(content);
  }
  onNewItem(grID, content){
    console.log("OnNewItem grID="+grID);
    this.openItemSource = null;
    this.openItem = new EmployeeCompetence(null);
    this.modal = this.modalService.open(content);
  }

  saveCompetence() {
    // VALIDATE
    if (this.openItem.numberOfYears < 1) {
      const toast: Toast = {
        type: 'error',
        body: 'Impossible to add a competence with 0 years',
        showCloseButton: true
      };
      this.toasterService.pop(toast);
      return;
    }

    // Update source
    this.modal.close();
    if(this.openItemSource!=null){
      //console.log(this.openItemSource.getName());
      //this.openItemSource.copyData(this.openItem);
      this.openItemSource.rating = this.openItem.rating;
      this.openItemSource.numberOfYears = this.openItem.numberOfYears;
      //this.openItemSource.competence = new Competence(this.openItem.competence);
      console.log(this.openItem.competence);//TODO - OLD VALUE
      // this.openItemSource.competence = this.competence;

      //this.groups[0].items[0] = this.openItem;
      // Create a new log
      // const newCompetence = {
        
      //   rating: this.rating,
      //   numberOfYears: this.numberOfYears,
      //   competence: this.competence
      // };
      // // Add log
      // this.groups.push(newCompetence)

    }

/*
    // SEND REQUEST
    this.employeeService.addCompetence(this.employee.id, this.newCompetence).subscribe(
      data => {
        const toast: Toast = {
          type: 'success',
          body: 'Competence successfully added.',
          showCloseButton: true
        };

        const savedCompetence = new EmployeeCompetence(data);

        this.employee.competences.push(savedCompetence);
        this.extractRowData();
        this.rows = [...this.rows];
        this.toasterService.pop(toast);

        this.newCompetence = this.initialCompetence();
        this.modal.close();
      },
      error => {
        if (error.status === 401) {
          this.authService.logoutAndRedirect(this.router);
        }

        let errorMessage = 'Failed to add competence to employee.';
        if (error.error.message) {
          errorMessage = error.error.message;
        }

        const toast: Toast = {
          type: 'error',
          body: errorMessage,
          showCloseButton: true
        };

        this.toasterService.pop(toast);
      }
    );
*/
  }





















  employee: Employee = new Employee({});

  allCompetences: Competence[] = [];
  editing = {};

  rows = [];

  headerNames = new Map([
    ['en', {
      'competence': 'Competence',
      'years': 'Years',
      'rating': 'Rating'
    }],
    ['sv', {
      'competence': 'Kompetens',
      'years': 'År',
      'rating': 'Betyg'
    }]
  ]);

  modal: NgbModalRef;
  newCompetence: EmployeeCompetence = this.initialCompetence();

  constructor(private route: ActivatedRoute, private router: Router,
              private employeeService: EmployeeService, private competencesService: CompetencesService,
              private toasterService: ToasterService, config: NgbRatingConfig, private modalService: NgbModal,
              private preferencesService: PreferencesService, private authService: AuthService) {
    config.max = 5;

    this.loadAllCompetences();
  }





  
  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['employeeId']) {
        this.employeeService.loadEmployee(params['employeeId'])
          .subscribe(
            employee => {
              this.employee = new Employee(employee);
              this.extractRowData();
              this.loadGroups(employee.competences);
            },
            error => {
              if (error.status === 401) {
                this.authService.logoutAndRedirect(this.router);
              }
            }
          );
      }
    });
  }

  private extractRowData() {
    const newRows = [];
    _.forEach(this.employee.competences, function (ec) {
      newRows.push({
        id: ec.id,
        competence: ec.competence.name,
        years: ec.numberOfYears,
        rating: ec.rating
      });
    });
    this.rows = newRows;
  }

  // Load all competences list
  private loadAllCompetences() {
    this.competencesService.loadCompetences()
      .subscribe(
        competences => {
          this.allCompetences = competences;
        },
        error => {
          if (error.status === 401) {
            this.authService.logoutAndRedirect(this.router);
          }

          console.log('Failed to load competences.');
        }
      )
  }

  private initialCompetence() {
    return new EmployeeCompetence({id: -1, competence: {}, numberOfYears: 1, rating: 3});
  }

  open(event, content) {
    event.preventDefault();
    this.modal = this.modalService.open(content);
  }

  getHeaderName(header: string) {
    return this.headerNames.get(this.preferencesService.language)[header];
  }

  addCompetence() {

    if (this.newCompetence.numberOfYears < 1) {
      const toast: Toast = {
        type: 'error',
        body: 'Impossible to add a competence with 0 years',
        showCloseButton: true
      };

      this.toasterService.pop(toast);

      return;
    }

    this.employeeService.addCompetence(this.employee.id, this.newCompetence).subscribe(
      data => {
        const toast: Toast = {
          type: 'success',
          body: 'Competence successfully added.',
          showCloseButton: true
        };

        const savedCompetence = new EmployeeCompetence(data);

        this.employee.competences.push(savedCompetence);
        this.extractRowData();
        this.rows = [...this.rows];
        this.toasterService.pop(toast);

        this.newCompetence = this.initialCompetence();
        this.modal.close();
      },
      error => {
        if (error.status === 401) {
          this.authService.logoutAndRedirect(this.router);
        }

        let errorMessage = 'Failed to add competence to employee.';
        if (error.error.message) {
          errorMessage = error.error.message;
        }

        const toast: Toast = {
          type: 'error',
          body: errorMessage,
          showCloseButton: true
        };

        this.toasterService.pop(toast);
      }
    );

  }

  updateYears($event, rowIndex, id: string) {
    const competence = this.employee.competences.find(x => x.id === id);
    const numberOfYears = Number($event.currentTarget.value);

    if (numberOfYears < 1) {
      const toast: Toast = {
        type: 'error',
        body: 'Impossible to add a competence with 0 years',
        showCloseButton: true
      };

      this.toasterService.pop(toast);

      return;
    }

    if (competence.numberOfYears !== numberOfYears) {
      competence.numberOfYears = numberOfYears;

      this.employeeService.updateCompetence(this.employee.id, competence).subscribe(
        data => {
          const toast: Toast = {
            type: 'success',
            body: 'Number of Years updated successfully.',
            showCloseButton: true
          };

          _.forEach(this.rows, function (r) {
            if (r.id === id) {
              r.years = competence.numberOfYears;
            }
          });

          this.rows = [...this.rows];
          this.toasterService.pop(toast);
        },
        error => {
          if (error.status === 401) {
            this.authService.logoutAndRedirect(this.router);
          }

          const toast: Toast = {
            type: 'error',
            body: 'Failed to update number of years.',
            showCloseButton: true
          };

          this.toasterService.pop(toast);
        }
      );
    }

    this.editing[rowIndex + '-years'] = false;
  }

  updateRating(newRating, id) {
    const competence = this.employee.competences.find(x => x.id === id);
    newRating = Number(newRating);

    if (competence.rating !== newRating) {
      competence.rating = newRating;

      this.employeeService.updateCompetence(this.employee.id, competence).subscribe(
        data => {
          const toast: Toast = {
            type: 'success',
            body: 'Rating updated successfully.',
            showCloseButton: true
          };

          this.toasterService.pop(toast);
        },
        error => {
          if (error.status === 401) {
            this.authService.logoutAndRedirect(this.router);
          }

          const toast: Toast = {
            type: 'error',
            body: 'Failed to update rating.',
            showCloseButton: true
          };

          this.toasterService.pop(toast);
        }
      );
    }
  }

  delete(event, employeeCompetenceId: number) {
    this.employeeService.removeEmployeeCompetence(employeeCompetenceId)
      .subscribe(
        data => {
          this.employee.removeCompetence(employeeCompetenceId);
          this.extractRowData();
          this.rows = [...this.rows];
        },
        error => {
          if (error.status === 401) {
            this.authService.logoutAndRedirect(this.router);
          }

          const toast: Toast = {
            type: 'error',
            body: (error.error && error.error.message) ? error.error.message : 'Failed to delete competence.',
            showCloseButton: true
          };

          this.toasterService.pop(toast);
        }
      )
  }
}
