var ModifyData = Parse.View.extend({
    initialize: function(template_url, state, listing) {
        console.log("MODIFCATION YO!");
        console.log(this.$el);
        self = this;

        // this.listing = new ToolListing;
        // this.listing.query = new Parse.Query(Tool);
        // console.log(this.listing.query);
        // if (category) {
        //     category = category.charAt(0).toUpperCase() + category.slice(1);
        //     this.listing.query.equalTo("category", category);
        // }
        // this.pullDataFill(template_url);
        event.preventDefault();
        if (state === 'a') {
            this.$el.find('.categories').html('<h1>Add Data</h1><ul><li class="cancel">Cancel</li></ul>');
            this.add();
        } else {
            $('.categories').html('<h1>Edit Data</h1>');
            this.edit(listing, template_url);
            this.saveEdits();
        };
    },
    tagName: 'div',
    className: 'content',
    add: function() {
        $('.categories').after("<div class='addForm'></div>");
    },
    edit: function(listingID, url) {
        // console.log('filling form');
        $('.addForm').remove();
        this.listing = new ToolListing;
        this.listing.query = new Parse.Query(Tool);
        console.log(listingID);
        this.listing.query.equalTo("objectId", listingID);

        $.when(this.listing.fetch(), this.template(url)).then(function(dataPromise, templatingFn) {
            dataPromise.then(function(model) {
                console.log(templatingFn);
                // console.log(model.models[0].attributes.category);

                var justAttributes = _.map(model.models, function(model) {
                    return _.extend({}, model.attributes, {
                        id: model.id
                    });
                });

                self.render(listingID, justAttributes, templatingFn);
            });

            // $('#' + listingID).html('<form id = ' + listingID +'form> </form>');
            //     // console.log(model.category);
            // $('#' + listingID + 'form').html('<div class="toolname"><input type="text" name="toolname_edit" value="' + model.models[0].attributes.name + '"></div>');
        });
    },
    pullDataFill: function(url) {
        //always use $.when!
        $.when(
            this.listing.fetch(),
            this.template(url)
        ).then(function(dataPromise, templatingFn) {
            //pulling out our collection from the returned data promise
            dataPromise.then(function(collection) {

                //making sure we have our ID with the model.attributes
                var justAttributes = _.map(collection.models, function(model) {
                    return _.extend({}, model.attributes, {
                        id: model.id
                    });
                });

                self.render(justAttributes, templatingFn);

            })
        });
    },
    template: function(url) {
        return $.get(url).then(function(html) {
            return _.template(html);
        });
    },
    render: function(listingID, attributes, templatingFn) {
        var self = this;
        // var myHTML = "";
        console.log(listingID);
        // console.log(attributes[0]);

        myHTML = templatingFn(attributes[0]);

        $('#' + listingID).html(myHTML);
    },
    saveEdits: function(listingID) {
        $('#' + listingID + 'form').submit(function(ev) {
            // get all the inputs into an array.
            console.log('submitted form!');
            var $inputs = $('.editForm :input');

            // not sure if you wanted this, but I thought I'd add it.
            // get an associative array of just the values.
            var values = {};
            $inputs.each(function() {
                values[this.name] = $(this).val();
                console.log(values[this.name]);
            });
            return false;
        });
    },
    events: {
        'click .cancel': "takeback",
    },

    takeback: function() {
        // location.hash = '';
        window.history.back();
        console.log('test');
    }
    /*validate: function(attributes) {
        console.log("validate");
    },*/
});