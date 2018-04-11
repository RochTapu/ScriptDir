/**
 * Copyright NetSuite, Inc. 2014 All rights reserved. 
 * The following code is a demo prototype. Due to time constraints of a demo,
 * the code may contain bugs, may not accurately reflect user requirements 
 * and may not be the best approach. Actual implementation should not reuse 
 * this code without due verification.
 * 
 * (Module description here. Whole header length should not exceed 
 * 100 characters in width. Use another line if needed.)
 * 
 * Version    Date            Author           Remarks
 * 1.00       31 May 2016     rtapulado
 * 
 */
{
	var FLD_PART_NUMBER = 'custcol_rt_part_number';
	var ID_TAX_SCHEDULE = 1;

}

/**
 * @param {String} type Operation types: create, edit, view, copy, print, email
 * @param {nlobjForm} form Current form
 * @param {nlobjRequest} request Request object
 * @return {void}
 */
function createItemAfterSubmit(type, form, request){
	if(nlapiGetRecordType() == 'estimate'){
		if(type == 'create' || type == 'edit'){
			var nLines = nlapiGetLineItemCount('item');
			
			for(var i = 1; i<= nLines; i++){
				var sItem = nlapiGetLineItemValue('item', FLD_PART_NUMBER, i);
				var sDesc = nlapiGetLineItemValue('item', 'description', i);
				var bExist = checkExisting(sItem);
				if(!bExist){
					var recItem = nlapiCreateRecord('inventoryitem');
		            recItem.setFieldValue('itemid', sItem);
		           // recItem.setFieldValue('taxschedule', ID_TAX_SCHEDULE);
					recItem.setFieldValue('purchasedescription', sDesc);
		            recItem.setFieldValue('description', sDesc);
		            /*recItem.setFieldValue('cogsaccount', 121);
		            recItem.setFieldValue('assetaccount', 120);
		            recItem.setFieldValue('incomeaccount', 55);*/
					
					try{
						var idItem =  nlapiSubmitRecord(recItem);
						nlapiLogExecution("error","idItem",idItem);
					}catch(e){
						nlapiLogExecution("error","error",e.message);
					}
				}

			}
		}
	}


	
}

function loadItemsBeforeLoad(type, form, request){
	if(nlapiGetRecordType() == 'salesorder'){
		if(type == 'create' || type == 'edit'){
			var nLines = nlapiGetLineItemCount('item');
			alert('nlines ' + nLines);
			

		}
	}


	
}




function checkExisting(sMatchedValue){
	var aSearchFilters =  new Array();  
    aSearchFilters.push(new nlobjSearchFilter('itemid',null,'is',sMatchedValue));

    var aResults = nlapiSearchRecord('item', null, aSearchFilters);
    if(aResults){
        for(var i = 0; i < aResults.length; i++ ){
        	return aResults[i].getId();
        }
    }
    return null;
}

/**
 * 
 * @param sData
 * @returns true if data supplied is null/empty otherwise false
 */
function isNullOrEmpty(sData){
    return ((sData=='') || (sData==null) || (typeof(sData)=='undefined'))?true:false;
}