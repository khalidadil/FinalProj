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
    initialize: function(template, category) {
        console.log("VIEWS YO!");
        self = this;

        var listing = new ToolListing;
        listing.query = new Parse.Query(Tool);
        console.log(listing.query);
        if (category) {
            category = category.charAt(0).toUpperCase() + category.slice(1);
            listing.query.equalTo("category", category);
        }

        listing.fetch({
            success: function(pulledData) {
                // console.log(pulledData);
                var pulledDataArray = [].slice.call(pulledData.models);
                var myHTML = " ";

                pulledDataArray.forEach(function(data) {
                    // console.log(data);
                    self.render(data, template).then(function(pulled) {
                        myHTML += pulled;
                        $('.results').html(myHTML);
                    });
                });
            },
            error: function(myObject, error) {
                console.log("failed to get data");
            }
        });
    },
    tagName: 'div',
    className: 'content',
    render: function(data, url) {
        var self = this;
        var importantData = _.extend({}, data); //passing model attributes to our view
        var myHTML = "";

        return this.template(importantData, url).then(function(output) {
            // console.log(self.$el.html(output)[0]);
            // myHTML += self.$el.html(output)[0];
            return self.$el.html(output)[0].innerHTML;
        });
    },
    template: function(data, url) {
        return $.get(url).then(function(template) {
            var findVariables = _.template(template);
            return findVariables(data);
        });
    }
    /*,
    validate: function(attributes) {
        console.log("validate");
    },
    events: {

    }*/
});

// var ModifyData = Parse.View.extend({
//     initialize: function(template, category, section, id) {
//         console.log("VIEWS YO!");
//         self = this;

//         var listing = new ToolListing;
//         listing.query = new Parse.Query(Tool);
//         console.log(listing.query);
//         if (category) {
//             category = category.charAt(0).toUpperCase() + category.slice(1);
//             listing.query.equalTo("category", category);
//         }

//         listing.fetch({
//             success: function(pulledData) {
//                 var pulledDataArray = [].slice.call(pulledData.models);
//                 // console.log(pulledDataArray);

//                 var myHTML = " ";

//                 pulledDataArray.forEach(function(data) {
//                     self.render(data, template).then(function(pulled) {
//                         console.log(pulled);
//                         myHTML += pulled;
//                         // console.log(myHTML);
//                         $('.results').html(myHTML);
//                     });
//                 });
//             },
//             error: function(myObject, error) {
//                 console.log("failed to get data");
//             }
//         });/*.then(function(pulledData) {

//         })*/
//     },
//     tagName: 'div',
//     className: 'content',
//     render: function(data, url) {
//         var self = this;
//         var importantData = _.extend({}, data.attributes); //passing model attributes to our view
//         var myHTML = "";

//         return this.template(importantData, url).then(function(output) {
//             // console.log(self.$el.html(output)[0]);
//             // myHTML += self.$el.html(output)[0];
//             return self.$el.html(output)[0].innerHTML;
//         });
//     },
//     template: function(data, url) {
//         return $.get(url).then(function(template) {
//             var findVariables = _.template(template);
//             return findVariables(data);
//         });
//     }
// });

var Router = Parse.Router.extend({
    routes: {
        "": "all",
        "all": "all",
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
        // this.view = new ModifyData("./templates/modify.tmpl");
    },

    edit: function(listing) {
        console.log("UMM THIS DOESN'T LOOK RIGHT....");
        console.log(listing);
        // this.view = new ModifyData("./templates/modify.tmpl", listing);
    }

});

$(function() {
    var stackRouter = new Router();
    Parse.history.start();
})


//     ___________   ______  ____  ______
//    /  _/ ____/ | / / __ \/ __ \/ ____/
//    / // / __/  |/ / / / / /_/ / __/   
//  _/ // /_/ / /|  / /_/ / _, _/ /___   
// /___/\____/_/ |_/\____/_/ |_/_____/   

// var WebTools = Parse.Object.extend("WebTools");
// var oneTool = new WebTools();
// oneTool.save({
//     name: "Toolname",
//     website: "www.google.com",
//     category: "Planning",
//     tags: ["Tools"],
//     karmic: ["Education", "Nonprofit"],
//     platform: ["Desktop", "Web", "Mobile"]
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
