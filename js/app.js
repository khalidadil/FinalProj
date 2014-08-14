Parse.initialize("Zdl9nQV8OaKVLp8EzuG44WAOscAmyXpNzNuh4xWq", "WiTKSblivgBluZJBqbiaNvsfRGyYFnbpL6SFf1PL");

var Tool = Parse.Object.extend("WebTools", {
    defaults: {
        objectId: " ",
        name: " ",
        category: " ",
        tags: " ",
        karmic: " ",
        platform: " ",
        modify: " "
    },
    initialize: function() {
        console.log("TOOL YO!");
    }
});

var ToolListing = Parse.Collection.extend({
    model: Tool, // you will create a view and a model to show in the HTML
    initialize: function() {
        console.log("COLLECTIONS YO!");
    }
    /*,
    // parse: function(data) {
    //     console.log("parsin away");
    //     return data.models;
    // }
    /*,
    done: function(tool) {
        return tool;
    }*/
});

var ToolView = Parse.View.extend({
    initialize: function(template_url, category) {
        console.log("VIEWS YO!");

        console.log(this.dataCache);
        console.log(this.viewTemplateCache);
        self = this;

        this.listing = new ToolListing();
        this.listing.query = new Parse.Query(Tool);
        // console.log(this.listing.query);
        if (category) {
            category = category.charAt(0).toUpperCase() + category.slice(1);
            this.listing.query.equalTo("category", category);
        }
        this.pullDataFill(template_url);
    },
    tagName: 'div',
    className: 'content',
    getData: function(url) {
        self = this;
        return this.listing.fetch();
    },
    getTemplate: function(url) {
        self = this;
        if (this.viewTemplateCache[url]) {
            console.log("template cached");
            var p = $.Deferred();
            p.resolve(this.viewTemplateCache[url]);
            return p;
        } else {
            console.log("template not cached");
            return $.when(this.template(url)).then(function(templatingFn) {
                self.viewTemplateCache[url] = templatingFn;
                return templatingFn;
            });
        }
    },
    pullDataFill: function(url) {
        //always use $.when!
        //

        /*$.when(
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
        });*/
        $.when(this.getData(url), this.getTemplate(url)).then(function(dataPromise, templatingFn) {
            dataPromise.then(function(collection) {

                var justAttributes = _.map(collection.models, function(model) {
                    return _.extend({}, model.attributes, {
                        id: model.id
                    });
                });

                // console.log(justAttributes);

                self.render(justAttributes, templatingFn);
            })
        });

    },
    template: function(url) {
        return $.get(url).then(function(html) {
            return _.template(html);
        });
    },
    render: function(attributes, templatingFn) {
        var self = this;
        $.get("/templates/header.tmpl").then(function(header) {
            $('.categories').html(header);

            var myHTML = "";

            _.forEach(attributes, function(attribute_obj) {
                myHTML += templatingFn(attribute_obj);
            });

            $('.results').html(myHTML);
        });
    }
    /*,
    validate: function(attributes) {
        console.log("validate");
    },
    events: {

    }*/
});

ToolView.prototype.dataCache = {};
ToolView.prototype.viewTemplateCache = {};

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

var Router = Parse.Router.extend({
    routes: {
        "": "all",
        "all": "all",
        "edit": "all",
        "add": "add",
        "hotnfresh": "hotnfresh",
        "edit/:listing": "edit",
        ":category": "categoryview",
        ":category/:section": "sectionview"
    },

    all: function() {
        console.log("ALL OF THEM YO!");
        this.view = new ToolView("./templates/tool.tmpl");
    },

    categoryview: function(category) {
        console.log("CATEGORIES YO!");
        console.log(category);
        this.view = new ToolView("./templates/tool.tmpl", category);
    },

    sectionview: function(category, section) {
        console.log("CATEGORIES AND SECTIONS!");
        this.view = new ToolView("./templates/tool.tmpl", category, section);
    },

    add: function() {
        console.log("ADDING COOL STUFF!");
        this.view = new ModifyData("./templates/modify.tmpl", 'a');
    },

    edit: function(listing) {
        console.log("UMM THIS DOESN'T LOOK RIGHT....");
        this.view = new ModifyData("./templates/modify.tmpl", 'e', listing);
    }

});

$(function() {
    // window.dataCache = {};

    var stackRouter = new Router();
    Parse.history.start();
})


//     ___________   ______  ____  ______
//    /  _/ ____/ | / / __ \/ __ \/ ____/
//    / // / __/  |/ / / / / /_/ / __/   
//  _/ // /_/ / /|  / /_/ / _, _/ /___   
// /___/\____/_/ |_/\____/_/ |_/_____/   

// var Categorization = Parse.Object.extend("Categorization");
// var categories = new Categorization();
// categories.save({
/*category: "Planning",
    related: [["Wireframing", ["Tools, Elements"]],
             ["Personas", [""]],
             ["Storyboarding", [""]],
             ["Scheduling", [""]],
             ["Inspiration", [""]],
             ["Design Patterns", [""]],
             ["Client Communication", [""]],
             ["Team Communication", [""]]]*/

/*category: "Polish",
    related: [["Color", ["Pickers, Palette Generators"]],
             ["Fonts", ["Desktop, Web"]],
             ["Icons", ["Font, Web"]],
             ["Images", ["Patterns, Textures, Vectors, PSDs, Stock Photos"]]]*/

/*category: "Code",
    related: [["Editors", [""]],
             ["Bug Reporting", [""]],
             ["Versioning", [""]],
             ["Preprocessors", ["CSS, HTML"]],
             ["APIs", [""]],
             ["MVC Frameworks", [""]],
             ["Code Prototypers", [""]],
             ["Virtual Environments", [""]],
             ["Generators", [""]],
             ["Boilerplate", [""]],
             ["Templates", ["Bootstrap, Foundation, WordPress"]],
             ["Documentation", [""]],
             ["Browser Testing", [""]],
             ["Code Validation", [""]],
             ["Code Testing", ["Framework, Assertion Library"]],
             ["Task Runners", [""]]]*/

/*category: "Release",
    related: [["CDNs", [""]],
             ["Web Hosts", [""]],
             ["Optimizers", ["HTML, CSS, Images"]],
             ["SEO Tools", [""]]]*/

// category: "Upkeep",
// related: [["Feedback", [""]],
//          ["Link Checkers", [""]],
//          ["Analytics", [""]]]

// related: [{subcategory: "Wireframing", tags: ["Tools, Elements"]}, 
//           {subcategory: "Personas", tags: [""]},
//           {subcategory: "Storyboarding", tags: [""]},
//           {subcategory: "Scheduling", tags: [""]},
//           {subcategory: "Inspiration",  tags: [""]},
//           {subcategory: "Design Patterns",  tags: [""]},
//           {subcategory: "Client Communication",  tags: [""]},
//           {subcategory: "Team Communication"], tags: [""]}]
// }, {
//     success: function(object) {
//         // put what happens on success here
//     },
//     error: function(model, error) {
//         // put what happens on error here
//     }
// });

// Ensure that we create a user for the client
/*if (!Parse.User.current()) {
    // Since there is no login view, we just generate a username and password
    var username = Math.random().toString(36).substring(7);
    var password = Math.random().toString(36).substring(7);

    // Sign them up and secure the user
    Parse.User.signUp(username, password, {
        ACL: new Parse.ACL()
    }, {
        success: function(user) {
            start();
        }
    });
}*/
