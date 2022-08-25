import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';
import { BusModel } from 'src/app/models/data/bus-model';

import { BusType } from 'src/app/models/data/enums';
import { UserService } from 'src/app/services/auth/user.service';
import { NotifyService } from 'src/app/services/common/notify.service';
import { BusService } from 'src/app/services/data/bus.service';



@Component({
  selector: 'app-bus-view',
  templateUrl: './bus-view.component.html',
  styleUrls: ['./bus-view.component.css']
})
export class BusViewComponent implements OnInit {
  busTypeOptions:{label:string,value:number}[]=[];
  //model
 buses:BusModel[] =[];
 //table
 dataSource:MatTableDataSource<BusModel> = new MatTableDataSource(this.buses);
 @ViewChild(MatSort, {static:false}) sort!:MatSort;
 @ViewChild(MatPaginator, {static:false}) paginator!:MatPaginator;
 columnList=['busPlateNumber', 'busType', 'busModel','capacity','features', 'actions'];
  constructor(
    private busServices:BusService,
    private userService:UserService,
    private notifyService:NotifyService,
    private matDialog: MatDialog
    ) { }
  getBusType(value:number){
    return BusType[value];
  }
  delete(item:BusModel){
   
      this.matDialog.open(ConfirmDialogComponent, {
        width: '400px'
      }).afterClosed()
        .subscribe({
          next: c => {
            if (c) {
              this.busServices.delete(Number(item.busId))
                .subscribe({
                  next: r => {
                    this.dataSource.data = this.dataSource.data.filter(x => x.busId != r.busId);
                    this.notifyService.success("Data deleted successfully", "DISMISS");
                  },
                  error: err => {
                    this.notifyService.fail("Failed to delete", "DISMISS");
                  }
                })
            }
          },
          error: err => {
            console.log('Let it go');
          }
        })
    
  }
  ngOnInit(): void {
    Object.keys(BusType).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    ).forEach((v: any, i) => {
      this.busTypeOptions.push({ label: v, value: Number(BusType[v]) });
    });
    if(this.userService.isAdmin){
      this.busServices.get()
      .subscribe({
        next:r=> {
          this.dataSource.data = r;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        },
        error: err=>{
  
        }
      });
    }
    else {
      this.busServices.getOfCompany(Number(this.userService.companyId))
      .subscribe({
        next:r=> {
          this.dataSource.data = r;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          console.log(r);
        },
        error: err=>{
  
        }
      });
    }
    
    
  }

}
