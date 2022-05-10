import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {StudentsApiService} from "../../services/students-api.service";
import {Student} from "../../models/student";
import {MatTableDataSource} from "@angular/material/table";
import {NgForm} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Router} from "@angular/router";
@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit, AfterViewInit {
  studentData: Student;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['id','name', 'age', 'address', 'actions'];
  isEditMode = false;
  isFiltering = false;
  @ViewChild('studentForm',{static: false}) studentForm!: NgForm;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private  studentsApi: StudentsApiService, private router: Router) {
    this.studentData = {} as Student;
  }

  ngOnInit(): void {
    this.getAllStudents();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void{
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
    this.isFiltering = !!filterValue;
  }

  getAllStudents(): void {
    this.studentsApi.getAllStudent().subscribe((response:any)=>{
      this.dataSource.data = response;
    });
  }

  editITem(element: any): void{
    console.log(element);
    this.studentData = _.cloneDeep(element);
    this.isEditMode=true;
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.studentForm.resetForm();
  }

  deleteItem(id: number): void{
    this.studentsApi.deleteStudent(id).subscribe((response: any)=>{
      this.dataSource.data = this.dataSource.data.filter((o:any)=>{
        return o.id !== id ? o : false;
      });
    });
    console.log(this.dataSource.data);
  }

  addStudent(): void {
    const newStudent = {name: this.studentData.name, age: this.studentData.age, address: this.studentData.address}
    this.studentsApi.addStudent(newStudent).subscribe((response:any)=>{
      this.dataSource.data.push({...response});
      this.dataSource.data = this.dataSource.data.map(o=>o);
    });
  }

  updateStudent(): void {
    this.studentsApi.updateStudent(this.studentData.id, this.studentData)
      .subscribe((response: Student) => {
        this.dataSource.data = this.dataSource.data.map((o: any) => {
          if (o.id === response.id) {
            o = response;
          }
          return o;
        });
        this.cancelEdit();
      });
  }
  onSubmit(): void {
    if(this.studentForm.form.valid){
      if(this.isEditMode){
        this.updateStudent();
      } else {
        this.addStudent();
      }
    }
    else{
      console.log('Invalid Data');
    }
  }

  navigateToAddStudent(): void {
    this.router.navigate(['/students/new'])
      .then(() => console.log('Navigated to New Student'));
  }
  navigateToEditStudent(studentId: number): void {
    this.router.navigate([`/students/${studentId}`])
      .then(() => console.log('Navigated to Edit Student'));
  }

  refresh(): void {
    console.log('about to reload');
    this.getAllStudents();
  }






}
