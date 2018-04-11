/**
 * Copyright NetSuite, Inc. 2016 All rights reserved. 
 * The following code is a demo prototype. Due to time constraints of a demo,
 * the code may contain bugs, may not accurately reflect user requirements 
 * and may not be the best approach. Actual implementation should not reuse 
 * this code without due verification.
 * 
 * (Module description here. Whole header length should not exceed 
 * 100 characters in width. Use another line if needed.)
 * 
 * Version    Date            Author           Remarks
 * 1.00       8 Jun 2016     rtapulado
 * 
 */
{
	var FLD_PART_NUMBER = 'custcol_rt_part_number';
	var ID_TAX_SCHEDULE = 1;

}

function populateItemsPageInit(type){
	if(nlapiGetRecordType() == 'salesorder'){
		//alert(nlapiGetFieldValue('createdfrom'));
		
		var nLines = nlapiGetLineItemCount('item');
		
		/*for(var i=1; i<= nLines; i++){
			//alert(nlapiGetCurrentLineItemValue('item', 'item'));
			//nlapiGetCurrentLineItemValue(type, fldnam)
			nlapiRemoveLineItem('item', i);
		}
		*/
		var recQuote = nlapiLoadRecord('estimate', nlapiGetFieldValue('createdfrom'));
		var nQuoteLines = recQuote.getLineItemCount('item');
		
		for(var i=1; i<= nQuoteLines; i++){
			var sItem = recQuote.getLineItemValue('item', FLD_PART_NUMBER, i);
			var idItem = checkExisting(sItem);
			if(idItem){
				nlapiSelectNewLineItem('item');
				nlapiSetCurrentLineItemValue('item', 'item', idItem,true,true);
				nlapiSetCurrentLineItemValue('item', 'price', -1);
				nlapiSetCurrentLineItemValue('item', 'rate', 10);
				nlapiSetCurrentLineItemValue('item', 'quantity', 1);
				nlapiCommitLineItem('item');
				nlapiCommitLineItem('item');
		        nlapiSelectNewLineItem('item');
		        setTimeout(function(){nlapiCancelLineItem(SL_ITEM);}, 500);
				
			}
			

		}		

	}
	
	
}
function populateItemsLineValidate(type){
	if(nlapiGetRecordType() == 'salesorder'){
		nlapiGetCurrentLineItemValue('item', 'item');
		
	
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