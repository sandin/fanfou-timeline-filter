(function($) {

var Options = {
    TAG: 'fanfou-timeline-filter',
    table : null,
    options: {
        tableElem: '#fitler-list>tbody',
        sourceElem: '.source',
        typeElem: '.type',
        keywordElem: '.keyword',
        filters: [
            ['来源', '包含', '按时✰吃饭'] // context, type, keywords
        ]
    },
    i18n: {
        SOURCE: '来源',
        CONTENT: '内容',
        AUTHOR: '作者',
        CONTAIN: '包含',
        NOT_CONTAIN: '不包含'
    },
    init: function(options) {
        console.log('init options');
        this.options = $.extend({}, this.options, options);
        this.table = $(this.options.tableElem);
        this.addListeners();
        return this;
    },
    getOptionsByWalkTableList: function() {
        var t = this, o = t.options,
            options = [];
        $(o.tableElem).children('tr').each(function(i) {
            if (i > 0) { // strip header
                var tr = $(this),
                    source = tr.find(o.sourceElem).val(),
                    type = tr.find(o.typeElem).val(),
                    keyword = tr.find(o.keywordElem).val();
                if (source && type && keyword) {
                    options.push([source, type, keyword]);
                }
                tr = null;
            } // if
        });  // each
        console.log(options);
        return options;
    },
    getOptionsFromLocalStrage: function() {
        var str = localStorage[this.TAG], options = this.options.filters;
        if (str) {
            console.log('options from local', options);
            options = JSON.parse(str);
        }
        return options;
    },
    saveOptionsToLocalStrage: function(options) {
        console.log('save opition into local', options);
        localStorage[this.TAG] = JSON.stringify(options);
    },
    _makeOpDom: function(text, filter) {
        var elem = $('<option />', {text: text});
        if (filter == text) {
            elem.attr('selected', 'selected');
        }
        return elem;
    },
    restoreOptions: function() {
        var filters = this.getOptionsFromLocalStrage();
        for (o in filters) {
            this._createDOM(filters[o]);
        }
    },
    _createDOM: function(filter) {
        var sourceOp = this._makeOpDom(this.i18n.SOURCE, filter[0]),
            authorOp = this._makeOpDom(this.i18n.AUTHOR, filter[0]),
            contentOp = this._makeOpDom(this.i18n.CONTENT, filter[0]);
        console.log(filter);
        $('<tr />').append(
            $('<td />').append(
                $('<select class="source" />').append(sourceOp).append(authorOp).append(contentOp)
            )
        ).append(
            $('<td />').append(
                $('<select class="type" />').append(
                    $('<option />', {text: this.i18n.CONTAIN})
                )
            )
        ).append(
            $('<td />').append(
                $('<input class="keyword" type="text" />').val(filter[2])
            )
        ).append($(this.TR_TEMPLATE_2)).appendTo(this.table);
        //$(html).appendTo(this.table);
    },
    saveOptions: function() {
        var options = this.getOptionsByWalkTableList();
        this.saveOptionsToLocalStrage(options);
        this.onSaveSuccessed();
    },
    onSaveSuccessed: function() {
        console.log('on save successed');
        if (typeof this.options.onSaveSuccessed == 'function') {
            this.options.onSaveSuccessed();
        }
    },
    addListeners: function() {
        var self = this;
        var html = 'hi';
        //self.elem.html(html);
        $('#save-btn').click(function(){
            self.saveOptions();
            return false;
        });
        $('#addFilter').click(function() {
            self._createDOM(['来源', '包含', '']);
            return false;
        });
        $('.del-btn').live('click', function() {
            console.log(this);
            $(this).parent().parent('tr').remove();
            self.saveOptions();
            return false;
        });
        $('.keyword').live('change', function() {
            self.saveOptions();
        });
    },
    getOptions: function() {
        var filters = this.getOptionsFromLocalStrage();
    },
    SOURCE_TEMPLATE: '<option>来源</option><option>作者</option><option>内容</option>',
    TR_TEMPLATE_2: '<td><a class="del-btn" href="#">Delete</a></td>'
};

var Notice = {
    elem: null,
    timer: null,
    options: {
        elem: '#notice'
    },
    init: function(options) {
        this.elem = $(this.options.elem);
        return this;
    },
    sendMessage: function(text, timeout) {
        if (!timeout) timeout = 1000;
        this.elem.show().html(text);
        var self = this;
        this.timer = setTimeout(function(){
            self.elem.html("").hide();
        }, timeout);
    }
};

$(window).load(function() {
var notice = Notice.init(),
    o = Options.init({
        onSaveSuccessed : function() {
            notice.sendMessage('saved');
        }
    });
    o.restoreOptions();
});

})(jQuery);
