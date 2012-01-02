(function($) {

var TimelineFilter = {
    TAG: 'fanfou-timeline-filter',
    timelineElem: null,
    options : {
        timelineElem: '#stream>ol',
        nextPageElem: '#pagination-more',
        statusSourceE: '.method',
        statusAuthorE: '.author',
        statusContentE: '.content',
        filters: []
    },
    init: function(options) {
        this.options = $.extend({}, this.options, options);
        this.timelineElem = $(this.options.timelineElem);
        this.addListeners();
        console.log('start filter timeline, filters:', this.options.filters);
        return this;
    }, 
    walkTimeline: function() {
        var self = this;
        self.timelineElem.children('li').each(function(){
            self.filterHandler(this);
        });
    },
    filterHandler: function(itemElem) {
        var o = this.options,
            elem = $(itemElem),
            sourceHtml = elem.find(o.statusSourceE).html(),
            authorHtml = elem.find(o.statusAuthorE).html(),
            contentHtml = elem.find(o.statusContentE).html();
        for (var i in o.filters) {
            var html = '', filter = o.filters[i],
                context = filter[0],
                keywords = filter[2];
            if (context == '来源') {
                html = sourceHtml;
            } else if (context == '作者') {
                html = authorHtml;
            } else {
                html = contentHtml;
            }
            if (html.indexOf(keywords) != -1) {
                console.log('hide elem by filter', filter, elem);
                elem.hide();
            }
        }
    },
    _foreachFilter: function(html, blockList, elem, debugTag) {
        if (!debugTag) { debugTag = ''; }
        for (var i in blockList) {
            if (html.indexOf(blockList[i]) != -1) {
                console.log('hide elem for ', debugTag, blockList[i], elem);
                elem.hide();
            }
        }
    },
    addListeners: function() {
        var self = this, o = self.options;
        $(o.nextPageElem).click(function(){
            self.startAjaxListener();
        });
    },
    startAjaxListener: function() {
        var self = this, o = self.options,
            originListLength = $(o.timelineElem + '>li').length,
            counter = 0;
        var timer = setInterval(function(){
            console.log('Big Boss is watching');
            if (counter > 10) {
                clearInterval(timer); // timeout
            }
            if ($(o.timelineElem + '>li').length != originListLength) {
                self.walkTimeline();
                clearInterval(timer);
            }
            counter++;
        }, 100);
    },
    /**/
    loadFilterFromLocalStrage: function() {
        if (filters) {
            this.options.filter = filters;
        }
    }
};//


////////////////////////////////////////////////////////////
var filters = [
    ['来源', '包含', 'http://is.gd/ontime'], // 按时吃饭
];
// get filters in user options
chrome.extension.sendRequest({action: "getFilters"}, function(response) {
    filters = response.filters;
    filter = TimelineFilter.init({filters: filters});
    filter.walkTimeline();
});


})(jQuery);
