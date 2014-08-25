//    ____  __    ____ 
//   / __ \/ /   / __ \
//  / / / / /   / / / /
// / /_/ / /___/ /_/ / 
// \____/_____/_____/  

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

header.tmpl < ul >
    < a href = "#all" > < li > All < /li></a >
    < a href = "#planning" > < li > Planning < /li></a >
    < a href = "#polish" > < li > Polish < /li></a >
    < a href = "#code" > < li > Code < /li></a >
    < a href = "#release" > < li > Release < /li></a >
    < a href = "#upkeep" > < li > Upkeep < /li></a >
    < a href = "#add" > < li > +Add < /li></a >
    < /ul>

/ / testing zipping
var justSubCategories = _.chain(collection.models).each(function(models) {
    console.log('models');
    return models.attributes.related;
}).each(function(related) {
    console.log('related');
    console.log(related);
    return related;
}).zip().value();

var justSubCategories = _.map(collection.models.attributes, function(attr) {
    return _.extend({}, attr.related, {
        category: attr.category
    });
});

var justSubCategories = _.chain(collection.models).each(function(models) {
    return _.flatten(models.attributes);
}).value();

// testing mapping data
for (loc in this.justCategories) {
    this.mappedData.push([
        [this.justCategories[loc]], _.zip(_.zip.apply(_, collection.models[loc].attributes.related)[0], _.zip.apply(_, collection.models[loc].attributes.related)[1])
    ]);
}
console.log(this.mappedData);

//original render function for AppView
self.render2(justAttributes, headerTemplatingFn, '.categories ul');
render2: function(attributes, templatingFn, htmlAttach) {
    var self = this;
    console.log(attributes);

    var myHTML = "";

    _.forEach(attributes, function(attribute_obj) {
        myHTML += templatingFn(attribute_obj);
    });

    $(htmlAttach).html(myHTML);
}

//old tool template
<div class="content" id="<%= id %>">
    <a href="http://<%= website %>"><div class="toolname"><p><%= name %></p></div></a>
    <div class="category"><p><%= category %></p></div>
    <div class="tags"><p><%= tags %></p></div>
    <div class="karmic"><p><%= karmic %></p></div>
    <div class="platform"><p><%= platform %></p></div>
    <div class="edit"><a href = "#edit/<%= id %>"><p>Edit</p></a></div>
</div>


all: function() {
    console.log("ALL OF THEM YO!");
    this.view = new AppView(header_template_url, sidebar_template_url);
    // this.view = new ToolView("./templates/tool.tmpl");
}

categoryview: function(category) {
    console.log("CATEGORIES YO!");
    console.log(category);
    this.view = new ToolView("./templates/tool.tmpl", category);
}

//old Routing
this.view = new ToolView("./templates/tool.tmpl", category, section);
this.view = new ModifyData("./templates/modify.tmpl", 'a'); 

//price Dropdown
<dl class="priceDropdown">
        <dt>
            <a href="#">
                <span class="label">Price</span>
                <p class="multiSel"></p>
            </a>
        </dt>

        <dd>
            <div class="mutliSelect">
                <ul>
                    <li><input type="checkbox" name="price[]" value="Free" />Free</li>
                    <li><input type="checkbox" name="price[]" value="Freemium" />Freemium</li>
                    <li><input type="checkbox" name="price[]" value="Paid" />Paid</li>
                </ul>
            </div>
        </dd>
    </dl>



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
// 
// 


var Categorization = Parse.Object.extend("Categorization");
var categories = new Categorization();
categories.save({
category: "Planning",
related: [["Wireframing", ["Tools, Elements"]],
             ["Personas", [""]],
             ["Storyboarding", [""]],
             ["Scheduling", [""]],
             ["Inspiration", [""]],
             ["Design Patterns", [""]],
             ["Client Communication", [""]],
             ["Team Communication", [""]]]
}, {
    success: function(object) {
        // put what happens on success here
    },
    error: function(model, error) {
        // put what happens on error here
    }
});

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
