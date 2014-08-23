var dayReconData
//<![CDATA[
Ext.onReady(function () {
    
    loadStore();
}
    );

var movementHeaderID = 0;

		function checkMovementHeaderCountSuccessTest(a, e) {
   		 Ext.MessageBox.wait('loading...');
		    document.getElementById('daycontent').style.display = ""
			    App.reportsPanel.hide();
				    App.lblCash.setText(null);
				    App.txtNotes.setValue(null);
					    App.lblBeginTime.setText(null);
    App.lblEndTime.setText(null); 
    App.lblBatchNo.setText(null);
    document.getElementById('timeDiv').style.display = 'none';
    document.getElementById('manualShiftEntry').style.display = 'none';
    //$(timeDiv).hide();
   
			    if (e.total == 1) {
				App.btnAddMop.setDisabled(false);
				App.btnVendorPayout.setDisabled(false);
				App.btnAddPayIn.setDisabled(false);
				App.btnSplit.setDisabled(false);
				App.windowMovementHeaderDetail.show();
				Ext.MessageBox.hide();
				isNewDayRecon = true;
				App.btnShowMovementHeaderDetailWindow.fireEvent('click');
			    }
        // if record is equal to one 
				    else if (e.total == 2) {
				       // $(timeDiv).show();
					document.getElementById('timeDiv').style.display = 'block';
					App.lblBeginTime.setText(e.data.OpeningTime);
					App.lblEndTime.setText(e.data.ClosingTime);
					App.lblMovementHeaderID.setText(e.data.MovementHeaderID);
					App.lblBatchNo.setText(e.data.SecondaryReportPeriod);
					movementHeaderID = e.data.MovementHeaderID;
					App.btnAddMop.setDisabled(false);
					App.btnVendorPayout.setDisabled(false);
					App.btnAddPayIn.setDisabled(false);
					App.btnSplit.setDisabled(false);
					//refreshDayReconDataSet();
					isAmountRefresh = false;  //to set the variable to refresh every times
					loadAllStoreData();
				    }
					// if record not found
				    else if (e.total == 0) {
					App.lblMovementHeaderID.setText(' ');
					Ext.MessageBox.hide();
					mopTotalAmount = 0;
					App.lblMopTotalAmount.setText('$' + mopTotalAmount.toFixed(2));
					App.lblMopSalesTotalAmount.setText('$' + mopTotalAmount.toFixed(2));

					gasGradeTotalAmount = 0;
					App.lblGasGradeTotalAmount.setText('$' + gasGradeTotalAmount.toFixed(2));

					gasGradeVolume = 0;
					App.lblGasGradeVolume.setText(gasGradeVolume.toFixed(2));

					totalSalesAmount = 0;
					App.lblTotSalesAmount.setText('$' + totalSalesAmount.toFixed(2));
					//App.lblGrandSales.setText('$' + totalSalesAmount.toFixed(2));
					App.lblTotalSales.setText('$' + totalSalesAmount.toFixed(2));

					shortOver = 0;
					App.lblShortOverGreen.setText('$' + shortOver.toFixed(2));
					App.lblShortOverRed.setText('$' + shortOver.toFixed(2));

					totalReceipts = 0;
					App.lblTotalReceiptsRed.setText('$' + totalReceipts.toFixed(2));
					App.lblTotalReceiptsGreen.setText('$' + totalReceipts.toFixed(2));

					mopTotalReconAmount = 0;
					App.lblDayReconTotalAmount.setText('$' + mopTotalReconAmount.toFixed(2));

					totalExpenses = 0;
					App.lblTotalExpenses.setText('$' + totalExpenses.toFixed(2));

        //   App.dsGasGradeData.reload();
        //loadAllStoreData();
        jsonData = null;

        App.dsDepTypeSales.loadRawData(jsonData);
        App.dsGasGradeData.loadRawData(jsonData);
        App.dsSalesDescription.loadRawData(jsonData);
        App.dsMOPDetails.loadRawData(jsonData);
        App.dsBusinessDayReconExpense.loadRawData(jsonData);
        App.dsBusinessDayReconIncome.loadRawData(jsonData);
        App.dsPosVendorPayoutAmount.loadRawData(jsonData);
        App.dsCashCheck.loadRawData(jsonData);
        App.dsPayIn.loadRawData(jsonData);
        App.dsVendorPaymentRecon.loadRawData(jsonData);
        App.dsRepPayInPayOut.loadRawData(jsonData);
        App.dsBusinessDayNote.loadRawData(jsonData);
        document.getElementById('divcriticalstats').innerHTML = null;
        movementHeaderDataFailure();
    }

    App.lblReprocessGreenMsg.hide();
    App.lblReprocessRedMsg.hide();

}

loadAllBusinessDayNoteData = function () {
    $.ajax(
   {
       url: "/DailyReconWeb/DailyReconData?storeLocationID=" + App.cmbStoreLocations.getValue() + "&businessDate="
                    + App.dpBusinessDate.getRawValue() + "&movementHeaderID=" + App.lblMovementHeaderID.getText() +
                    "&shiftwiseValue=0 &isPayoutRelatedRefresh=" + isAmountRefresh + "&isPayoutandCashRefresh=" + isPayoutandCashRefresh,
       cache: false,
       success: function (jsonData) {
           App.dsBusinessDayNote.loadRawData(jsonData);
       }
   });
}

loadInvoiceImportStoreData = function () {
    var startDate = App.dpBusinessDate.getRawValue();
    var endDate = App.dpBusinessDate.getRawValue();

    if (App.dpStartInvImportDate && App.dpStartInvImportDate.getRawValue() != "") {
        startDate = App.dpStartInvImportDate.getRawValue();
    }
    else {
        App.dpStartInvImportDate.setRawValue(startDate);
    }

    if (App.dpEndInvImportDate && App.dpEndInvImportDate.getRawValue() != "") {
        endDate = App.dpEndInvImportDate.getRawValue();
    } else {
        App.dpEndInvImportDate.setRawValue(endDate);
    }



    $.ajax(
   {
       url: "/DailyReconWeb/InvoiceImportData?movementHeaderID=" + App.lblMovementHeaderID.getText() +
                                             "&storeLocationID=" + App.cmbStoreLocations.getValue() +
                                             "&startDate=" + startDate + "&endDate=" + endDate +
                                             "&vendorID=" + App.cmbVendorinInvImport.getValue(),
       cache: false,
       success: function (jsonData) {
           App.dsInvoiceImport.loadRawData(jsonData);         
       }
   });
};


loadAllStoreData = function () {
    $.ajax(
   {
       url: "/DailyReconWeb/DailyReconData?storeLocationID=" + App.cmbStoreLocations.getValue() + "&businessDate=" + App.dpBusinessDate.getRawValue() + "&movementHeaderID=" + App.lblMovementHeaderID.getText() + "&shiftwiseValue="+getShiftWiseValue()+"&isPayoutRelatedRefresh=" + isAmountRefresh + "&isPayoutandCashRefresh=" + isPayoutandCashRefresh,
       cache: false,
       success: function (jsonData) {
           if (isAmountRefresh == false) {
               $.get('/DailyReconWeb/CriticalStatDetail/?movementHeaderID=' + App.lblMovementHeaderID.getText() + '&shiftWiseValue=' + getShiftWiseValue(), null, function (data) {
                   document.getElementById('divcriticalstats').innerHTML = data;
               });
           }

           if (isPayoutandCashRefresh == true) {
               App.dsPayIn.loadRawData(jsonData);
               App.dsVendorPaymentRecon.loadRawData(jsonData);
           }
           App.dsRepPayInPayOut.loadRawData(jsonData);
           App.dsPosVendorPayoutAmount.loadRawData(jsonData);
           App.dsCashCheck.loadRawData(jsonData);

           if (isAmountRefresh == false && isPayoutandCashRefresh == false) {
               App.dsDepTypeSales.loadRawData(jsonData);
               App.dsGasGradeData.loadRawData(jsonData);
               App.dsSalesDescription.loadRawData(jsonData);
               App.dsMOPDetails.loadRawData(jsonData);
               App.dsBusinessDayReconExpense.loadRawData(jsonData);
               App.dsBusinessDayReconIncome.loadRawData(jsonData);
               App.dsPayIn.loadRawData(jsonData);
               App.dsVendorPaymentRecon.loadRawData(jsonData);
               App.dsBusinessDayNote.loadRawData(jsonData);
           }
         
           isAmountRefresh = false;
           isPayoutandCashRefresh = false;
           Ext.MessageBox.hide();
       }
   });  
};


loadStore = function () {
    Ext.net.DirectEvent.showFailure = Ext.emptyFn;
    window.App.dsStores = Ext.create("Ext.data.Store", {
        "model": Ext.define(Ext.id(), {
            extend: "Ext.data.Model",
            "fields": [{
                "name": "StoreLocationID",
                "sortDir": "ASC"
            }, {
                "name": "StoreName"
            }, {
                "name": "POSSystemCD"
            }
            ]
        }),
        "storeId": "dsStores",
        "useIdConfirmation": true,
        "autoLoad": true,
        "proxy": {
            "type": "ajax",
            "reader": {
                "type": "json",
                "idProperty": "StoreLocationID",
                "root": "data",
                "totalProperty": "total"
            },
            "url": "/StoreLocationData/GetStoreLocationColumnForUser"
        },
        "listeners": {
            "load": {
                "fn": getStoreLoad
            }
        }
    });

    Ext.create("Ext.form.field.ComboBox", {
        "id": "cmbStoreLocations",
        "dataIndex": "StoreLocationID",
        "renderTo": "App.cmbStoreLocations_Container",
        "width": 200,
        "fieldLabel": "Store Location",
        "labelSeparator": " ",
        "displayField": "StoreName",
        "queryMode": "local",
        "typeAhead": true,
        "valueField": "StoreLocationID",
        "store": "dsStores",
        "listeners": {
            "select": {
                "fn": changeStore
            }
        }
    });
    window.App.dsHouseAccounts = Ext.create("Ext.data.Store", {
        "model": Ext.define(Ext.id(), {
            extend: "Ext.data.Model",
            "fields": [{
                "name": "HouseAccountID",
                "sortDir": "ASC"
            }, {
                "name": "AccountName"
            }
            ]
        }),
        "storeId": "dsHouseAccounts",
        "useIdConfirmation": true,
        "autoLoad": false,
        "proxy": {
            "type": "ajax",
            "reader": {
                "type": "json",
                "idProperty": "HouseAccountID",
                "root": "data",
                "totalProperty": "total"
            },
            "url": "/VendorData/GetHouseAccounts"
        }
    });
    Ext.create("Ext.net.Label", {
        "id": "lblReprocessGreenMsg",
        "cls": "labelColorGreen",
        "hidden": true,
        "renderTo": "App.lblReprocessGreenMsg_Container",
        "text": "Reprocess Successful"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblReprocessRedMsg",
        "cls": "labelColorRed",
        "hidden": true,
        "renderTo": "App.lblReprocessRedMsg_Container",
        "text": "Reprocess In Error"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblTotalSalesAmount",
        "hidden": true,
        "renderTo": "App.lblTotalSalesAmount_Container"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblMovementHeaderID",
        "hidden": true,
        "renderTo": "App.lblMovementHeaderID_Container"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblLocText",
        "fieldLabel": "Store Location",
        "hidden": true,
        "renderTo": "App.lblLocText_Container"
    });

    Ext.create("Ext.form.field.Display", {
        "id": "txtFirstStoreName",
        "hidden": true,
        "renderTo": "App.txtFirstStoreName_Container",
        "width": 250,
        "labelSeparator": ""
    });
    Ext.create("Ext.net.Label", {
        "id": "lblBusinessDate",
        "hidden": true,
        "renderTo": "App.lblBusinessDate_Container",
        "text": "Select Day to Recon"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblBusDateText",
        "cls": "formPanelBold",
        "hidden": true,
        "renderTo": "App.lblBusDateText_Container"
    });
    Ext.create("Ext.form.field.Date", {
        "id": "dpBusinessDate",
        "renderTo": "App.dpBusinessDate_Container",
        "width": 220,
        "fieldLabel": "Select Day to Recon",
        "labelSeparator": " ",
        "labelWidth": 120,
        "format": "m-j-Y",
        "submitFormat": "n/j/Y"
    });
    Ext.create("Ext.button.Button", {
        "id": "btnSearchRecon",
        "renderTo": "App.btnSearchRecon_Container",
        "width": 80,
        "text": "Search",
        "listeners": {
            "click": {
                "fn": SetVariableSaveBusinessPrice
            }
        },
        "directEvents": {
            "click": {
                fn: function (item, e) {
                    Ext.net.directRequest({
                        "cleanRequest": true,
                        "url": "/DailyReconData/MovementHeaderCount",
                        "extraParams": {
                            "businessDate": App.dpBusinessDate.getRawValue(),
                            "storeLocationID": App.cmbStoreLocations.getValue(),
                            "shiftwiseValue": getShiftWiseValue()
                        },
                        "userSuccess": checkMovementHeaderCountSuccessTest,      // checkMovementHeaderCountSuccess,
                        control: this
                    });
                }
            }
        }
    });
    Ext.create("Ext.button.Button", {
        "id": "btnShowMovementHeaderDetailWindow",
        "hidden": true,
        "renderTo": "App.btnShowMovementHeaderDetailWindow_Container",
        "iconCls": "#Disk",
        "text": "Do This",
        "directEvents": {
            "click": {
                fn: function (item, e) {
                    Ext.net.directRequest({
                        "cleanRequest": true,
                        "url": "/DailyReconWeb/MovementHeaderDetail",
                        "extraParams": {
                            "containerId": "App.windowMovementHeaderDetail"
                        },
                        "eventMask": {
                            "showMask": true,
                            "target": "customtarget",
                            "customTarget": "App.windowMovementHeaderDetail"
                        },
                        "before": function (el, type, action, extraParams, o) {
                            App.windowMovementHeaderDetail.update();
                            App.windowMovementHeaderDetail.removeAll(true)
                        },
                        control: this
                    });
                }
            }
        }
    });
    Ext.create("Ext.button.Button", {
        "id": "btnReprocessDayRecon",
        "renderTo": "App.btnReprocessDayRecon_Container",
        "text": "Reprocess",
        "listeners": {
            "click": {
                "fn": checkStoreLocationNDate
            }
        },
        "directEvents": {
            "click": {
                fn: function (item, e) {
                    Ext.net.directRequest({
                        "cleanRequest": true,
                        "url": "/DailyReconData/ReprocessDayRecon",
                        "timeout": 300000,
                        "extraParams": {
                            "storelocationID": App.cmbStoreLocations.getValue(),
                            "businessDate": App.dpBusinessDate.getRawValue()
                        },
                        "userSuccess": reprocessDayReconSuccess,
                        control: this
                    });
                }
            }
        }
    });
    Ext.create("Ext.button.Button", {
        "id": "btnDayReport",
        "style": "font-size:11pt;color:Green;padding-left:12px",
        "hidden": true,
        "renderTo": "App.btnDayReport_Container",
        "text": "Daily Recon Report",
        "directEvents": {
            "click": {
                fn: function (item, e) {
                    Ext.net.directRequest({
                        "cleanRequest": true,
                        "url": "/DailyReconData/MovementHeaderCount",
                        "extraParams": {
                            "businessDate": App.dpBusinessDate.getRawValue(),
                            "storeLocationID": App.cmbStoreLocations.getValue(),
                            "shiftwiseValue": getShiftWiseValue()
                        },
                        "userSuccess": checkMovementHeaderCountSuccessOnReportProcess,
                        control: this
                    });
                }
            }
        }
    });
    Ext.create("Ext.button.Button", {
        "id": "btnPrint",
        "renderTo": "App.btnPrint_Container",
        "width": 80,
        "text": "Print Report",
        "directEvents": {
            "click": {
                fn: function (item, e) {
                    Ext.net.directRequest({
                        "cleanRequest": true,
                        "url": "/DailyReconWeb/DayReconReport",
                        "extraParams": {
                            "containerId": "App.reportsPanel"
                        },
                        "eventMask": {
                            "showMask": true,
                            "target": "customtarget",
                            "customTarget": "App.reportsPanel"
                        },
                        "before": function (el, type, action, extraParams, o) {
                            App.reportsPanel.update();
                            App.reportsPanel.removeAll(true)
                        },
                        "userSuccess": dayReconPanelShow,
                        control: this
                    });
                }
            }
        }
    });


    Ext.create("Ext.form.field.ComboBox", {
        "id": "cmbShiftOption",
        "renderTo": "App.cmbShiftOption_Container",
        "width": 220,
        "fieldLabel": "Select Shift Level",
        "labelSeparator": " ",
        "labelWidth": 110,
        "editable": false,
        "selectedItems": [{
            "text": "Day Close",
            "value": "0"
        }],
        "queryMode": "local",
        "store": [
            ["0", "Day Close"],
            ["1", "Shift 1"],
            ["2", "Shift 2"],
            ["3", "Shift 3"]
        ],
        "listeners": {
            "select": {
                "fn": getShiftWiseValue
            }
        }
    });


    window.App.dsGasGradeData = Ext.create("Ext.data.PagingStore", {
        "model": Ext.define(Ext.id(), {
            extend: "Ext.data.Model",
            "fields": [{
                "name": "FuelGradeID",
                "type": "int"
            }, {
                "name": "GasGradeName",
                "type": "string"
            }, {
                "name": "FuelGradeSalesAmount",
                "type": "float"
            }, {
                "name": "FuelGradeSalesVolume",
                "type": "float"
            }, {
                "name": "StoreName",
                "type": "string"
            }, {
                "name": "BusinessDate",
                "type": "date",
                "dateFormat": "Y-m-d\\TH:i:s"
            }, {
                "name": "AverageCostPerGallon",
                "type": "float"
            }
            ]
        }),

        "storeId": "dsGasGradeData",
        "data": dayReconData,
        "proxy": {
            "type": "memory",
            "reader": {
                "type": "json",
                "root": "GasGradeDataObjects",
                "totalProperty": "total"
            }
        },
        "listeners": {
            "load": {
                "fn": function (data)
                {
                    calculateGradeTotal();                 
                }
            }
        }
    });
    Ext.create("Ext.grid.Panel", {
        "id": "grdGasGradeData",
        "border": false,
        "cls": "x-grid-custom",
        "renderTo": "App.grdGasGradeData_Container",
        "width": 460,
        "bodyStyle": "padding:0 0 0 0;",
        "header": false,
        "columns": {
            "id": "ColumnModel3",
            "items": [{
                "id": "GasGradeName",
                "header": "Gas<br/> Grade",
                "width": 140,
                "dataIndex": "GasGradeName",
                "hideable": false,
                "sortable": true
            }, {
                "id": "AverageCostPerGallon",
                "header": "Average Sales<br/> Price<br/>  Per Gallon",
                "width": 90,
                "dataIndex": "AverageCostPerGallon",
                "hideable": false,
                "renderer": Ext.util.Format.usMoney,
                //"xtype": "numbercolumn",
                "align": "left",
                "sortable": true
            },{
                "id": "FuelGradeSalesVolume",
                "header": "Gas Volume",
                "width": 110,
                "xtype": "numbercolumn",
                "align": "right",
                "dataIndex": "FuelGradeSalesVolume",
                "hideable": false,
                "renderer": getFuelGradeSalesVolume,
                "sortable": true
            }, {
                "id": "FuelGradeSalesAmount",
                "header": "Gas Amount",
                "width": 110,
                "align": "right",
                "dataIndex": "FuelGradeSalesAmount",
                "hideable": false,
                "renderer": Ext.util.Format.usMoney,
                "sortable": true
            }            
            ]
        },
        "enableColumnMove": false,
        "enableColumnResize": false,
        "selModel": window.App.rowGasSelectionModel2 = Ext.create("Ext.selection.RowModel", {
            "proxyId": "rowGasSelectionModel2",
            "selType": "rowmodel"
        }),
        "store": "dsGasGradeData"
    });
    window.App.dsDepTypeSales = Ext.create("Ext.data.Store", {
        "model": Ext.define(Ext.id(), {
            extend: "Ext.data.Model",
            "fields": [{
                "name": "RowID",
                "type": "int"
            }, {
                "name": "DepartmentTypeID",
                "sortDir": "ASC"
            }, {
                "name": "DepartmentTypeName",
                "type": "string"
            }, {
                "name": "DepartmentDescription",
                "type": "string"
            }, {
                "name": "TotalAmount",
                "type": "float"
            }, {
                "name": "TotalQty",
                "type": "float"
            }, {
                "name": "UPCSalesAmount",
                "type": "float"
            }, {
                "name": "UPCSalesQty",
                "type": "int"
            }, {
                "name": "OpenAmount",
                "type": "float"
            }, {
                "name": "OpenCount",
                "type": "int"
            }
            ]
        }),
        "storeId": "dsDepTypeSales",      
        "data": dayReconData,
        "proxy": {
            "type": "memory",
            "reader": {
                "type": "json",
                "idProperty": "RowID",
                "root": "spRepDeptSalesDataes",
                "totalProperty": "total"
            }         
        },
        "groupField": "DepartmentTypeName",
        "listeners": {
            "load": {
                "fn": function (data, e) {
                    calculatedepTypeSalesTotal();
                }
            }
        }
    });
    Ext.create("Ext.grid.Panel", {
        "id": "grdDepTypeSales",
        "border": false,
        "cls": "x-grid-custom",
        "renderTo": "App.grdDepTypeSales_Container",
        "width": 460,
        "bodyStyle": "padding:0 0 60px 0;",
        "header": false,
        "columns": {
            "id": "grddepTypeColumnModel10",
            "items": [{
                "id": "dsDepartmentTypeName1",
                "header": "Type of Sale",
                "hidden": true,
                "dataIndex": "RowID",
                "hideable": false,
                "sortable": true
            }, {
                "id": "dsDepartmentTypeName2",
                "header": "Type of Sale",
                "hidden": true,
                "dataIndex": "DepartmentTypeName",
                "hideable": false,
                "sortable": true
            }, {
                "id": "DepartmentDescription",
                "header": "Department",
                "width": 145,
                "dataIndex": "DepartmentDescription",
                "hideable": false,
                "sortable": true,
                "summaryRenderer": function (value, metadata, record, rowIndex, colIndex, store, view) {
                    return 'Total'
                }
            }, {
                "id": "OpenCount",
                "header": "No. of<br/>Non<br/>UPC<br/>Sales",
                "width": 36,
                "align": "right",
                "dataIndex": "OpenCount",
                "hideable": false,
                "sortable": true
            }, {
                "id": "OpenAmount",
                "header": "Non UPC<br/>Sales<br/>Amount",
                "width": 73,
                "flex": 1,
                "align": "right",
                "dataIndex": "OpenAmount",
                "hideable": false,
                "renderer": Ext.util.Format.usMoney,
                "sortable": true
            }, {
                "id": "UPCSalesQty",
                "header": "No. of<br/>UPC<br/>Sales",
                "width": 40,
                "align": "right",
                "dataIndex": "UPCSalesQty",
                "hideable": false,
                "sortable": true
            }, {
                "id": "UPCSalesAmount",
                "header": "UPC<br/>Sales<br/>Amount",
                "width": 73,
                "flex": 1,
                "align": "right",
                "dataIndex": "UPCSalesAmount",
                "hideable": false,
                "renderer": Ext.util.Format.usMoney,
                "sortable": true
            }, {
                "id": "TotalAmount",
                "header": "Total<br/>Sales<br/>Amount",
                "width": 73,
                "flex": 1,
                "align": "right",
                "dataIndex": "TotalAmount",
                "hideable": false,
                "renderer": Ext.util.Format.usMoney,
                "sortable": true,
                "summaryType": "sum",
                "summaryRenderer": Ext.util.Format.usMoney
            }, {
                "id": "detaillink",
                "width": 25,
                "align": "center",
                "hideable": false,
                "renderer": detailISMDetailRenderer,
                "sortable": true
            }
            ]
        },
        "enableColumnMove": false,
        "enableColumnResize": false,
        "selModel": window.App.rowSelectionModel = Ext.create("Ext.selection.RowModel", {
            "proxyId": "rowSelectionModel",
            "selType": "rowmodel"
        }),
        "store": "dsDepTypeSales",
        "viewConfig": {
            "id": "GroupingView1",
            "xtype": "gridview",
            "markDirty": false
        },
        "features": [window.App.GroupingSummary1 = Ext.create("Ext.grid.feature.GroupingSummary", {
            "proxyId": "GroupingSummary1",
            "ftype": "groupingsummary",
            "enableGroupingMenu": false,
            "hideGroupedHeader": true
        })]
    });




    window.App.dsSalesDescription = Ext.create("Ext.data.Store", {
        "model": Ext.define(Ext.id(), {
            extend: "Ext.data.Model",
            "fields": [{
                "name": "DepartmentTypeID",
                "sortDir": "ASC"
            }, {
                "name": "DepartmentTypeName",
                "type": "string"
            }, {
                "name": "TotalAmount",
                "type": "float"
            }
            ]
        }),
        "storeId": "dsSalesDescription",
        "data": dayReconData,      
        "proxy": {
            "type": "memory",
            "reader": {
                "type": "json",
                "root": "vwDepartmentTypeSales",
                "totalProperty": "total"
            }
        },
        "listeners": {
            "load": {
                "fn": function (data) {
                    calculatedepSalesTotal();                    
                }
            }
        }
    });

    Ext.create("Ext.grid.Panel", {
        "id": "grdDepartmentTypeSales",
        "border": false,
        "cls": "x-grid-custom",
        "renderTo": "App.grdDepartmentTypeSales_Container",
        "width": 218,
        "bodyStyle": "padding:0 0 0 0;",
        "header": false,
        "columns": {
            "id": "grdDepTypsSalesColumnModel5",
            "items": [{
                "id": "salesDescription",
                "header": "Sales<br/> Description",
                "width": 130,
                "dataIndex": "DepartmentTypeName",
                "hideable": false,
                "sortable": true,
                "wrap": true
            }, {
                "id": "depAmount",
                "header": "Amount",
                "width": 80,
                "xtype": "numbercolumn",
                "align": "right",
                "dataIndex": "TotalAmount",
                "hideable": false,
                "renderer": getTwoDecimalWithDoller,
                "sortable": true
            }
            ]
        },
        "enableColumnMove": false,
        "enableColumnResize": false,
        "selModel": window.App.depSalesTypemodel = Ext.create("Ext.selection.RowModel", {
            "proxyId": "depSalesTypemodel",
            "selType": "rowmodel"
        }),
        "store": "dsSalesDescription"
    });

    window.App.dsMOPDetails = Ext.create("Ext.data.Store", {
        "model": Ext.define(Ext.id(), {
            extend: "Ext.data.Model",
            "fields": [{
                "name": "MOPDetailID",
                "sortDir": "ASC"
            }, {
                "name": "StoreLocationMOPID"
            }, {
                "name": "MovementHeaderID"
            }, {
                "name": "MOPCount",
                "type": "int"
            }, {
                "name": "MOPAmount",
                "type": "float"
            }, {
                "name": "StoreLocationID"
            }, {
                "name": "StoreMOPNo",
                "type": "int"
            }, {
                "name": "IsUserAdded",
                "type": "boolean"
            }, {
                "name": "MOPName",
                "type": "string"
            }
            ]
        }),
        "storeId": "dsMOPDetails",
        "data": dayReconData,
       
        "writeParameters": function (operation) {
            return {
                apply: {
                    all: {
                        "action": operation.action
                    }
                }
            };
        },
        "proxy": {
            "type": "memory",
            "reader": {
                "type": "json",
                "root": "MOPDetailObjects",
                "totalProperty": "total"
            },
            "writer": {
                "type": "json",
                "root": "MOPDetailObjects",
                "encode": true
            }
        },
        "listeners": {
            "load": {
                "fn": function (data) {
                    calculateMopDetailTotal();
                }
            }           
        }
    });
    Ext.create("Ext.grid.Panel", {
        "id": "grdMOPDetails",
        "border": false,
        "cls": "x-grid-custom",
        "height": 200,
        "plugins": [{
            "proxyId": "CellMopEditing1",
            "ptype": "cellediting",
            "listeners": {
                "edit": {
                    "fn": getTotalMopAndSave
                }
            }
        }
        ],
        "renderTo": "App.grdMOPDetails_Container",
        "width": 260,
        "bodyStyle": "padding:0 0 0 0;",
        "header": false,
        "columns": {
            "id": "mopColumnModel2",
            "items": [{
                "id": "MOPName",
                "header": "MOP<br/> Name",
                "width": 80,
                "dataIndex": "MOPName",
                "hideable": false,
                "sortable": true,
                "wrap": true
            }, {
                "id": "MOPCount",
                "header": "Count",
                "width": 50,
                "align": "right",
                "dataIndex": "MOPCount",
                "editor": new Ext.grid.CellEditor(Ext.apply({
                    field: {
                        "id": "txtMOPCount",
                        "dataIndex": "MOPCount",
                        "xtype": "numberfield",
                        "decimalSeparator": ".",
                        "listeners": {
                            "show": {
                                "fn": mopDetailfocusOnMe
                            }
                        }
                    }
                }, {})),
                "hideable": false,
                "sortable": true
            }, {
                "id": "MOPAmount",
                "header": "Amount",
                "width": 85,
                "flex": 1,
                "align": "right",
                "dataIndex": "MOPAmount",
                "editor": new Ext.grid.CellEditor(Ext.apply({
                    field: {
                        "id": "txtMOPAmount",
                        "dataIndex": "MOPAmount",
                        "xtype": "numberfield",
                        "decimalSeparator": "."
                    }
                }, {})),
                "hideable": false,
                "renderer": Ext.util.Format.usMoney,
                "sortable": true
            }, {
                "id": "mopdeleteLink",
                "width": 30,
                "hideable": false,
                "renderer": getMopforDelete,
                "sortable": true
            }
            ]
        },
        "enableColumnMove": false,
        "enableColumnResize": false,
        "selModel": window.App.rowMopSelectionModel1 = Ext.create("Ext.selection.RowModel", {
            "proxyId": "rowMopSelectionModel1",
            "selType": "rowmodel"
        }),
        "store": "dsMOPDetails"
    });
    window.App.dsBusinessDayReconIncome = Ext.create("Ext.data.Store", {
        "model": Ext.define(Ext.id(), {
            extend: "Ext.data.Model",
            "fields": [{
                "name": "RowID",
                "type": "int"
            }, {
                "name": "BusinessDayReconID",
                "sortDir": "ASC"
            }, {
                "name": "StoreLocationID"
            }, {
                "name": "BusinessDate",
                "type": "date",
                "dateFormat": "Y-m-d\\TH:i:s"
            }, {
                "name": "ReconAmount",
                "type": "float"
            }, {
                "name": "CompanyReconParameterName",
                "type": "string"
            }, {
                "name": "IsExpense",
                "type": "boolean"
            }, {
                "name": "IsReadOnly",
                "type": "boolean"
            }
            ]
        }),
        "storeId": "dsBusinessDayReconIncome",
        "data": dayReconData,
        "writeParameters": function (operation) {
            return {
                apply: {
                    all: {
                        "action": operation.action
                    }
                }
            };
        },
        "proxy": {
            "type": "memory",
            "reader": {
                "type": "json",
                "idProperty": "RowID",
                "root": "RepBusinessDayReconIncomes",
                "totalProperty": "total"
            },
           
            "writer": {
                "type": "json",
                "root": "RepBusinessDayReconIncomes",
                "encode": true
            }
        },
        "listeners": {
            "load": {
                "fn": function (data) {
                    calculateBusinessDayReconTotal();
                }//businessDayReconLoaded
            }
        }
    });
    Ext.create("Ext.grid.Panel", {
        "id": "grddailyRecons",
        "enableHdMenu": false,
        "width":218,
        "border": false,
        "cls": "x-grid-custom",
        "plugins": [{
            "proxyId": "CellReconIncomeEditing",
            "ptype": "cellediting",
            "listeners": {
                "edit": {
                    "fn": getTotalReceivableAmountAndReload
                }
            }
        }
        ],
        "renderTo": "App.grddailyRecons_Container",
        "bodyStyle": "padding:0 0 0 0;",
        "header": false,
        "columns": {
            "id": "grdIncomeColumnModel1",
            "items": [{
                "id": "incomeCompanyReconParameterName",
                "header": "Accounts<br/> Payable",
                "width": 130,
                "dataIndex": "CompanyReconParameterName",
                "hideable": false,
                "sortable": true,
                "wrap": true
            }, {
                "id": "incomeReconAmount",
                "header": "Amount",
                "width": 80,
                "align": "right",
                "dataIndex": "ReconAmount",
                "editor": new Ext.grid.CellEditor(Ext.apply({
                    field: {
                        "id": "txtReconAmount",
                        "dataIndex": "ReconAmount",
                        "xtype": "numberfield",
                        "decimalSeparator": ".",
                        "listeners": {
                            "show": {
                                "fn": businessDayReconfocusOnMe
                            }
                        }
                    }
                }, {})),
                "hideable": false,
                "renderer": Ext.util.Format.usMoney,
                "sortable": true
            }
            ]
        },
        "enableColumnMove": false,
        "enableColumnResize": false,
        "selModel": window.App.rowSelectionModel3 = Ext.create("Ext.selection.RowModel", {
            "proxyId": "rowSelectionModel3",
            "selType": "rowmodel"
        }),
        "store": "dsBusinessDayReconIncome"
    });
    window.App.dsBusinessDayReconExpense = Ext.create("Ext.data.Store", {
        "model": Ext.define(Ext.id(), {
            extend: "Ext.data.Model",
            "fields": [{
                "name": "RowID",
                "type": "int"
            }, {
                "name": "BusinessDayReconID",
                "sortDir": "ASC"
            }, {
                "name": "StoreLocationID"
            }, {
                "name": "BusinessDate",
                "type": "date",
                "dateFormat": "Y-m-d\\TH:i:s"
            }, {
                "name": "ReconAmount",
                "type": "float"
            }, {
                "name": "CompanyReconParameterName",
                "type": "string"
            }, {
                "name": "IsExpense",
                "type": "boolean"
            }, {
                "name": "IsReadOnly",
                "type": "boolean"
            }
            ]
        }),
        "storeId": "dsBusinessDayReconExpense",
        "data": dayReconData,
      
        "writeParameters": function (operation) {
            return {
                apply: {
                    all: {
                        "action": operation.action
                    }
                }
            };
        },
        "proxy": {
            "type": "memory",
            "reader": {
                "type": "json",
                "idProperty": "RowID",
                "root": "RepBusinessDayReconExpences",
                "totalProperty": "total"
            },
           
            "writer": {
                "type": "json",
                "root": "RepBusinessDayReconExpences",
                "encode": true
            }
        },
        "listeners": {
            "load": {
                "fn": function (data) {
                    calculateBusinessDayReconExpensTotal();
                } //businessDayReconExpenseLoaded
            }
        }
    });
    Ext.create("Ext.grid.Panel", {
        "id": "grdDailyReconExpenses",
        "border": false,
        "width": 218,
        "cls": "x-grid-custom",
        "plugins": [{
            "proxyId": "CellReconExpenseEditing",
            "ptype": "cellediting",
            "listeners": {
                "edit": {
                    "fn": function () {
                        saveBussinessExpense();
                        getTotalExpenseAmount()
                    }
                }
            }
        }
        ],
        "renderTo": "App.grdDailyReconExpenses_Container",
        "bodyStyle": "padding:0 0 0 0;",
        "header": false,
        "columns": {
            "id": "grdExpenpseColumnModel4",
            "items": [{
                "id": "expenseCompanyReconParameterName",
                "header": "Accounts<br/>Receivables",
                "width": 130,
                "dataIndex": "CompanyReconParameterName",
                "hideable": false,
                "sortable": true,
                "wrap": true
            }, {
                "id": "expenseReconAmount",
                "header": "Amount",
                "width": 80,
                "align": "right",
                "dataIndex": "ReconAmount",
                "editor": new Ext.grid.CellEditor(Ext.apply({
                    field: {
                        "dataIndex": "ReconAmount",
                        "xtype": "numberfield",
                        "decimalSeparator": ".",
                        "listeners": {
                            "show": {
                                "fn": businessDayReconfocusOnMe
                            }
                        }
                    }
                }, {})),
                "hideable": false,
                "renderer": Ext.util.Format.usMoney,
                "sortable": true
            }
            ]
        },
        "enableColumnMove": false,
        "enableColumnResize": false,
        "selModel": window.App.rowCompanyReconSelectionModel4 = Ext.create("Ext.selection.RowModel", {
            "proxyId": "rowCompanyReconSelectionModel4",
            "selType": "rowmodel"
        }),
        "store": "dsBusinessDayReconExpense"
    });

    Ext.create("Ext.button.Button", {
        "id": "btnSaveMOPDetails",
        "renderTo": "App.btnSaveMOPDetails_Container",
        "width": 80,
        "text": "Save",
        "listeners": {
            "click": {
                "fn": function () { saveMop(false) }
            }
        }
    });

    window.App.dsVendorPaymentRecon = Ext.create("Ext.data.Store", {
        "model": Ext.define(Ext.id(), {
            extend: "Ext.data.Model",
            "fields": [{
                "name": "PaymentID",
                "type": "int"
            }, {
                "name": "MovementHeaderID"
            }, {
                "name": "VendorName"
            }, {
                "name": "IsVendor",
                "type": "boolean"
            }, {
                "name": "AmountPaid",
                "type": "float"
            }, {
                "name": "PaymentSourceID"
            }, {
                "name": "SourceName"
            }, {
                "name": "IsCheck",
                "type": "boolean"
            }, {
                "name": "IsCash",
                "type": "boolean"
            }, {
                "name": "Notes"
            }
            ]
        }),
        "storeId": "dsVendorPaymentRecon",
        "data": dayReconData,
        "proxy": {
            "type": "memory",
            "reader": {
                "type": "json",
                "idProperty": "PaymentID",
                "root": "PaymentReconObjects",
                "totalProperty": "total"
            }
        },
        "listeners": {
            "load": {
                "fn": function (data) {
                    calculateVendorPaymentTotal();
                } //vendorPaymentLoaded
            }
        }
    });

    Ext.create("Ext.grid.Panel", {
        "id": "grdVenorPaymenRecon",
        "border": false,
        "cls": "x-grid-custom",
        "height": 200,
        "renderTo": "App.grdVenorPaymenRecon_Container",
        "width": 260,
        "bodyStyle": "padding:0 0 0 0;",
        "header": false,
        "columns": {
            "id": "VendorPayeeColumnModel6",
            "items": [{
                "id": "payeeName",
                "header": "Payee<br/>Name",
                "width": 65,
                "dataIndex": "VendorName",
                "hideable": false,
                "sortable": true,
                "wrap": true
            }, {
                "id": "sourceName",
                "header": "Payment<br/>Type",
                "width": 65,
                "dataIndex": "SourceName",
                "hideable": false,
                "sortable": true,
                "wrap": true
            }, {
                "id": "payeeAmount",
                "header": "Payment<br/>Amt",
                "width": 70,
                "flex": 1,
                "resizable": false,
                "align": "right",
                "dataIndex": "AmountPaid",
                "editor": new Ext.grid.CellEditor(Ext.apply({
                    field: {
                        "id": "paAmount",
                        "dataIndex": "Amount",
                        "xtype": "numberfield",
                        "decimalSeparator": ".",
                        "listeners": {
                            "blur": {
                                "fn": getTotalVendorPayout
                            }
                        }
                    }
                }, {})),
                "hideable": false,
                "renderer": Ext.util.Format.usMoney,
                "sortable": true
            }, {
                "id": "editLink",
                "width": 20,
                "resizable": false,
                "hideable": false,
                "renderer": getVendorPaymentforEdit,
                "sortable": true
            }, {
                "id": "deleteLink",
                "width": 20,
                "resizable": false,
                "hideable": false,
                "renderer": getVendorPaymentforDelete,
                "sortable": true
            }
            ]
        },
        "enableColumnMove": false,
        "selModel": window.App.rowPayoutSelectionModel5 = Ext.create("Ext.selection.RowModel", {
            "proxyId": "rowPayoutSelectionModel5",
            "selType": "rowmodel"
        }),
        "store": "dsVendorPaymentRecon"
    });
    window.App.dsPayIn = Ext.create("Ext.data.Store", {
        "model": Ext.define(Ext.id(), {
            extend: "Ext.data.Model",
            "fields": [{
                "name": "PayInID",
                "type": "int"
            }, {
                "name": "PaymentSourceID"
            }, {
                "name": "SourceName",
                "type": "string"
            }, {
                "name": "MovementHeaderID"
            }, {
                "name": "PayeeName",
                "type": "string"
            }, {
                "name": "Amount",
                "type": "float"
            }, {
                "name": "Notes"
            }
            ]
        }),
        "storeId": "dsPayIn",
        "data": dayReconData,
       
        "proxy": {
            "type": "memory",
            "reader": {
                "type": "json",
                "idProperty": "PayInID",
                "root": "PayInObjects",
                "totalProperty": "total"
            }           
        },
        "listeners": {
            "load": {
                "fn": function (data) {
                    calculateVendorPayinTotal();
                } 
            }
        }
    });
    Ext.create("Ext.grid.Panel", {
        "id": "gridpayin",
        "border": false,
        "cls": "x-grid-custom",
        "height": 200,
        "renderTo": "App.gridpayin_Container",
        "width": 260,
        "bodyStyle": "padding:0 0 0 0;",
        "header": false,
        "columns": {
            "items": [{
                "header": "Payee<br/>Name",
                "width": 60,
                "dataIndex": "PayeeName",
                "hideable": false,
                "sortable": true,
                "wrap": true
            }, {
                "header": "Payment<br/>Source",
                "flex": 1,
                "dataIndex": "SourceName",
                "hideable": false,
                "sortable": true,
                "wrap": true
            }, {
                "id": "Column3",
                "header": "Amount",
                "width": 80,
                "resizable": false,
                "align": "right",
                "dataIndex": "Amount",
                "hideable": false,
                "renderer": Ext.util.Format.usMoney,
                "sortable": true
            }, {
                "id": "Column4",
                "width": 18,
                "resizable": false,
                "hideable": false,
                "renderer": getPayInforEdit,
                "sortable": true
            }, {
                "id": "Column5",
                "width": 18,
                "resizable": false,
                "hideable": false,
                "renderer": deletePayInDetail,
                "sortable": true
            }
            ]
        },
        "enableColumnMove": false,
        "selModel": window.App.payInRowSelectionModel = Ext.create("Ext.selection.RowModel", {
            "proxyId": "payInRowSelectionModel",
            "selType": "rowmodel"
        }),
        "store": "dsPayIn"

    });

    window.App.dsCashCheck = Ext.create("Ext.data.Store", {
        "model": Ext.define(Ext.id(), {
            extend: "Ext.data.Model",
            "fields": [{
                "name": "CashAmount",
                "type": "float"
            }, {
                "name": "CheckAmount",
                "type": "float"
            }, {
                "name": "CashMopAmount",
                "type": "float"
            }
            ]
        }),
        "storeId": "dsCashCheck",
        "data": dayReconData,
        "useIdConfirmation": true,
        
        "proxy": {
            "type": "memory",
            "reader": {
                "type": "json",
                "root": "RepCashCheckAmounts",
                "totalProperty": "total"
            }
        },
        "listeners": {
            "load": {
                "fn": function (store, data) {
                    calculateCheckCashTotal();
                }// cashCheckLoaded
            }
        }
    });
    //Split Deposits
    Ext.create("Ext.button.Button", {
        "id": "btnSplit",
        "renderTo": "App.btnSplit_Container",
        "width": 80,
        "disabled": true,
        "height": 20,
        "text": "Split Deposits",
        "listeners": {
            "click": {
                "fn": showBankDepositWindow
            }
        },
    });
    Ext.create("Ext.net.Label", {
        "id": "lblBankStore",
        "cls": "formpanelabel",
        "renderTo": "App.lblBankStore_Container",
        "text": "Store Name :"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblStore",
        "cls": "formpanelabel",
        "renderTo": "App.lblStore_Container"        
    });
    Ext.create("Ext.net.Label", {
        "id": "lblBankDate",
        "cls": "formpanelabel",
        "renderTo": "App.lblBankDate_Container",
        "text": "Date :"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblDate",
        "cls": "formpanelabel",
        "renderTo": "App.lblDate_Container"
    });

    Ext.create("Ext.net.Label", {
        "id": "lblBankDepositTotal",
        "cls": "formpanelabel",
        "renderTo": "App.lblBankDepositTotal_Container",
        "text": "Total Bank Deposit:"
    });
    Ext.create("Ext.net.Label", {
        "id": "txttBankDepositTotal",
        "labelWidth": 80,
        "cls": "formpanelabel",
        "cls": "labelColorGreen",
        "renderTo": "App.txttBankDepositTotal_Container",
        "text": ""
    });
    Ext.create("Ext.net.LinkButton", {
        "id": "btnAddDeposits",        
        "renderTo": "App.btnAddDeposits_Container",
        "text": "+ Add",
        "listeners": {
            "click": {
                "fn": AddDeposits
            }
        }
    });
    Ext.create("Ext.net.LinkButton", {
        "id": "btnEditDeposits",
        "hidden": true,
        "renderTo": "App.btnEditDeposits_Container",
        "text": "Edit-Deposits",
        "iconCls": "#Disk",
        "listeners": {
            "click": {
                "fn": EditDeposits
            }
        }
    });
    window.App.dsBankDeposits = Ext.create("Ext.data.Store", {
        "model": Ext.define(Ext.id(), {
            extend: "Ext.data.Model",
            "fields": [{
                "name": "BankDepositID"
            }, {
                "name": "PaymentSourceID"
            }, {
                "name": "SourceName"
            },{
                "name": "isDefaultSource",
                "type": "bool"
            }, {
                "name": "Amount",
                "type": "float"
            }
            ]
        }),
        "storeId": "dsBankDeposits",
        //"autoLoad": true,
        "readParameters": function (operation) {
            return {
                apply: {
                    "movementHeaderID": App.lblMovementHeaderID.getText(),
                    "StoreLocationID": App.cmbStoreLocations.getValue()
                }
            };
        },
        "proxy": {
            "type": "ajax",
            "reader": {
                "type": "json",
                "root": "data",
                "totalProperty": "total"
            },
            "url": "/DailyReconData/GetBankDeposits"
        }
        ,
        "listeners": {
            "load": {
                "fn": function (data) {
                    calculateBankDeposits();
                    CalculateDefaultBankAmt()
                }
            }
        }
    });   
    Ext.create("Ext.grid.Panel", {
        "id": "grdBankDeposits",
        "border": false,
        //"width": 420,
        "Layout":"FitLayout",
        "cls": "x-grid-custom",        
        "renderTo": "App.grdBankDeposits_Container",
        "bodyStyle": "padding:0 0 0 0;",
        "header": false,
        "columns": {
            "id": "grdBankDepColumnModel4",
            "items": [{
                "id": "bankscolumn",
                "header": "Bank<br/>Name",
                "width":230,
                "dataIndex": "SourceName",
                "hideable": false,
                "sortable": true,
                "wrap": true
            }, {
                "id": "BankAmountColumn",
                "header": "Amount",
                "width": 120,
                "align": "right",
                "dataIndex": "Amount",
                "hideable": false,
                "renderer": Ext.util.Format.usMoney,
                "sortable": true
            },
             {
                "id": "BankEditLink",
                "width": 30,
                "resizable": false,
                "hideable": false,
                "renderer": getSplitDepositforEdit,
                "sortable": true
            }, {
                "id": "BankDeleteLink",
                "width": 30,
                "resizable": false,
                "hideable": false,
                "renderer": getSplitDepositDelete,
                "sortable": true
            }
            ]
        },
        "enableColumnMove": false,
        "enableColumnResize": false,
        "selModel": window.App.rowBankDepSelectionModel4 = Ext.create("Ext.selection.RowModel", {
            "proxyId": "rowBankDepSelectionModel4",
            "selType": "rowmodel"
        })
        , "store": "dsBankDeposits"
    });

    Ext.create("Ext.net.Label", {
        "id": "lblBankDepositAmount",
        "cls": "formpanelabel",
        "renderTo": "App.lblBankDepositAmount_Container",
        "text": "Total Deposit Amount:"
    });
    //Ext.create("Ext.net.Label", {
    //    "id": "txtDepositAmount",
    //    "labelWidth": 80,
    //    "cls": "formpanelabel",
    //    "cls": "labelColorGreen",
    //    "renderTo": "App.txtDepositAmount_Container",
    //    "text": ""
    //});

    Ext.create("Ext.net.Label", {
        "id": "lblDefaultBankTotal",
        "cls": "formpanelabel",
        "renderTo": "App.lblDefaultBankTotal_Container",
        "text": "Default Bank Amount:"
    });
    Ext.create("Ext.net.Label", {
        "id": "txtDefaultBankTotal",
        "labelWidth": 80,
        "cls": "formpanelabel",
        "cls": "labelColorGreen",
        "renderTo": "App.txtDefaultBankTotal_Container",
        "text": ""
    });
    Ext.create("Ext.net.Label", {
        "id": "lblDepositTitle",        
        "hidden": true,
        "renderTo": "App.lblDepositTitle_Container",
        "text": ""
    });
    window.App.dsPaymentSourceName = Ext.create("Ext.data.Store", {
        "model": Ext.define(Ext.id(), {
            extend: "Ext.data.Model",
            "fields": [{
                "name": "PaymentSourceID"
            }, {
                "name": "SourceName"
            }              
            ]
        }),
        "storeId": "dsPaymentSourceName",
        "autoLoad": true,
        "readParameters": function (operation) {
            return {
                apply: {
                    "storeLocationID": App.cmbStoreLocations.getValue()
                }
            };
        },
        "proxy": {
            "type": "ajax",
            "reader": {
                "type": "json",
                "idProperty": "PaymentSourceID",
                "root": "data",
                "totalProperty": "total"
            },
            "url": "/DailyReconData/GetSourceNameByStoreLocationID"
        }
    });
    Ext.create("Ext.form.field.ComboBox", {
        "id": "cmbBanks",       
        "renderTo": "App.cmbBanks_Container",
        "width": 250,
        "fieldLabel": "Bank Name",
        "labelSeparator": " ",
        "displayField": "SourceName",
        "queryMode": "local",
        "typeAhead": true,
        "valueField": "PaymentSourceID",
        "store": "dsPaymentSourceName",       
    });
    Ext.create("Ext.button.Button", {
        "id": "btnSaveCloseBankDeposit",
        "renderTo": "App.btnSaveCloseBankDeposit_Container",
        "width": 90,
        "height": 20,
        "text": "Save Close",
        "listeners": {
            "click": {
                "fn": function () {
                    saveBankDeposits();
                    closeBankDepositsWindow()
                    // CalculateDefaultBankAmt()
                }
            }
        }
    });
    Ext.create("Ext.button.Button", {
        "id": "btnSaveBankDeposit",
        "renderTo": "App.btnSaveBankDeposit_Container",
        "width": 50,
        "height": 20,
        "text": "Save",
        "listeners": {
            "click": {
                "fn":function () {
                    saveBankDeposits();
                   // CalculateDefaultBankAmt()
                } 
            }
        }       
    });
    Ext.create("Ext.button.Button", {
        "id": "btnCancelBankDeposit",
        "renderTo": "App.btnCancelBankDeposit_Container",
        "width": 50,
        "height": 20,
        "text": "Cancel",
        "listeners": {
            "click": {
                 "fn": closeBankDepositsWindow
            }
        }
    });
    Ext.create('Ext.form.Panel', {       
        "width": 250,
        "border": false,
        "renderTo": "App.txtDepositAmt_Container",
        items: [{
            "xtype": 'textfield',
            "id":"txtBankAmount",
            //"labelStyle": "font-weight : bold",
            "name": 'name',
            "fieldLabel": 'Amount :',
            "iconCls": "#MoneyDollar",
            "allowBlank": false  // requires a non-empty value
        }]
    });
    Ext.create("Ext.net.Label", {
        "id": "lblTBDep",
        "cls": "formpanelabel",
        "renderTo": "App.lblTBDep_Container",
        "text": "Total Bank Deposit"
    });
    Ext.create("Ext.net.Label", {
        "id": "Label10",
        "cls": "formpanelabel",
        "renderTo": "App.Label10_Container",
        "text": "Cash:"
    });

    Ext.create("Ext.net.Label", {
        "id": "lblBeginTime",
        "cls": "formpanelabel",
        "renderTo": "App.lblBeginTime_Container"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblEndTime",
        "cls": "formpanelabel",
        "renderTo": "App.lblEndTime_Container"
    });

    Ext.create("Ext.net.Label", {
        "id": "lblBatchNo",
        "cls": "formpanelabel",
        "renderTo": "App.lblBatchNo_Container"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblMopCash",
        "labelWidth": 80,
        "cls": "formpanelabel",
        "renderTo": "App.lblMopCash_Container"
    });


    Ext.create("Ext.net.Label", {
        "id": "lblDayReconCash",
        "cls": "formpanelabel",
        "renderTo": "App.lblDayReconCash_Container",
        "text": "Short/Over:"
    });
    Ext.create("Ext.net.Label", {
        "id": "txtShortOver",
        "cls": "formpanelabel",
        "cls": "labelColorRed",
        "renderTo": "App.txtShortOver_Container",
        "text": ""
    });
    Ext.create("Ext.net.Label", {
        "id": "lblCash",
        "cls": "formpanelabel",
        "renderTo": "App.lblCash_Container",
        "text": ""
    });
    Ext.create("Ext.net.Label", {
        "id": "lblDayReconCheck",
        "cls": "formpanelabel",
        "renderTo": "App.lblDayReconCheck_Container",
        "text": "Check:"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblCheck",
        "labelWidth": 80,
        "cls": "formpanelabel",
        "renderTo": "App.lblCheck_Container"
    });

    Ext.create("Ext.net.Label", {
        "id": "lblEditCheck",
        "labelWidth": 80,
        "cls": "formpanelabel",
        "renderTo": "App.LblEditCheck_Container"
    });
    Ext.create("Ext.net.Label", {
        "id": "lbltotBankDeposit",
        "cls": "formpanelabel",
        "renderTo": "App.lblTotalBankDeposit_Container",
        "text": "Total Bank Deposit:"
    });
    Ext.create("Ext.net.Label", {
        "id": "txttotBankDeposit",
        "labelWidth": 80,
        "cls": "formpanelabel",
        "cls": "labelColorGreen",
        "renderTo": "App.txtTotalBankDeposit_Container",
        "text": ""
    });
    Ext.create("Ext.button.Button", {
        "id": "btnAddAtHandEntry",
        "renderTo": "App.btnAddAtHandEntry_Container",
        "disabled": false,
        "width": 80,
        "text": "Add At Hand",
        "listeners": {
            "click": {
                "fn": showAtHandEntryExtjsWindow
            }
        }
    });
   
    Ext.create("Ext.form.Panel", {
        "id": "AtHandEntryformPanel",
        "border": false,
        "height": 100,
        "padding": 10,
        "renderTo": "App.AtHandEntryformPanel_Container",
        "width": 300,
        "items": [{
            "id": "AtHandEntryformPanel1",
            "border": false,
            "xtype": "fieldset",
            "defaults": {
                "labelSeparator": "",
                "labelWidth": 130
            },
            "items": [{
                "id": "txtAtHandCashEntry",
                "width": 250,
                "xtype": "textfield",
                "fieldLabel": "Cash At Hand :",
                "labelStyle": "font-weight : bold",
                "name": "cashatHand",
                "allowBlank": true,
                "iconCls": "#MoneyDollar",
                //"decimalSeparator": "."
            }, {
                "id": "txtAtHandCheckEntry",
                "width": 250,
                "xtype": "textfield",
                "labelStyle": "font-weight : bold",
                "fieldLabel": "Check At Hand :",
                "name": "checkathand",
                "allowBlank": true,
                "iconCls": "#MoneyDollar",
                //"decimalSeparator": "."
            }
            ]
        }
        ],
        "layout": "column"
    });
    Ext.create("Ext.button.Button", {
        "id": "btnSaveAtHandEntry",
        "renderTo": "App.btnSaveAtHandEntry_Container",
        "width": 50,
        "height": 20,
        "text": "Save",
        "listeners": {
            "click": {
                "fn": saveAtHandEntryValues
            }
        }
    });
    Ext.create("Ext.button.Button", {
        "id": "btnCancelAtHandEntry",
        "renderTo": "App.btnCancelAtHandEntry_Container",
        "width": 50,
        "height": 20,
        "text": "Cancel",
        "listeners": {
            "click": {
                "fn": closeAtHandEntryWindow
            }
        }
    });   

    Ext.create("Ext.net.Label", {
        "id": "Label11",
        "cls": "formpanelabel",
        "renderTo": "App.Label11_Container",
        "text": "Other Income:"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblTotalExpenses",
        "cls": "formpanelabel",
        "renderTo": "App.lblTotalExpenses_Container"
    });
    Ext.create("Ext.net.Label", {
        "id": "Label7",
        "cls": "formpanelabel",
        "renderTo": "App.Label7_Container",
        "text": "Total Receipts:"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblTotalReceiptsGreen",
        "cls": "labelColorGreen",
        "renderTo": "App.lblTotalReceiptsGreen_Container"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblTotalReceiptsRed",
        "cls": "labelColorRed",
        "renderTo": "App.lblTotalReceiptsRed_Container"
    });

    Ext.create("Ext.net.Label", {
        "id": "Label2",
        "cls": "formpanelabel",
        "renderTo": "App.Label2_Container",
        "text": "Total Sales:"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblTotalSales",
        "cls": "formpanelabel",
        "renderTo": "App.lblTotalSales_Container"
    });
    Ext.create("Ext.net.Label", {
        "id": "Label6",
        "cls": "formpanelabel",
        "renderTo": "App.Label6_Container",
        "text": "Other Expense:"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblDayReconTotalAmount",
        "cls": "formpanelabel",
        "renderTo": "App.lblDayReconTotalAmount_Container"
    });

    Ext.create("Ext.net.Label", {
        "id": "Label8",
        "cls": "formpanelabel",
        "renderTo": "App.Label8_Container",
        "text": "Total Sales:"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblTotSalesAmount",
        "cls": "formpanelabel",
        "renderTo": "App.lblTotSalesAmount_Container"
    });

    Ext.create("Ext.net.Label", {
        "id": "Label3",
        "cls": "formpanelabel",
        "renderTo": "App.Label3_Container",
        "text": "Total:"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblGasGradeTotalAmount",
        "cls": "formpanelabel",
        "renderTo": "App.lblGasGradeTotalAmount_Container"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblGasGradeVolume",
        "cls": "formpanelabel",
        "renderTo": "App.lblGasGradeVolume_Container"
    });
    Ext.create("Ext.net.LinkButton", {
        "id": "btnFuelGradSumryWindowOpen",
        "cls": "formpanelabel",
        "renderTo": "App.btnFuelGradSumryWindowOpen_Container",
        "text": "Show Service Level Summary",
        "listeners": {
            "click": {
                "fn": showFuelGradeSummaryExtjsWindow
            }
        }
    });

    Ext.create("Ext.net.Label", {
        "id": "Label5",
        "cls": "formpanelabel",
        "renderTo": "App.Label5_Container",
        "text": "Total Mop Sales:"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblMopTotalAmount",
        "cls": "formpanelabel",
        "renderTo": "App.lblMopTotalAmount_Container"
    });
    Ext.create("Ext.button.Button", {
        "id": "btnAddMop",
        "disabled": true,
        "renderTo": "App.btnAddMop_Container",
        "width": 80,
        "text": "Add Mop",
        "listeners": {
            "click": {
                "fn": showMopDetailExtjsWindow
            }
        }
    });

    Ext.create("Ext.net.Label", {
        "id": "lblTotalMop",
        "cls": "formpanelabel",
        "renderTo": "App.lblTotalMop_Container",
        "text": "Total MOP:"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblMopSalesTotalAmount",
        "cls": "formpanelabel",
        "renderTo": "App.lblMopSalesTotalAmount_Container"
    });
    Ext.create("Ext.net.Label", {
        "id": "Label9",
        "cls": "formpanelabel",
        "renderTo": "App.Label9_Container",
        "text": "Total POS Sales:"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblTotalPosSales",
        "cls": "formpanelabel",
        "renderTo": "App.lblTotalPosSales_Container"
    });
    Ext.create("Ext.net.Label", {
        "id": "Label4",
        "cls": "formpanelabel",
        "renderTo": "App.Label4_Container",
        "text": "Short Over:"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblShortOverGreen",
        "cls": "labelColorGreen",
        "hidden": true,
        "renderTo": "App.lblShortOverGreen_Container"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblShortOverRed",
        "cls": "labelColorRed",
        "hidden": true,
        "renderTo": "App.lblShortOverRed_Container"
    });

    window.App.dsPosVendorPayoutAmount = Ext.create("Ext.data.Store", {
        "model": Ext.define(Ext.id(), {
            extend: "Ext.data.Model",
            "fields": [{
                "name": "TotalAmount",
                "type": "float"
            }, {
                "name": "SumaryCode",
                "type": "int"
            }
            ]
        }),
        "storeId": "dsPosVendorPayoutAmount",
        "data": dayReconData,
        "useIdConfirmation": true,     
        "proxy": {
            "type": "memory",
            "reader": {
                "type": "json",
                "root": "VendorPayInOrPayoutTotals",
                "totalProperty": "total"
            }         
        },
        "listeners": {
            "load": {
                "fn": function (data) {
                    calculateposPayOutTotal();
                }// posPayOutLoaded
            }
        }
    });

    window.App.dsRepPayInPayOut = Ext.create("Ext.data.Store", {
        "model": Ext.define(Ext.id(), {
            extend: "Ext.data.Model",
            "fields": [{
                "name": "miscellaneousSummaryCode",
                "sortDir": "ASC"
            }, {
                "name": "Amount"
            }
            ]
        }),
        "storeId": "dsRepPayInPayOut",
        "data": dayReconData,       
        "proxy": {
            "type": "memory",
            "reader": {
                "type": "json",
                "idProperty": "StoreLocationID",
                "root": "spRepPayinPayoutsResults",
                "totalProperty": "total"
            },

        },
        "listeners": {
            "load": {
                "fn": function (data) {
                    calculateSales();
                }       //repPayInPayOutLoad
            }
        }
    });

    window.App.dsBusinessDayNote = Ext.create("Ext.data.Store", {
        "model": Ext.define(Ext.id(), {
            extend: "Ext.data.Model",
            "fields": [{
                "name": "BusinessDayNoteID",
                "type": "int"
            }, {
                "name": "StoreLocationID"
            }, {
                "name": "BusinessDate",
                "type": "date",
                "dateFormat": "Y-m-d"
            }, {
                "name": "ShortOver",
                "type": "float"
            }, {
                "name": "ShortOverCheck",
                "type": "float"
            }, {
                "name": "AtHandCash",
                "type": "float"
            }, {
                "name": "AtHandCheck",
                "type": "float"
            }, {
                "name": "Notes",
                "type": "string"
            }
            ]
        }),
        "storeId": "dsBusinessDayNote",
       
        "proxy": {
            "type": "memory",
            "reader": {
                "type": "json",
                "idProperty": "BusinessDayNoteID",
                "root": "BusinessDayNoteObject",
                "totalProperty": "total"
            }
            
        },
        "listeners": {
            "load": {
                "fn": businessDayNoteLoaded
            }
        }
    });
    //ATM Transaction Link
    Ext.create("Ext.net.LinkButton", {
        "id": "lnkATMTrans",
        "cls": "formpanelabel",
        "text": "+ Add ATM Transactions",
        "renderTo": "App.lnkATMTrans_Container",
        "listeners": {
            "click": {
                "fn": showATMReconWin
            }
        }
    });   
    //Ends
    //Add House Other Charges
    Ext.create("Ext.net.LinkButton", {
        "id": "lnkAddHouseCharge",
        "cls": "formpanelabel",
        "text": "+ Add House Charge ",
        "renderTo": "App.lnkAddHouseCharge_Container",
        "listeners": {
            "click": {
                "fn": showHouseChargeWindow 
            }
        }
    });
    //Ends
    Ext.create("Ext.form.field.TextArea", {
        "id": "txtNotes",
        "dataIndex": "Notes",
        "height": 100,
        "renderTo": "App.txtNotes_Container",
        "width": 218,
        "fieldLabel": "Notes",
        "labelAlign": "top",
        "labelSeparator": " ",
        "labelWidth": 50
    });

    Ext.create("Ext.button.Button", {
        "id": "btnAddNotes",
        "hidden": true,
        "renderTo": "App.btnAddNotes_Container",
        "width": 80,
        "listeners": {
            "click": {
                "fn": checkStoreName
            }
        },
        "directEvents": {
            "click": {
                fn: function (item, e) {
                    Ext.net.directRequest({
                        "cleanRequest": true,
                        "url": "/DailyReconData/SaveBusinessDayNote",
                        "extraParams": {
                            "businessDayNoteID": App.lblBusinessDayNoteID.getText(),
                            "businessDate": App.dpBusinessDate.getRawValue(),
                            "shortOver": socash,
                            "shortOverCheck": socheck,
                            "atHandCash": atHandCash,
                            "atHandCheck": atHandCheck,
                            "storeLocationID": App.cmbStoreLocations.getValue(),
                            "notes": App.txtNotes.getValue(),
                            "movementHeaderID": movementHeaderID
                        },
                        "userSuccess": businessDayNoteSuccess,
                        control: this
                    });
                }
            }
        }
    });

    Ext.create("Ext.net.Label", {
        "id": "lblPayinCheckAmt",
        "cls": "formpanelabelNormal",
        "renderTo": "App.lblPayinCheckAmt_Container",
        "text": "Payin Check Amt:"
    });
    Ext.create("Ext.net.Label", {
        "id": "txtPayinCheckAmt",
        "cls": "formpanelabelNormal",
        "renderTo": "App.txtPayinCheckAmt_Container"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblPayinCashAmt",
        "cls": "formpanelabelNormal",
        "renderTo": "App.lblPayinCashAmt_Container",
        "text": "Payin Cash Amt:"
    });
    Ext.create("Ext.net.Label", {
        "id": "txtPayinCashAmt",
        "cls": "formpanelabelNormal",
        "renderTo": "App.txtPayinCashAmt_Container",
        "listeners": {
            "blur": {
                "fn": setDollorSign
            }
        }
    });
    Ext.create("Ext.net.Label", {
        "id": "lblTotpayin",
        "cls": "formpanelabel",
        "renderTo": "App.lblTotpayin_Container",
        "text": "Total Payin Amt:"
    });
    Ext.create("Ext.net.Label", {
        "id": "txtTotpayin",
        "cls": "formpanelabel",
        "renderTo": "App.txtTotpayin_Container"
    });

    Ext.create("Ext.net.Label", {
        "id": "lblPaidChkAmt",
        "cls": "formpanelabelNormal",
        "renderTo": "App.lblPaidChkAmt_Container",
        "text": "Payout Check Amt:"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblPayoutCheckAmount",
        "cls": "formpanelabelNormal",
        "renderTo": "App.lblPayoutCheckAmount_Container"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblPCAMT",
        "cls": "formpanelabelNormal",
        "renderTo": "App.lblPCAMT_Container",
        "text": "Payout Cash Amt:"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblTotalPayoutCashAmount",
        "cls": "formpanelabelNormal",
        "renderTo": "App.lblTotalPayoutCashAmount_Container"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblTot",
        "cls": "formpanelabel",
        "renderTo": "App.lblTot_Container",
        "text": "Total Payout Amt:"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblTotalVendorPayment",
        "cls": "formpanelabel",
        "renderTo": "App.lblTotalVendorPayment_Container"
    });
    Ext.create("Ext.button.Button", {
        "id": "btnVendorPayout",
        "disabled": true,
        "renderTo": "App.btnVendorPayout_Container",
        "width": 80,
        "text": "Add Payout",
        "listeners": {
            "click": {
                "fn": showAddVendorPayoutDetailExtjsWindow
            }
        }
       
    });
    Ext.create("Ext.button.Button", {
        "id": "btnEditPayoutRecon",
        "hidden": true,
        "renderTo": "App.btnEditPayoutRecon_Container",
        "width": 80,
        "text": "Edit Paid-Outs",
        "listeners": {
            "click": {
                "fn": showEditVendorPayoutDetailExtjsWindow
            }
        }
    });
    Ext.create("Ext.button.Button", {
        "id": "btnAddPayIn",
        "disabled": true,
        "renderTo": "App.btnAddPayIn_Container",
        "width": 80,
        "text": "Add PayIn",
        "listeners": {
            "click": {
                "fn": addPayInDetailExtjsWindow
            }
        }
    });
    Ext.create("Ext.button.Button", {
        "id": "btnShowDetail",
        "hidden": true,
        "renderTo": "App.btnShowDetail_Container",
        "width": 80,
        "text": "Edit Paid-Outs",
        "listeners": {
            "click": {
                "fn": showEditPayInDetailExtjsWindow
            }
        }
    });
    Ext.create("Ext.button.Button", {
        "id": "btnDeletePayInConfirm",
        "hidden": true,
        "renderTo": "App.btnDeletePayInConfirm_Container",
        "width": 80,
        "text": "DeletePayIn",
        "listeners": {
            "click": {
                "fn": deletePayInConfirm
            }
        }
    });
    Ext.create("Ext.button.Button", {
        "id": "btnDeletePayIn",
        "hidden": true,
        "renderTo": "App.btnDeletePayIn_Container",
        "width": 80,
        "text": "DeletePayIn",
        "directEvents": {
            "click": {
                fn: function (item, e) {
                    Ext.net.directRequest({
                        "cleanRequest": true,
                        "url": "/PayInData/DeletePayIn",
                        "extraParams": {
                            "id": getpayInID()
                        },
                        "userSuccess": deletePayInExtjsSuccess,
                        control: this
                    });
                }
            }
        }
    });
    Ext.create("Ext.net.Label", {
        "id": "lblTotalPayLab",
        "cls": "formpanelabel",
        "renderTo": "App.lblTotalPayLab_Container",
        "text": "Total Pay"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblPayIn1",
        "cls": "formpanelabel",
        "renderTo": "App.lblPayIn1_Container",
        "text": "Pay in:"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblPayOut1",
        "cls": "formpanelabel",
        "renderTo": "App.lblPayOut1_Container",
        "text": "Pay Out:"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblDayReconLab",
        "cls": "formpanelabel",
        "renderTo": "App.lblDayReconLab_Container",
        "text": "Day Recon"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblPOS",
        "cls": "formpanelabel",
        "renderTo": "App.lblPOS_Container",
        "text": "POS"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblPayIn",
        "cls": "formpanelabel",
        "renderTo": "App.lblPayIn_Container"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblPayOut",
        "cls": "formpanelabel",
        "renderTo": "App.lblPayOut_Container"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblPOSVendorLab",
        "cls": "formpanelabel",
        "renderTo": "App.lblPOSVendorLab_Container",
        "text": "POS"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblAtHand",
        "cls": "formpanelabel",
        "renderTo": "App.lblAtHand_Container",
        "text": "At Hand"
    });
    Ext.create("Ext.net.Label", {
        "id": "lblPosVendorPayIn",
        "cls": "formpanelabel",
        "renderTo": "App.lblPosVendorPayIn_Container"
    });
    Ext.create("Ext.net.LinkButton", {
        "id": "lkPosVendorPayIn",
        "cls": "formpanelabel",
        "hidden": true,
        "renderTo": "App.lkPosVendorPayIn_Container",
        "listeners": {
            "click": {
                "fn": showPOSVendorPayinDetailExtjsWindow
            }
        }
    });
    Ext.create("Ext.net.Label", {
        "id": "lblPosVendorPayOut",
        "cls": "formpanelabel",
        "renderTo": "App.lblPosVendorPayOut_Container"
    });
    Ext.create("Ext.net.LinkButton", {
        "id": "lkPosVendorPayOut",
        "cls": "formpanelabel",
        "hidden": true,
        "renderTo": "App.lkPosVendorPayOut_Container",
        "listeners": {
            "click": {
                "fn": showPOSVendorPayoutDetailExtjsWindow
            }
        }
    });


    Ext.create("Ext.window.Window", {
        "id": "windowMovementHeaderDetail",
        "height": 220,
        "renderTo": Ext.getBody(),
        "width": 400,
        "autoScroll": true,
        "resizable": false,
        "title": "Movement Header Detail",
        "modal": true
    });
    Ext.create("Ext.panel.Panel", {
        "id": "windowMopDetail",
        "border": false,
        "renderTo": "App.windowMopDetail_Container",
        "header": false
    });
    Ext.create("Ext.panel.Panel", {
        "id": "windowPosVendorPayout",
        "border": false,
        "renderTo": "App.windowPosVendorPayout_Container",
        "header": false
    });
    Ext.create("Ext.panel.Panel", {
        "id": "windowVendorPayoutDetail",
        "border": false,
        "renderTo": "App.windowVendorPayoutDetail_Container",
        "header": false
    });
    Ext.create("Ext.panel.Panel", {
        "id": "windowPayInDetail",
        "border": false,
        "renderTo": "App.windowPayInDetail_Container",
        "header": false
    });
    Ext.create("Ext.panel.Panel", {
        "id": "WinEditVendorPayoutDetail",
        "border": false,
        "renderTo": "App.WinEditVendorPayoutDetail_Container",
        "header": false
    });
    Ext.create("Ext.panel.Panel", {
        "id": "windowISMDetail",
        "border": false,
        "renderTo": "App.windowISMDetail_Container",
        "header": false
    });
    Ext.create("Ext.panel.Panel", {
        "id": "windowFuelGradeSummary",
        "border": false,
        "renderTo": "App.windowFuelGradeSummary_Container",
        "header": false
    });
    Ext.create("Ext.button.Button", {
        "id": "btnDeleteMopConfirm",
        "hidden": true,
        "renderTo": "App.btnDeleteMopConfirm_Container",
        "text": "Delete MopDetail",
        "listeners": {
            "click": {
                "fn": deleteMopDetailConfirm
            }
        }
    });
    Ext.create("Ext.button.Button", {
        "id": "btnDeleteMop",
        "hidden": true,
        "renderTo": "App.btnDeleteMop_Container",
        "text": "Delete MopDetail",
        "directEvents": {
            "click": {
                fn: function (item, e) {
                    Ext.net.directRequest({
                        "cleanRequest": true,
                        "url": "/DailyReconData/DeleteMopDetail",
                        "extraParams": {
                            "id": getSelectedMopDetail()
                        },
                        "userSuccess": deleteMopDetailExtjsSuccess,
                        control: this
                    });
                }
            }
        }
    });
    Ext.create("Ext.button.Button", {
        "id": "btnDeleteVendorPaymentConfirm",
        "hidden": true,
        "renderTo": "App.btnDeleteVendorPaymentConfirm_Container",
        "text": "Delete PaymentDetail",
        "listeners": {
            "click": {
                "fn": deleteVendorDetailConfirm
            }
        }
    });
    Ext.create("Ext.button.Button", {
        "id": "btnDeletePayment",
        "hidden": true,
        "renderTo": "App.btnDeletePayment_Container",
        "text": "Delete PaymentDetail",
        "directEvents": {
            "click": {
                fn: function (item, e) {
                    Ext.net.directRequest({
                        "cleanRequest": true,
                        "url": "/DailyReconData/DeleteVendorPaymentReconDetail",
                        "extraParams": {
                            "id": getSelectedPaymentDetail()
                        },
                        "userSuccess": deletePaymentDetailExtjsSuccess,
                        control: this
                    });
                }
            }
        }
    });
    Ext.create("Ext.button.Button", {
        "id": "btndetailISM",
        "hidden": true,
        "renderTo": "App.btndetailISM_Container",
        "width": 80,
        "text": "Details",
        "listeners": {
            "click": {
                "fn": function () {
                    showISMDetailExtjsWindow();
                }// showISMDetailExtjsWindow
            }
        }
    });
    Ext.create("Ext.net.Label", {
        "id": "lblBusinessDayNoteID",
        "hidden": true,
        "renderTo": "App.lblBusinessDayNoteID_Container"
    });
    Ext.create("Ext.panel.Panel", {
        "id": "reportsPanel",
        "autoHeight": true,
        "border": false,
        "renderTo": "App.reportsPanel_Container",
        "header": false
    });
    //House Accounts   
    Ext.create("Ext.form.field.ComboBox", {
        "id": "cmbHouseAccounts",
        "renderTo": "App.cmbHouseAccounts_Container",
        "width": 200,
        "fieldLabel": "House Accounts",
        "labelSeparator": " ",
        "displayField": "AccountName",
        "queryMode": "local",
        "typeAhead": true,
        "valueField": "HouseAccountID",
        "store": "dsHouseAccounts",
        "listeners": {
            "select": {
                "fn": changeCreditAmt
            }
        }
    });
    return;
}

function getJSONString(store) {
    var changedObjects = store.getUpdatedRecords();
    var dataObjects = new Array();
    for (var i = 0; i < changedObjects.length; i++) {
        dataObjects[i] = changedObjects[i].data;
    }
    return JSON.stringify(dataObjects);
}

var isSaveChange = false;

saveMop = function (isMopOnlySave) {
    if (App.dsMOPDetails.isDirty() == true) {
        var jsonString = getJSONString(App.dsMOPDetails);
        $.ajax({
            url: '/DailyReconData/SaveMOPDetails?data=' + jsonString + "'",
            type: 'POST',
            data: jsonString,
            success: function (data) {
                App.dsMOPDetails.commitChanges();
                App.dsMOPDetails.isDirty(false);
                App.grdMOPDetails.getView().refresh(false);
            }
        });
        isSaveChange = true;
    }
    if (isMopOnlySave) {
        if (isMopOnlySave == false) {
            saveBussinessIncome();
        }
    } else {
        saveBussinessIncome();
    }
}

saveBussinessIncome = function () {
    if (App.dsBusinessDayReconIncome.isDirty() == true) {
        var jsonString = getJSONString(App.dsBusinessDayReconIncome);
        $.ajax({
            url: '/DailyReconData/SaveBusinessDayRecon?data=' + jsonString,
            type: 'POST',
            data: jsonString,
            success: function (data) {
                isSaveChange = true;
                var businessDayReconID = data.data;
                var changedObjects = App.dsBusinessDayReconIncome.getUpdatedRecords();
                for (var i = 0; i < changedObjects.length; i++) {
                    changedObjects[i].data.BusinessDayReconID = businessDayReconID;
                }
                App.dsBusinessDayReconIncome.commitChanges();
                App.dsBusinessDayReconIncome.isDirty(false);
                saveBussinessExpense();
            }
        });
    } else {
        saveBussinessExpense();
    }
}

saveBussinessExpense = function () {
    if (App.dsBusinessDayReconExpense.isDirty() == true) {
        var jsonString = getJSONString(App.dsBusinessDayReconExpense);
        $.ajax({
            url: '/DailyReconData/SaveBusinessDayRecon?data=' + jsonString,
            type: 'POST',
            data: jsonString,
            success: function (data) {
                isSaveChange = true;
                var businessDayReconID = data.data;
                var changedObjects = App.dsBusinessDayReconExpense.getUpdatedRecords();
                for (var i = 0; i < changedObjects.length; i++) {
                    changedObjects[i].data.BusinessDayReconID = businessDayReconID;
                }
               
                App.dsBusinessDayReconExpense.commitChanges();
                App.dsBusinessDayReconExpense.isDirty(false);
                saveBussinessNote(false);
            }
        });

    }
    else {
        saveBussinessNote(false);
    }
}

var isNoteSave = false;

saveBussinessNote = function (isSaveOnBlur) {
    if (isNoteSave == false) {
        if (App.txtNotes.getValue() != oldNotes || App.txtShortOver.getText() != oldShortOver) {
            isSaveChange = true;
            $.ajax({
                url: '/DailyReconData/SaveBusinessDayNote?businessDayNoteID=' + bussDayNoteID + '&businessDate=' + App.dpBusinessDate.getRawValue() + '&shortOver=' + socash + '&shortOverCheck=' + socheck + '&atHandCash=' + atHandCash + '&athandCheck=' + atHandCheck + '&storeLocationID=' + App.cmbStoreLocations.getValue() + '&notes=' + App.txtNotes.getValue() + '&movementHeaderID=' + movementHeaderID,
                type: 'POST',
                success: function (data) {
                    bussDayNoteID = data.data;
                    oldShortOver = App.txtShortOver.getText();
                    App.dsBusinessDayNote.data.items[0].set('Notes', oldNotes);
                    App.dsBusinessDayNote.data.items[0].set('ShortOver', socash);
                    App.dsBusinessDayNote.data.items[0].set('ShortOverCheck', socheck);
                    App.dsBusinessDayNote.data.items[0].set('AtHandCash', atHandCash);
                    App.dsBusinessDayNote.data.items[0].set('AtHandCheck', atHandCheck);
                    isAmountRefresh = true;
                
                }
            });
            isNoteSave = true;
            setTimeout("isNoteSave = false", 1000);
        }
        if (isSaveChange == false) {
        } else {
            showMessageInformation('Record Saved');
        }
        isSaveChange = false;
    }
}



function getTotalMopAndSave(a, amount, i, u) {
    saveInBusinessTable = true;
    //to change dayclose
    var a =getShiftWiseValue();
    if ((a == 1) || (a == 2)) {
        var jsonString = getJSONString(App.dsMOPDetails);
        var originalvalue = amount.originalValue;
        var modifiedvalue = amount.value;
        var difference = parseFloat(modifiedvalue) - parseFloat(originalvalue);
        var count = 2;
        if (amount.field == "MOPCount")
            count = 1;
        var isUpdated = false;
        $(function () {
            $.post('/DailyReconData/UpdateMOP?businessDate=' + App.dpBusinessDate.getRawValue() + '&MOPName=' + amount.record.data.MOPName + '&diffAmtORCount=' + parseFloat(difference).toFixed(2) + '&AmountORCount=' + count + '&StoreLocationID=' + App.cmbStoreLocations.getValue(), function (data) {
                //sucess:       
                showMessageInformation("Record Sucessfully updated");
                isUpdated = true;
            });

        });  
                
    }

    calculateMopDetailTotal();
    saveMop(true);
}

function getTotalReceivableAmountAndReload() {
    calculateBusinessDayReconTotal();
    saveBussinessIncome();
    calculateBusinessDayReconExpensTotal();
}

var isMopDetailLoaded = false;

function showMopDetailExtjsWindow() {
    if (isMopDetailLoaded == false) {
        preparePopUpWindowDialogOpen("#dialogformMop", null, 400, 250, true, 30, 50);
        $("#dialogformMop").dialog("open");
        loadMopDetailExtJS();
    } else {
        $("#dialogformMop").dialog("open");
        App.dsMopDetail.reload();
        App.dsStoreLocationMop.reload();
        return false;
    }
    isMopDetailLoaded = true;
}

var isAtHandEntryLoaded = false;

function showAtHandEntryExtjsWindow() {
    if (isAtHandEntryLoaded == false) {
        preparePopUpWindowDialogOpen("#dialogformAtHandEntry", null, 400, 200, true, 30, 50);
      
        $("#dialogformAtHandEntry").dialog("open");
    } else {
        $("#dialogformAtHandEntry").dialog("open");
        return false;
    }
    isAtHandEntryLoaded = true;
}

var isPOSVendorPayInPayoutDetail = false;

showPOSVendorPayinDetailExtjsWindow = function () {
    misSummaryCodeID = 6;
    if (isPOSVendorPayInPayoutDetail == false) {
        preparePopUpWindowDialogOpen("#dialogformPosVendorPayout", "POS Vendor PayIn", 500, 430, false, 30, 50);
    
        $("#dialogformPosVendorPayout").dialog("open");
    } else {
        $("#dialogformPosVendorPayout").dialog("open");
        App.dsPosVendorPayout.reload();
        return false;
    }
    isPOSVendorPayInPayoutDetail = true;
}

showPOSVendorPayoutDetailExtjsWindow = function () {
    misSummaryCodeID = 7;
    if (isPOSVendorPayInPayoutDetail == false) {
        preparePopUpWindowDialogOpen("#dialogformPosVendorPayout", "POS Vendor PayIn", 500, 430, false, 30, 50);
   
        $("#dialogformPosVendorPayout").dialog("open");
    } else {
        $("#dialogformPosVendorPayout").dialog("open");
        App.dsPosVendorPayout.reload();
        return false;
    }
    isPOSVendorPayInPayoutDetail = true;
}


var isPOSVendorPayInPayoutDetail = false;

showPOSVendorPayinDetailExtjsWindow = function () {
    misSummaryCodeID = 6;
    if (isPOSVendorPayInPayoutDetail == false) {
        preparePopUpWindowDialogOpen("#dialogformPosVendorPayout", "POS Vendor PayIn", 500, 430, false, 30, 50);
  
        $("#dialogformPosVendorPayout").dialog("open");
        loadPOSVendorPayoutDetailExtJS();
    } else {
        $("#dialogformPosVendorPayout").dialog("open");
        App.dsPosVendorPayout.reload();
        return false;
    }
    isPOSVendorPayInPayoutDetail = true;
}

showPOSVendorPayoutDetailExtjsWindow = function () {
    misSummaryCodeID = 7;
    if (isPOSVendorPayInPayoutDetail == false) {
        preparePopUpWindowDialogOpen("#dialogformPosVendorPayout", "POS Vendor PayIn", 500, 430, false, 30, 50);
    
        $("#dialogformPosVendorPayout").dialog("open");
        loadPOSVendorPayoutDetailExtJS();
    } else {
        $("#dialogformPosVendorPayout").dialog("open");
        App.dsPosVendorPayout.reload();
        return false;
    }
    isPOSVendorPayInPayoutDetail = true;
}

var isFuelGradeSummaryExtWindow = false;

showFuelGradeSummaryExtjsWindow = function () {
    if (isFuelGradeSummaryExtWindow == false) {
        preparePopUpWindowDialogOpen("#dialogfuelGradeSummary", "Service Level Summary", 700, 500, true, 30, 50);
        $("#dialogfuelGradeSummary").dialog("open");
        loadFuelGradeSummaryDetailExtJS();
    } else {
        $("#dialogfuelGradeSummary").dialog("open");
        App.dsFuelGradeSummaryDetail.reload();
        return false;
    }
    isFuelGradeSummaryExtWindow = true;
}

isISMDetailWindowLoaded = false

showISMDetailExtjsWindow = function () {
    if (isISMDetailWindowLoaded == false) {
        preparePopUpWindowDialogOpen("#dialogformISM", null, 900, 500, true, 100, 50);
                                          
        $("#dialogformISM").dialog("open");
        loadISMDetailExtJS();
    } else {
        $("#dialogformISM").dialog("open");
        App.dsDepartmentheader.reload();
        App.dsISMDetail.reload();
        return false;
    }
    isISMDetailWindowLoaded = true;
}

isPayinDetailWindowLoaded = false

addPayInDetailExtjsWindow = function () {
    isNewPayIn = true;
    if (isPayinDetailWindowLoaded == false) {
        preparePopUpWindowDialogOpen("#dialogformPayIn", "Add PayIn", 500, 430, true, 30, 50);
     
        $("#dialogformPayIn").dialog("open");
        loadPayInDetailExtJS();
    } else {
        $("#dialogformPayIn").dialog("open");
        App.dsPayInDetail.reload();
        return false;
    }
    isPayinDetailWindowLoaded = true;
}

showEditPayInDetailExtjsWindow = function () {
    isNewPayIn = false;
    if (isPayinDetailWindowLoaded == false) {
        preparePopUpWindowDialogOpen("#dialogformPayIn", "Add PayIn", 500, 430, true, 30, 50);
     
        $("#dialogformPayIn").dialog("open");
        loadPayInDetailExtJS();
    } else {
        $("#dialogformPayIn").dialog("open");
        App.dsPayInDetail.reload();
        return false;
    }
    isPayinDetailWindowLoaded = true;
}

isPayoutDetailWindowLoaded = false;

showAddVendorPayoutDetailExtjsWindow = function () {
    vendorReconDetailID = 0;
    if (isPayoutDetailWindowLoaded == false) {
        preparePopUpWindowDialogOpen("#dialogformVendorPayout", "Add Payout",750,530);
        $("#dialogformVendorPayout").dialog("open");
        loadVendorPayoutReconDetailExtJS();
       
    } else {
        $("#dialogformVendorPayout").dialog("open");
        App.dsVendorPayoutDetail.reload();
        App.dsPaymentTypePayout.reload();
        return false;
    }
    isPayoutDetailWindowLoaded = true;
}

function deleteMopDetailExtjsSuccess(e, data) {
    var record = App.grdMOPDetails.selModel.getLastSelected();
    App.dsMOPDetails.remove(record);
    App.dsMOPDetails.isDirty(false);
    isAmountRefresh = true;
    calculateMopDetailTotal();
    loadAllStoreData();
    showMessageInformation('Record Deleted');

}

showEditVendorPayoutDetailExtjsWindow = function () {
    if (isPayoutDetailWindowLoaded == false) {
        preparePopUpWindowDialogOpen("#dialogformVendorPayout", "Edit PayOut",750,530);
        $("#dialogformVendorPayout").dialog("open");
        loadVendorPayoutReconDetailExtJS();        
    } else {
        $("#dialogformVendorPayout").dialog("open");
        App.dsVendorPayoutDetail.reload();
        return false;
    }
    isPayoutDetailWindowLoaded = true;
}

var isAmountRefresh = false;

function deletePaymentDetailExtjsSuccess() {
    saveInBusinessTable = true;
    var record = App.grdVenorPaymenRecon.selModel.getLastSelected();
    App.dsVendorPaymentRecon.remove(record);
    App.dsVendorPaymentRecon.isDirty(false);
    isAmountRefresh = true;
    calculateVendorPaymentTotal();
    calculateSales();
    loadAllStoreData();
    showMessageInformation('Record Deleted');

}

function deletePayInExtjsSuccess(a, e, o, z) {
    if (e.data == "0") {
        saveInBusinessTable = true;
        var record = App.gridpayin.selModel.getLastSelected();
        App.dsPayIn.remove(record);
        App.dsPayIn.isDirty(false);
        showMessageInformation('Record Deleted');

        calculateVendorPayinTotal();
        isPayInRefresh = true;

    }
    else {
        showMessageInformation(e.data);
    }
}
var isPayoutandCashRefresh = false;
//Bank Deposit Window
var isBankDepositloaded = false;
var DepAmt;
function showBankDepositWindow() {    
    App.lblStore.setText(App.cmbStoreLocations.getRawValue());
    App.lblDate.setText(App.dpBusinessDate.getRawValue());  
    App.dsPaymentSourceName.reload();
    if (App.txttotBankDeposit.getText() != '') {
        DepAmt = App.txttotBankDeposit.getText();
    }
    else {
        DepAmt = '$' + (parseFloat(Number(App.lblMopCash.getText().replace(/[^0-9\.]+/g, ""))) + parseFloat(Number((App.lblCheck.getText().replace(/[^0-9\.]+/g, ""))))).toFixed(2).toString();
    }
    App.txttBankDepositTotal.setText(DepAmt);
    insertDefalutSourceAmount(DepAmt);
}
var isAddDepositloaded = false;
function AddDeposits() {
    $("#dialogformAddDeposits").dialog("option", "title", "Add Deposits");
    App.lblDepositTitle.setText("Add Deposits");
    App.cmbBanks.setRawValue('');
    App.cmbBanks.setValue('');
    App.txtBankAmount.setValue('');
    showAddDepositsWindow();
}
function EditDeposits() {
    App.lblDepositTitle.setText("Edit Deposits");
    showAddDepositsWindow();
}
function showAddDepositsWindow() {
    CalculateDefaultBankAmt();
    if (isAddDepositloaded == false) {
        preparePopUpWindowDialogOpen("#dialogformAddDeposits", null, 400, 200, true, 30, 50);
        document.getElementById('dialogformAddDeposits').style.visibility = 'visible';
        $("#dialogformAddDeposits").dialog("open");
    } else {
        $("#dialogformAddDeposits").dialog("open");
        return false;
    }
    isAddDepositloaded = true;
    App.dsPaymentSourceName.reload();
}
//here we will have the default Bank Amount
function CalculateDefaultBankAmt() {
    if (App.dsBankDeposits != undefined) {
        App.dsBankDeposits.each(function (rec) {
            if (rec.data.isDefaultSource == true)
                App.txtDefaultBankTotal.setText('$'+rec.data.Amount);
        });
    }
}
function calculateBankDeposits() {
    var DepositAmount = 0;
    App.dsBankDeposits.each(function (rec) {
        DepositAmount += rec.data.Amount;
    });
    if (DepositAmount == null)
        DepositAmount = 0;
    $('#txtDepositAmount').html('$ ' + DepositAmount.toFixed(4));
}
var hasDefaultBank = false;
function insertDefalutSourceAmount(DepAmt) {
    var amount = parseFloat(Number(DepAmt.replace(/[^0-9\.]+/g, "")));
    
    $.get('/DailyReconData/InsertDefaultBankDeposits?movementHeaderID=' + App.lblMovementHeaderID.getText() + '&Amount=' + parseFloat(Number(DepAmt.replace(/[^0-9\.]+/g, ""))) + '&StoreLocationID=' + App.cmbStoreLocations.getValue(), function (data) {
        if (data.data == null) {
            showMessageError('Please Select the Default Bank for this StoreLocation');
        }
        else {
            App.dsBankDeposits.reload();
            if (isBankDepositloaded == false) {
                preparePopUpWindowDialogOpen("#dialogformBankDeposit", null, 440, 500, true, 30, 50);
                document.getElementById('dialogformBankDeposit').style.visibility = 'visible';
                $("#dialogformBankDeposit").dialog("open");
            } else {
                $("#dialogformBankDeposit").dialog("open");
                return false;
            }
            isBankDepositloaded = true;
        }
    });    
}
//Ends

/////ATM Transaction
function showATMReconWin() {
    window.location.href = "/ATMRecon/ATMRecon?storelocationId=" + encodeURIComponent(App.cmbStoreLocations.getValue())
                                              + "&Date=" + encodeURIComponent(App.dpBusinessDate.getRawValue()) + "&StoreName=" + encodeURIComponent(App.cmbStoreLocations.getRawValue());
}
//Ends

var isHouseAccountsloaded = false;
//House Accounts
function showHouseChargeWindow() {
    if (isHouseAccountsloaded == false) {
        preparePopUpWindowDialogOpen("#dialogforHouseAccounts", null, 440, 500, true, 30, 50);
        document.getElementById('dialogforHouseAccounts').style.visibility = 'visible';
        $("#dialogforHouseAccounts").dialog("open");
    } else {
        $("#dialogforHouseAccounts").dialog("open");
        return false;
    }
    isHouseAccountsloaded = true;
}
function changeCreditAmt() {
}
//Ends
