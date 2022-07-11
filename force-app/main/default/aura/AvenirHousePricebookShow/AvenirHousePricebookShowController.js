({

    init: function(cmp, evt, helper) {
        var actions = [
            { label: 'Edit Pricebook', name: 'edit_pricebook' },
            { label: 'Edit Discount', name: 'edit_discount' },
            { label: 'Delete', name: 'delete' }
        ]

        cmp.set('v.mycolumns', [
            { label: 'Name', fieldName: 'Name', type: 'text' },
            { label: 'Description', fieldName: 'Description', type: 'text' },
            { label: 'Active', fieldName: 'IsActive', type: 'curretextncy' },
            { type: 'action', typeAttributes: { rowActions: actions } }
        ]);
        var action = cmp.get('c.getAllPricebook');
        helper.getData(cmp, action);
    },

    handleRowAction: function(cmp, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');
        switch (action.name) {
            case 'edit_pricebook':
                cmp.set('v.pricebookId', row.Id);
                cmp.set('v.editPricebook', true);
                cmp.set('v.table', false);
                break;
            case 'edit_discount':
                cmp.set('v.editDiscount', true);
                cmp.set('v.table', false);
                cmp.set('v.selectedRows', []);
                helper.editDiscount(cmp, row);
                break;
            case 'delete':
                cmp.set('v.selectedRows', []);
                helper.deleteRow(cmp, row);
                break;
        }
    },

    closeModal: function(cmp, evt) {
        cmp.set('v.editPricebook', false);
        cmp.set('v.editDiscount', false);
        cmp.set('v.table', true);
        var closeModalAttribute = false;
        var parentCmp = cmp.get('v.parent');
        parentCmp.closeModalEvent(closeModalAttribute);

    },

    returnToTable: function(cmp) {
        cmp.set('v.editPricebook', false);
        cmp.set('v.editDiscount', false);
        cmp.set('v.table', true);
        $A.enqueueAction(cmp.get('c.init'));
    },

    handleSuccess: function(cmp, evt, helper) {
        $A.enqueueAction(cmp.get('c.returnToTable'));
        $A.enqueueAction(cmp.get('c.init'));
        helper.showSuccessToast(cmp, evt, helper, 'success', 'record updated successfully');
    },

    handleSaveEdition: function(cmp, evt, helper) {
        var draftValues = evt.getParam('draftValues');
        var firstList = cmp.get('v.mydata');

        const listToUpdate = [];
        draftValues.forEach(element => {
            const obj = firstList.find(firstList => element.Name == firstList.Name);
            const editingObj = {
                Id: obj.Id,
                Name: obj.Name,
                Pricebook2Id: obj.Pricebook2Id,
                Product2Id: obj.Product2Id,
                UnitPrice: element.UnitPrice
            };
            listToUpdate.push(editingObj);
        });
        var action = cmp.get('c.updatePricebookEntry');
        action.setParams({ priceUpdate: listToUpdate });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                helper.showSuccessToast(cmp, 'success', 'record updated successfully');
            } else if (state === "ERROR") {
                console.log(state);
                helper.showSuccessToast(cmp, 'error', 'please try again');
            }
        });
        $A.enqueueAction(action);
    }
})