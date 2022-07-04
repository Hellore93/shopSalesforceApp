({
    getData: function(cmp, action) {
        action.setCallback(this, $A.getCallback(function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                // console.log(response.getState());
                cmp.set('v.mydata', response.getReturnValue());
            } else if (state === "ERROR") {
                var errors = response.getError();
                console.error(errors);
            }
        }));
        $A.enqueueAction(action);
    },

    deleteRow: function(cmp, row) {
        var action = cmp.get("c.deleteHouse");
        action.setParams({
            "house": row
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var rows = cmp.get('v.mydata');
                var rowIndex = rows.indexOf(row);
                rows.splice(rowIndex, 1);
                cmp.set('v.mydata', rows);
            } else if (state === "ERROR") {
                // handle error
            }
        });
        $A.enqueueAction(action);
    },

    editRow: function(cmp, row) {
        var rows = cmp.get('v.mydata');
        var rowIndex = rows.indexOf(row);

        var editRecordEvent = $A.get("e.force:editRecord");
        editRecordEvent.setParams({
            "recordId": rows[rowIndex].Id
        });
        editRecordEvent.fire();

    },

    viewRow: function(cmp, row) {
        var rows = cmp.get('v.mydata');
        var rowIndex = rows.indexOf(row);
        cmp.set('v.variant1', true);
        cmp.set('v.productId', rows[rowIndex].Id);

        var action = cmp.get("c.getProductPhoto")
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log(response.getReturnValue());
                cmp.set('v.photoList', response.getReturnValue());
            } else if (state === "ERROR") {
                var errors = response.getError();
                console.error(errors);
            }
        });
        action.setParams({ productId: rows[rowIndex].Id });
        $A.enqueueAction(action);
    },

    relatedList: function(cmp, row) {
        var rows = cmp.get('v.mydata');
        var rowIndex = rows.indexOf(row);
        var urlEvent = $A.get("e.force:navigateToURL");
        var urlString = 'https://britenet93-dev-ed.lightning.force.com/lightning/r/AttachedContentDocument/' + rows[rowIndex].Id +
            '/related/AttachedContentDocuments/view'
        urlEvent.setParams({
            "url": urlString
        });
        urlEvent.fire();
    }

})