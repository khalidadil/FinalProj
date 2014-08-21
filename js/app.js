Parse.initialize("Zdl9nQV8OaKVLp8EzuG44WAOscAmyXpNzNuh4xWq", "WiTKSblivgBluZJBqbiaNvsfRGyYFnbpL6SFf1PL");

var Category = Parse.Object.extend("Categorization", {
    defaults: {
        category: " ",
        related: " "
    },
    initialize: function() {
        console.log("Category MODEL YO!");
    }
});

var CategoryListing = Parse.Collection.extend({
    model: Category, // you will create a view and a model to show in the HTML
    initialize: function() {
        console.log("Category COLLECTIONS YO!");
    }
});

var AppView = Parse.View.extend({
    initialize: function(header_template_url, sidebar_template_url, category, section) {
        console.log("Category VIEW YO!");
        this.category = category;
        this.section = section;
        self = this;

        console.log(this.category);
        this.listing = new CategoryListing();
        // this.listing.query = new Parse.Query(CategoryListing);
        // this.listing.query.exists("category");

        this.pullDataFill(header_template_url, sidebar_template_url, category, section);
    },
    pullDataFill: function(header_template, sidebar_template, category, section) {
        self = this;
        $.when(this.listing.fetch(), this.getTemplate(header_template), this.getTemplate(sidebar_template)).then(function(dataPromise, headerTemplatingFn, sidebarTemplatingFn) {
            dataPromise.then(function(collection) {
                // console.log("Category collection (collection)?");
                console.log(collection);

                this.justCategories = [];
                this.mappedData = [];

                _.each(collection.models, function(models) {
                    this.justCategories.push(models.attributes.category);
                });

                if (!category) {
                    category = this.justCategories[0].toLowerCase();
                }

                capitalCategory = category.charAt(0).toUpperCase() + category.slice(1);
                var categoryLoc = this.justCategories.indexOf(capitalCategory);

                this.justSubCategories = _.zip.apply(_, collection.models[categoryLoc].attributes.related)[0];
                if (!section) {
                    section = this.justSubCategories[0];
                    window.location = '#' + category + '/' + section.replace(' ', '_').toLowerCase();
                }

                this.justToolTags = _.zip.apply(_, collection.models[categoryLoc].attributes.related)[1];

                console.log(this.justCategories);
                console.log(this.justSubCategories);
                console.log(this.justToolTags);

                /*var justAttributes = _.map(collection.models, function(model) {
                    return _.extend({}, model.attributes, {
                        id: model.id
                    });
                });

                console.log(justAttributes);*/

                self.render({
                    categories: this.justCategories
                }, headerTemplatingFn, '.categories ul');
                self.render({
                    cat: category,
                    subcats: this.justSubCategories
                }, sidebarTemplatingFn, '.sidebar');
                var myTool = new ToolView("./templates/tool.tmpl", category, section, this.justToolTags);
            })
        });
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
    template: function(url) {
        return $.get(url).then(function(html) {
            return _.template(html);
        });
    },
    render: function(attributes, templatingFn, htmlAttach) {
        var self = this;
        console.log(attributes);

        var myHTML = "";

        myHTML += templatingFn(attributes);

        $(htmlAttach).html(myHTML);
    }
});

AppView.prototype.dataCache = {};
AppView.prototype.viewTemplateCache = {};

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
        console.log("Tool MODEL YO!");
    }
});

var ToolListing = Parse.Collection.extend({
    model: Tool, // you will create a view and a model to show in the HTML
    initialize: function() {
        console.log("Tool COLLECTIONS YO!");
    }
});

var ToolView = Parse.View.extend({
    initialize: function(template_url, category, subcategory, toolTags) {
        console.log("VIEWS YO!");

        self = this;

        this.listing = new ToolListing();
        this.listing.query = new Parse.Query(Tool);
        // console.log(this.listing.query);
        
        category = category.charAt(0).toUpperCase() + category.slice(1);
        // subcategory = subcategory.charAt(0).toUpperCase() + subcategory.slice(1);
        subcategory = subcategory.replace("_", " ");
        console.log(subcategory);
        this.listing.query.equalTo("category", category);
        this.listing.query.equalTo("subcategory", subcategory);

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
        $.when(this.getData(url), this.getTemplate(url)).then(function(dataPromise, templatingFn) {
            dataPromise.then(function(collection) {

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
    render: function(attributes, templatingFn) {
        var self = this;
        var myHTML = "";

        _.forEach(attributes, function(attribute_obj) {
            myHTML += templatingFn(attribute_obj);
        });

        $('.results').html(myHTML);
    }
});

ToolView.prototype.dataCache = {};
ToolView.prototype.viewTemplateCache = {};


var Router = Parse.Router.extend({
    routes: {
        "": "sectionview",
        "all": "all",
        "edit": "all",
        "add": "add",
        "hotnfresh": "hotnfresh",
        "edit/:listing": "edit",
        ":category": "sectionview",
        ":category/:section": "sectionview"
    },
    header_template_url: "./templates/header.tmpl",
    sidebar_template_url: "./templates/sidebar.tmpl",
    /*all: function() {
        console.log("ALL OF THEM YO!");
        this.view = new AppView(header_template_url, sidebar_template_url);
        // this.view = new ToolView("./templates/tool.tmpl");
    },

    categoryview: function(category) {
        console.log("CATEGORIES YO!");
        console.log(category);
        this.view = new ToolView("./templates/tool.tmpl", category);
    },*/

    sectionview: function(category, section) {
        console.log("CATEGORIES AND SECTIONS!");
        /*if (!category) {
            window.location = '#planning';
            console.log("NO CATEGORY");
        }*/
        this.view = new AppView(this.header_template_url, this.sidebar_template_url, category, section);
        // this.view = new ToolView("./templates/tool.tmpl", category, section);
    },

    add: function() {
        console.log("ADDING COOL STUFF!");
        // this.view = new ModifyData("./templates/modify.tmpl", 'a'); NEEDS TO BE REPLACED
    },

    edit: function(listing) {
        console.log("UMM THIS DOESN'T LOOK RIGHT....");
        // this.view = new ModifyData("./templates/modify.tmpl", 'e', listing); NEEDS TO BE REPLACED
    }

});

$(function() {
    var stackRouter = new Router();
    Parse.history.start();
})
