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
        $.get("/templates/header.tmpl").then(function(header) {
            $('.categories').html(header);

            var myHTML = "";

            _.forEach(attributes, function(attribute_obj) {
                myHTML += templatingFn(attribute_obj);
            });

            $('.results').html(myHTML);
        });
    }
});

ToolView.prototype.dataCache = {};
ToolView.prototype.viewTemplateCache = {};