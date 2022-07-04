({
    init: function(cmp, action, helper) {
        var actions = [
            { label: 'Show details', name: 'show_details' },
            { label: 'Edit', name: 'edit' },
            { label: 'Delete', name: 'delete' },
            { label: 'Add Photo', name: 'addPhoto' }
        ]

        cmp.set('v.mycolumns', [
            { label: 'Name', fieldName: 'Name', type: 'text' },
            { label: 'Type', fieldName: 'Family', type: 'text' },
            { label: 'Description', fieldName: 'Description', type: 'text' },
            { label: 'Price', fieldName: 'Price__c', type: 'currency' },
            { label: 'House code', fieldName: 'ProductCode', type: 'text' },
            { type: 'action', typeAttributes: { rowActions: actions } }
        ]);
        var action = cmp.get('c.getProducts');
        helper.getData(cmp, action);
    },

    startSearch: function(cmp, evt, action, helper) {
        var isEnterKey = evt.keyCode === 13;
        if (isEnterKey) {
            var houseName = cmp.find('enter-house-name').get('v.value');

            if (houseName != "") {
                var action = cmp.get('c.getHouseByName');
                action.setParams({ houseName: cmp.find('enter-house-name').get('v.value') });
            } else {
                var action = cmp.get('c.getProducts');
            }

            action.setCallback(this, $A.getCallback(function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    cmp.set('v.mydata', response.getReturnValue());
                } else if (state === "ERROR") {
                    var errors = response.getError();
                    console.error(errors);
                }
            }));
            $A.enqueueAction(action);
        }
    },

    handleRowAction: function(cmp, event, helper) {
        var list = cmp.get('v.selectedRows');
        var action = event.getParam('action');
        var row = event.getParam('row');
        switch (action.name) {
            case 'show_details':
                list.push(row);
                cmp.set('v.selectedRows', []);
                helper.viewRow(cmp, row);
                break;
            case 'edit':
                cmp.set('v.selectedRowsToEdit', []);
                helper.editRow(cmp, row);
                break;
            case 'delete':
                cmp.set('v.selectedRows', []);
                helper.deleteRow(cmp, row);
                break;
            case 'addPhoto':
                cmp.set('v.selectedRows', []);
                helper.relatedList(cmp, row);
        }
    },

    newHouse: function(component, event, helper) {
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "Product2"
        });
        createRecordEvent.setParam("navigationLocation", "LOOKUP");
        createRecordEvent.setParam("panelOnDestroyCallback", function callbackWrapper() {
            location.reload();
        });
        createRecordEvent.fire();
    },

    clear: function(cmp, evt, helper) {
        cmp.set('v.selectedRows', []);
        cmp.find('enter-house-name').set('v.value', '');
        var action = cmp.get('c.getHouseByName');
        action.setParams({ houseName: '' });
        helper.getData(cmp, action);
    },

    closeModal: function(cmp) {
        cmp.set('v.variant1', false);
    },

    // handleUploadFinished: function(cmp, event) {
    //     // Get the list of uploaded files
    //     var uploadedFiles = event.getParam("files");
    //     alert("Files uploaded : " + uploadedFiles.length);

    //     // Get the file name
    //     uploadedFiles.forEach(file => console.log(file.name));
    // },

    // handleSuccess: function(component, event, helper) {
    //     component.find('notifLib').showToast({
    //         "variant": "success",
    //         "title": "Account Created",
    //         "message": "Record ID: " + event.getParam("id")
    //     });
    // }
})