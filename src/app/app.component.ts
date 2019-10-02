import { Component, ChangeDetectorRef } from "@angular/core";
import { AppServiceService } from "./service/app-service.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "bank";
  bankData: any;
  selectedCity;
  gridApi;
  gridCoulumnApi;
  searchValue;
  pageSize;
  rowSelection;
  selectedArray = [];
  getArray;
  constructor(private appService: AppServiceService, private ref: ChangeDetectorRef) {
    setInterval(() => {
      this.ref.detectChanges()
    }, 1000);
    this.getArray = localStorage.getItem('ifsc');
    console.log(this.getArray);
    this.appService
      .getData()
      .toPromise()
      .then(data => {
        this.bankData = data;
        for(var i=0;i<this.bankData.length;i++){
          if(this.getArray != null && this.getArray.indexOf(this.bankData[i].ifsc) > -1){
            this.bankData[i].fav = true;
          }
          else{
            this.bankData[i].fav = false;
          }
        }
      })
      .catch(error => console.log("error", error));
    this.rowSelection = "multiple";
  }
  columnDefs = [
    { headerName: 'Favourites', field: 'fav'},
    { headerName: "IFSC", field: "ifsc", sortable: true, filter: true },
    { headerName: "Bank Id", field: "bank_id", sortable: true, filter: true },
    { headerName: "Branch", field: "branch", sortable: true, filter: true },
    { headerName: "Address", field: "address", sortable: true, filter: true },
    { headerName: "City", field: "city", sortable: true, filter: true },
    { headerName: "District", field: "district", sortable: true, filter: true },
    { headerName: "State", field: "state", sortable: true, filter: true },
    {
      headerName: "Bank Name",
      field: "bank_name",
      sortable: true,
      filter: true
    }
  ];


  cityChange(event) {
    this.selectedCity = event.target.value;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridCoulumnApi = params.columnApi;
  }

  quickSearch() {
    this.gridApi.setQuickFilter(this.searchValue);
  }

  pageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.pageSize));
  }

  onClick(event) {
    if(this.getArray != null){
      this.selectedArray  = this.getArray.split(',');
    }
    if (!this.selectedArray.includes(event.data.ifsc)) {
      this.selectedArray.push(event.data.ifsc);
    } else {
      const n = this.selectedArray.indexOf(event.data.ifsc);
      if (n > -1) {
        this.selectedArray.splice(n, 1);
      }
    }
    // const data = this.gridApi.getSelectedNodes();
    // data.setDataValue('fav', !data.data.fav);

    // data.data.fav = !data.data.fav;
    
    for(var i=0;i<this.bankData.length;i++){
      if(this.bankData[i].ifsc == event.data.ifsc){
        this.bankData[i].fav = !this.bankData[i].fav;
      }
    }
    this.gridApi.setRowData([]);
    this.gridApi.updateRowData({add: this.bankData});
    // console.log('a', this.bankData);
    // var abc = this.bankData;
    // this.bankData= [];
    // console.log('b', this.bankData);
    // this.bankData= abc;
    // console.log('c', this.bankData);

    localStorage.setItem("ifsc", JSON.stringify(this.selectedArray));
  }
}
