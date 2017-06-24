/**
 * index.js
 */

require(["dstore/RequestMemory", "dgrid/OnDemandGrid", "dojo/dom", "dojo/ready", "dojo/date/locale", "dojo/on", "dojo/query", "dojo/_base/window", "dojo/date", "dijit/form/Button", "dojo/data/ItemFileReadStore", "dojo/dom-style", "dojo/dom-class"], function(RequestMemory, OnDemandGrid, dom, ready, locale, on, query, win, date, button, ItemFileReadStore, domStyle, domClass){
    var store = new RequestMemory({ target: '../json/nfl.json' });
    var grid = new OnDemandGrid({
        collection: store,
        columns: {
            name: 'Name',
            website: 'Website',
            division: 'Division',
            stadium: 'Stadium',
            stadium_capacity: 'Stadium Capacity',
            founded_date: 'Founded Date',
        },
        //formatter: function(website){}
    }, 'grid');
    grid.startup();
    
    ready(function(){
        convertLink(".field-website");
        formatDate();
    });

    function convertLink(sel) {
        dojo.query(sel).forEach(function(node, i){
            var fmt_link = node.innerHTML;
            if (i !== 0 ) {
                if (fmt_link.substr(0, 3) === "www") {
                    fmt_link = "http://" + fmt_link;
                }
                node.innerHTML = "<a href=" + fmt_link + " target='_blank'>"+ fmt_link + "</a>";
            }
        });
    }
    
    function formatDate() {
        function format(date, fmt){ return locale.format( date, {selector:"date", datePattern:fmt } ); };
        var founded_sel = dojo.query(".field-founded_date");
        var fmt = "EEEE, MMMM d, yyyy";
        founded_sel.forEach(function(node, i){
            var fmt_date = new Date(node.innerHTML);
            if (i !== 0 ) {
                node.innerHTML = format(fmt_date, fmt);
            }
        });
    }
    
    /*** FILTER DATE ***/
    var filterQuery = function(item, index, items) {
        var filterString = filter ? filter.get("value") + "" : "";
        if (filterString.length < 2) return true;
        if (!item.Name) return false;
        var name = (item.Name + "").toLowerCase();
        if (~name.indexOf(filterString.toLowerCase())) { return true;}
        return false;
    }
    
    /*** BUTTONS ***/
    var compareDate = new Date(1959,9,15);
    on(win.doc, "#filterDate:click", function(evt) {
        evt.preventDefault();
        var date_sel = dojo.query(".field-founded_date");
        date_sel.forEach(function(node, i){
            var founded_date = new Date(node.innerHTML);
            if (i !== 0 ) {
                if (date.compare(founded_date, compareDate) === -1) {
                    domStyle.set(node.parentNode, "display", "none");
                }
            }
        });
        if(domClass.contains(this, "toggled")){ 
            grid.refresh();
            convertLink(".field-website");
            formatDate();
        }
        domClass.toggle(this, "toggled");
    });
    on(win.doc, "#sortName:click", function(evt) {
        evt.preventDefault();
        grid.set('sort', 'name');
        convertLink(".field-website");
        formatDate();
    });
    on(win.doc, "#sortDate:click", function(evt) {
        evt.preventDefault();
        grid.set('sort', [ { property: 'founded_date', descending: true } ]);
        convertLink(".field-website");
        formatDate();
    });

});
