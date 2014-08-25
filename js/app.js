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
    initialize: function(header_template_url, sidebar_template_url, category, section, tag) {
        console.log("Category VIEW YO!");
        this.category = category;
        this.section = section;
        var self = this;

        // console.log(this.category);
        this.listing = new CategoryListing();
        // this.listing.query = new Parse.Query(CategoryListing);
        // this.listing.query.exists("category");

        this.pullDataFill(header_template_url, sidebar_template_url, category, section, tag);
    },
    pullDataFill: function(header_template, sidebar_template, category, section, tag) {
        var self = this;
        $.when(this.listing.fetch(), this.getTemplate(header_template), this.getTemplate(sidebar_template)).then(function(dataPromise, headerTemplatingFn, sidebarTemplatingFn) {
            dataPromise.then(function(collection) {
                // console.log("Category collection (collection)?");
                console.log(collection);

                this.justCategories = [];
                this.mappedData = [];

                var models = _.sortBy(collection.models, function(model) {
                    return model.get('order');
                });

                if (models) {
                    _.each(models, function(model) {
                        this.justCategories.push(model.attributes.category);
                    });
                }

                if (!category) {
                    category = this.justCategories[0].toLowerCase();
                }

                capitalCategory = category.charAt(0).toUpperCase() + category.slice(1);
                var categoryLoc = this.justCategories.indexOf(capitalCategory);

                this.justSubCategories = _.zip.apply(_, models[categoryLoc].attributes.related)[0];
                if (!section) {
                    section = this.justSubCategories[0];
                    window.location = '#' + category + '/' + section.replace(' ', '_').toLowerCase();
                    return; //this is here so that rendering is canceled when the location is switched
                }

                this.justToolTags = _.zip.apply(_, models[categoryLoc].attributes.related)[1];

                self.render({
                    categories: this.justCategories
                }, headerTemplatingFn, '.categories ul');

                self.render({
                    cat: category,
                    subcats: this.justSubCategories
                }, sidebarTemplatingFn, '.sidebar');
                var myTool = new ToolView("./templates/tool.tmpl", category, section, tag, this.justToolTags);
            })
        });
    },
    getTemplate: function(url) {
        var self = this;
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
        var myHTML = "";

        myHTML += templatingFn(attributes);

        $(htmlAttach).html(myHTML);
    }
});

AppView.prototype.dataCache = {};
AppView.prototype.viewTemplateCache = {};

var Tool = Parse.Object.extend("WebTools", {
    defaults: {
        name: " ",
        description: " ",
        website: " ",
        category: " ",
        subcategory: " ",
        tags: " ",
        karmic: " ",
        platform: " ",
        price: " ",
        dependencies: " "
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
    initialize: function(template_url, category, subcategory, tag, toolTags) {
        console.log("VIEWS YO!");

        var self = this;

        this.listing = new ToolListing();
        this.listing.query = new Parse.Query(Tool);
        // console.log(this.listing.query);

        category = category.charAt(0).toUpperCase() + category.slice(1);
        // subcategory = subcategory.charAt(0).toUpperCase() + subcategory.slice(1);
        subcategory = subcategory.replace("_", " ");
        console.log(subcategory);
        this.listing.query.equalTo("category", category);
        this.listing.query.equalTo("subcategory", subcategory.toLowerCase());
        // console.log(tag);
        if (tag) {
            console.log("FOUND TAG, SIR!");
            tag = tag.charAt(0).toUpperCase() + tag.slice(1);
            this.listing.query.equalTo("tags", tag);
        }

        this.pullDataFill(template_url);
    },
    tagName: 'div',
    className: 'content',
    getData: function(url) {
        var self = this;
        return this.listing.fetch();
    },
    getTemplate: function(url) {
        var self = this;
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
        var self = this;
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

        if (myHTML === "") {
            $('.results').html("<h3>No tools found in this category</h3>");
            return;
        }
        $('.results').html(myHTML);
    }
});

ToolView.prototype.dataCache = {};
ToolView.prototype.viewTemplateCache = {};

var ModifyView = Parse.View.extend({
    initialize: function(template_url, template2_url, template3_url, category, section) {
        var self = this;
        _.bindAll(this, 'render');

        this.listing = new CategoryListing();
        console.log(category);
        console.log(section);

        if (category && section) {
            console.log("working so far!");
            this.getInfo(template3_url, category, section);

            $('#addEditItems').submit(function(e) {
                e.preventDefault();
                console.log(e);
                // console.log(e.target);
                var name = e.target[0].value;
                // this.url = e.target[1].value;
                var url = e.target[1].value;
                var description = e.target[2].value;
                var category = e.target[3].value.charAt(0).toUpperCase() + e.target[3].value.slice(1);
                // console.log("category: " + this.category);
                var subcategory = e.target[4].value;

                var tags = e.target[5].value.replace(", ", ",").split(",");
                // console.log("tags: " + this.tags);

                var platforms = [];
                for (i = 6; i < 13; i++) {
                    if (e.target[i].checked === true) {
                        platforms.push(e.target[i].value);
                    }
                }
                // console.log("platforms: " + this.platforms);

                var price = e.target[13].value;

                var dependencies = e.target[14].value.replace(", ", ",").split(",");
                // console.log("dependencies: " + this.dependencies);

                var karmic = [];
                for (i = 15; i < 17; i++) {
                    if (e.target[i].checked === true) {
                        karmic.push(e.target[i].value);
                    }
                }
                // console.log("karmic: " + this.karmic);

                console.log("name: " + name);
                console.log("description: " + description);
                console.log("website: " + url);
                console.log("category: " + category);
                console.log("subcategory: " + subcategory.toLowerCase());
                console.log("tags: " + tags);
                console.log("karmic: " + karmic);
                console.log("platform: " + platforms);
                console.log("price: " + price);
                console.log("dependencies" + dependencies);

                var oneTool = new Tool();
                console.log(oneTool);
                oneTool.save({
                    name: name,
                    description: description,
                    website: url,
                    category: category,
                    subcategory: subcategory.toLowerCase(),
                    tags: tags,
                    karmic: karmic,
                    platform: platforms,
                    price: price,
                    dependencies: dependencies
                },{
                    success: function(oneTool) {
                        // put what happens on success here
                    },
                    error: function(oneTool, error) {
                       console.log(error);
                    }
                });

                window.location = '#' + category.replace(' ', '_').toLowerCase() + '/' + subcategory.replace(' ', '_').toLowerCase();
                location.reload();
            });
        } else if (category && !section) {
            this.getInfo(template2_url, category, section);
        } else {
            $.get('./templates/form.tmpl', function(data) {
                $('body').html(data);
            });
            this.getInfo(template_url);
        }
    },
    getInfo: function(form_template, category, section) {
        var self = this;
        $.when(this.listing.fetch(), this.getTemplate(form_template)).then(function(dataPromise, formTemplatingFn) {
            dataPromise.then(function(collection) {
                this.justCategories = [];

                console.log(section);

                var models = _.sortBy(collection.models, function(model) {
                    return model.get('order');
                });

                _.each(models, function(model) {
                    this.justCategories.push(model.attributes.category);
                });

                // console.log(this.justCategories);

                if (category) {
                    capitalCategory = category.charAt(0).toUpperCase() + category.slice(1);
                    var categoryLoc = this.justCategories.indexOf(capitalCategory);

                    this.justSubCategories = _.zip.apply(_, models[categoryLoc].attributes.related)[0];
                }

                if (section) {
                    capitalSection = section.charAt(0).toUpperCase() + section.slice(1);
                    var sectionLoc = this.justSubCategories.indexOf(capitalSection);

                    this.justToolTags = _.zip.apply(_, models[categoryLoc].attributes.related)[1][sectionLoc];
                    console.log(this.justToolTags);
                }

                if (!category) {
                    self.render({
                        categories: this.justCategories
                    }, formTemplatingFn, '#addEditItems');
                }
                if (category && !section) {
                    self.render({
                        subcategories: this.justSubCategories
                    }, formTemplatingFn, '#addEditItems');
                }
                if (category && section) {
                    self.render({
                        tooltags: this.justToolTags
                    }, formTemplatingFn, '#addEditItems');
                }

                /*if (category && section) {
                     console.log('section: ' + section);
                     self.render({categories: this.justCategories}, {subcategories: this.justSubCategories, tooltags: this.justToolTags}, formTemplatingFn, '#addEditItems');
                }*/
            })
        });
    },
    getData: function(url) {
        var self = this;
        return this.listing.fetch();
    },
    getTemplate: function(url) {
        var self = this;
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
        var myHTML = "";

        myHTML += templatingFn(attributes);

        $(htmlAttach).append(myHTML);

        $('.catDropdown').change(function(e) {
            var category = e.target.selectedOptions[0].text.toLowerCase();
            window.location = '#add/' + category;
        });

        $('.subcatDropdown').change(function(e) {
            var subcategory = e.target.selectedOptions[0].text.toLowerCase();
            console.log(subcategory);
            console.log(window.location);
            window.location = window.location + '/' + subcategory.replace(' ', "_").toLowerCase();
            // window.location = '#add/' + subcategory;
        });
    }
    /*,
    navigate: function(e){
        console.log(change);
    },
    events: {
        'change .catDropdown': this.navigate
    }*/
});

ModifyView.prototype.viewTemplateCache = {};

var Router = Parse.Router.extend({
    routes: {
        "": "sectionview",
        "all": "all",
        "edit": "all",
        "add": "add",
        "add/:category": "add",
        "add/:category/:section": "add",
        "hotnfresh": "hotnfresh",
        "edit/:listing": "edit",
        ":category": "sectionview",
        ":category/:section": "sectionview",
        ":category/:section/:tag": "sectionview"
        // ":category/:section": "sectionview"
    },
    header_template_url: "./templates/header.tmpl",
    sidebar_template_url: "./templates/sidebar.tmpl",
    form_template_url: "./templates/form1.tmpl",
    form_template2_url: "./templates/form2.tmpl",
    form_template3_url: "./templates/form3.tmpl",
    sectionview: function(category, section, tag) {
        console.log(section);
        console.log(tag);
        this.view = new AppView(this.header_template_url, this.sidebar_template_url, category, section, tag);
    },

    add: function(category, section) {
        console.log("ADDING COOL STUFF!");
        this.view = new ModifyView(this.form_template_url, this.form_template2_url, this.form_template3_url, category, section);
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
