; (function (factory) {
	String.format = function () {
        var s = arguments[0];
        if (s == null) return "";
        for (var i = 0; i < arguments.length - 1; i++) {
            var reg = getStringFormatPlaceHolderRegEx(i);
            s = s.replace(reg, (arguments[i + 1] == null ? "" : arguments[i + 1]));
        }
        return cleanStringFormatResult(s);
    }
    
    String.prototype.format = function () {
        var txt = this.toString();
        for (var i = 0; i < arguments.length; i++) {
            var exp = getStringFormatPlaceHolderRegEx(i);
            txt = txt.replace(exp, (arguments[i] == null ? "" : arguments[i]));
        }
        return cleanStringFormatResult(txt);
    }
    
    function getStringFormatPlaceHolderRegEx(placeHolderIndex) {
        return new RegExp('({)?\\{' + placeHolderIndex + '\\}(?!})', 'gm')
    }
    
    function cleanStringFormatResult(txt) {
        if (txt == null) return "";
        return txt.replace(getStringFormatPlaceHolderRegEx("\\d+"), "");
    }
	
    factory(window.jQuery);
})(function ($) {
    var I18n = {
		UI_DataResult: '目前頁次{0}、共{1}頁'
	};
    $.widget("ui.paginatedAutocomplete", $.ui.autocomplete, {
        options: {
            minLength: 0,
            url: '',
			delay: 250,
            pageSize: 10,
            type: 'GET',
            term: null,
            match: false,
            columns: null,
            params: {},
            source: function (request, response) {
                var self = this;
                this.options.params['page'] = (self._pageIndex + 1);
                this.options.params['pageSize'] = this.options.pageSize;
                this.options.params['term'] = this.options.term == null ? request.term : this.options.term;
                $.ajax({
                    url: this.options.url,
                    type: this.options.type,
                    dataType: "json",
                    pageSize: this.options.pageSize,
                    data: this.options.params,
                    success: function (data) {
                        var items = data.items;
                        self._totalItems = data.total;                        
						response($.map(items, function (item) {
                            var retVal = {
                                label: item.label,
                                value: item.value,
                                text: item.text
                            };
                            if (typeof item.data !== 'undefined') {
                                var dataValues = {};
                                var hasValues = false;
                                for (var k in item.data) {                                 
                                    dataValues[k] = item.data[k];
                                    hasValues = true;
                                }
                                if (hasValues) {
                                    retVal.data = dataValues;
                                }
                            }                            
                            return retVal;
                        }));
                    }
                }).fail(function(jqXHR) {
					console.log('error');
					console.log(jqXHR);
				});
            },
            focus: function () {
                // prevent value inserted on focus
                return false;
            }
        },
        search: function (value, event) {
            // Start a fresh search; Hide pagination panel and reset to 1st page.
            this._pageIndex = 0;
            this.options.term = value;
            console.log('search');
            $.ui.autocomplete.prototype.search.call(this, value, event);
        },
        select: function (item) {                        
            var self = this;
            this._data = null;            
            if (typeof item.data !== 'undefined') {
                this._data = item.data;
            }
            // Apply the item's label to the autocomplete textbox.
            var text = '';
            if (typeof item.text !== 'undefined') { text = item.text; }
            if (text == '') { text = item.label; }
            this._value(text);
            // Keep track of the selected item.
            self._previousSelectedItem = item.text;
        },
        close: function (event) {
            // Close the pagination panel when the selection pop-up is closed.
            this._paginationContainerElement.css('display', 'none');
            this.options.term = null;
            $.ui.autocomplete.prototype.close.call(this, event);
        },
        data: function () {
            // Get Selected Data Values
            return this._data;
        },
        _previousSelectedItem: null,
        _totalPages: null,
        _totalItems: null,
        _data: null,
        _pageIndex: 0,
        _create: function () {
            var self = this;
            // Create the DOM structure to support the paginated autocomplete.
            this._resultsContainerElement = $('<div class="ui-autocomplete-pagination-results"></div>');
            $('body').append(this._resultsContainerElement);            
            this._resultsContainerElement.css({
                'position': 'absolute',
                'left': '0px',
                'top': '0px'
            });

            this._resultsContainerElement.append(
                '<div style="display:none; padding-top: 0px; padding-left: 0px; position: relative; z-index: 1052; left: 0px !important; top: 0px !important; " class="ui-autocomplete-pagination-container">' +
                    '<button type="button" class="first-page ui-autocomplete-first-page" style="float: left;"><i class="fa fa-angle-double-left"></i></button>' +
                    '<button type="button" class="previous-page ui-autocomplete-previous-page" style="float: left;"><i class="fa fa-angle-left"></i></button>' +
                    '<button type="button" class="next-page ui-autocomplete-next-page" style="float: left;"><i class="fa fa-angle-right"></i></button>' +
                    '<button type="button" class="last-page ui-autocomplete-last-page" style="float: left;"><i class="fa fa-angle-double-right"></i></button>' +
                    '<div style="float:right; " class="ui-autocomplete-pagination-details">' +
                        I18n.UI_DataResult.format(1, 100) +
                    '</div>' +
                '</div>');
            this._paginationContainerElement = this._resultsContainerElement.children("div.ui-autocomplete-pagination-container");
            this._nextPageElement = this._paginationContainerElement.find("button.next-page");
            this._previousPageElement = this._paginationContainerElement.find("button.previous-page");
            this._firstPageElement = this._paginationContainerElement.find("button.first-page");
            this._lastPageElement = this._paginationContainerElement.find("button.last-page");
            this._paginationDetailsElement = this._paginationContainerElement.find("div.ui-autocomplete-pagination-details");

            // Append the menu items (and related content) to the specified element.
            if (this.options.appendTo !== null) {
                this._paginationContainerElement.appendTo(this._resultsContainerElement);
                this._resultsContainerElement.appendTo(this.options.appendTo);
                this.options.appendTo = this._resultsContainerElement;
            }
            else {
                this.options.appendTo = this._resultsContainerElement;
            }

            // Hide default JQuery Autocomplete details (want to use our own blurb).
            $(this.element).next("span.ui-helper-hidden-accessible").css("display", "none");

            // Event handler(s) for the next/previous pagination buttons.
            this._on(this._nextPageElement, { click: this._nextPage });
            this._on(this._previousPageElement, { click: this._previousPage });
            this._on(this._firstPageElement, { click: this._firstPage });
            this._on(this._lastPageElement, { click: this._lastPage });
            
            // Register Page Down / Page up event
            this._on(this.element, {
                keydown: function (event) {
                    var keyCode = $.ui.keyCode;
                    switch (event.keyCode) {
                        case keyCode.PAGE_UP:
                            this._previousPage(event);                                                        
                            event.preventDefault();
                            break;
                        case keyCode.PAGE_DOWN:
                            this._nextPage(event);                                                        
                            event.preventDefault();
                            break;
                        case keyCode.ESCAPE:
                            // 當選單展開時，動作應為關閉選單，須避免在ModalDialog中觸發關閉Dialog的動作
                            if (this.menu.element.is(':visible')) {
                                return false;  
                            }                            
                    }
                }
            });

            // Event handler(s) for the autocomplete textbox.
            this._on(this.element, {
                blur: function (event) {
                    // When losing focus hide the pagination panel
                    this._pageIndex = 0;
                },
                paginatedautocompleteopen: function (event) {                    
                    // Autocomplete menu is now visible.
                    // Update pagination information.

                    // Auto focus on first item.
                    // $.ui.autocomplete.prototype._move.call(this, "previousPage", event);
                    var self = this,
                        paginationFrom = null,
                        paginationTo = null,
                        menuOffset = this.menu.element.offset();

                    self._totalPages = Math.ceil(self._totalItems / self.options.pageSize);

                    paginationFrom = self._pageIndex * self.options.pageSize + 1;
                    paginationTo = ((self._pageIndex * self.options.pageSize) + self.options.pageSize);

                    if (paginationTo > self._totalItems) {
                        paginationTo = self._totalItems;
                    }
					
					// Align the pagination container with the menu.
                    this._paginationContainerElement.offset({ top: menuOffset.top, left: menuOffset.left });
                    // Modify the list generated by the autocomplete so that it appears below the pagination controls.                    
                    this._resultsContainerElement.find('ul').css({ 'z-index': '1051' }).addClass('ui-autocomplete-pagination-result-item')
                    // this._paginationDetailsElement.html("Showing " + paginationFrom.toString() + " to " + paginationTo.toString() + " of " + self._totalItems.toString() + " items.");
                    this._paginationDetailsElement.html(I18n.UI_DataResult.format(this._pageIndex + 1, this._totalPages));	
					// Adjust Paginate Width
					var resultWidth = this._resultsContainerElement.find('.ui-autocomplete-pagination-result-item').width();
					this._paginationContainerElement.css('width', resultWidth + 'px');
										
                }
            });

            // Event handler(s) for the pagination panel.
            this._on(this._paginationContainerElement, {
                mousedown: function (event) {
                    return false;
                    /* 
                    // The following will prevent the pagination panel and selection menu from losing focus (and disappearing).
                    // Prevent moving focus out of the text field
                    event.preventDefault();
                    // IE doesn't prevent moving focus even with event.preventDefault()
                    // so we set a flag to know when we should ignore the blur event
                    this.cancelBlur = true;
                    this._delay(function () {
                        delete this.cancelBlur;
                    });
                    */
                }
            });

            // Now we're going to let the default _create() to do it's thing. This will create the autocomplete pop-up selection menu.
            $.ui.autocomplete.prototype._create.call(this);
            if (this._isGridMode()) {
                this.menu.element.menu({ items: 'tbody tr' });
            }
            // Event handler(s) for the autocomplete pop-up selection menu.
            this._on(this.menu.element, {
                menuselect: function (event, ui) {
                    var item = ui.item.data("ui-autocomplete-item");    // Get the selected item.
                    this.select(item);
                }
            });
        },
        _nextPage: function (event) {
            if (this._pageIndex < this._totalPages - 1) {
                this._pageIndex++;
                $.ui.autocomplete.prototype._search.call(this, this.term);
            }
        },
        _previousPage: function (event) {
            if (this._pageIndex > 0) {
                this._pageIndex--;
                $.ui.autocomplete.prototype._search.call(this, this.term);
            }
        },
        _firstPage: function (event) {
            if (this._pageIndex != 0) {
                this._pageIndex = 0;
                $.ui.autocomplete.prototype._search.call(this, this.term);
            }
        },
        _lastPage: function (event) {
            if (this._pageIndex != this._totalPages - 1) {
                this._pageIndex = this._totalPages - 1;
                $.ui.autocomplete.prototype._search.call(this, this.term);
            }
        },
        _isGridMode: function () {
            return (this.options.columns != null);
        },
        _change: function (event) {
            // Clear the textbox if an item wasn't selected from the menu.
            if (((this.selectedItem === null) && (this._previousSelectedItem === null)) ||
                (this.selectedItem === null) && (this._previousSelectedItem !== null) && (this._previousSelectedItem.label !== this._value())) {
                // Clear values.
                if (this.options.match) {
                    this._value("");
                }                    
            }
            $.ui.autocomplete.prototype._change.call(this, event);
        },
        _renderMenu: function (ul, items) {
            if (!this._isGridMode()) {
                $.ui.autocomplete.prototype._renderMenu.call(this, ul, items);
                return;
            }

            var self = this;
            ul.append('<table class="ui-autocomplete-grid"><thead></thead><tbody></tbody></table>');

            var columns = this.options.columns, hasHeader = false;
            for (var c in columns) {
                hasHeader = (typeof columns[c].header !== 'undefined');
                if (hasHeader) { break; }
            }

            if (hasHeader) {
                var $rowHeader = $('<tr />');
                for (var c in columns) {
                    var w = columns[c].width || 100;
                    $cellHeader = $('<th />').text(columns[c].header || '').css('width', w + 'px');
                    $rowHeader.append($cellHeader);
                }
                ul.find('table thead').append($rowHeader);
            }

            $.each(items, function (index, item) {
                self._renderItemData(ul.find("table tbody"), item);
            });
            
        },
        _renderItem: function(ul, item) {
            if (!this._isGridMode()) {
                return $.ui.autocomplete.prototype._renderItem.call(this, ul, item);
            }

            var columns = this.options.columns, $row = $('<tr />');            
            $row.data("ui-autocomplete-item", item);
            var values = item.data;
            if (typeof values === 'undefined') {
                values = {};
            }
            for (var col in columns) {
                var o = columns[col], w = o.width, v = '';
                if ($.isFunction(o.value)) {
                    v = o.value(item);
                } else {
                    v = values[col];
                }
                if (typeof w === 'undefined') { w = 100; }
                if (typeof v === 'undefined') { v = ''; }

                var $cell = $('<td />').text(v).css('width', w + 'px');
                if (typeof o.align !== 'undefined') {
                    $cell.css('text-align', o.align);
                }
                $row.append($cell);
            }
            ul.append($row);
            return $row;
        },
        _move: function( direction, event ) {
		    if ( !this.menu.element.is( ":visible" ) ) {
			    this.search( null, event );
			    return;
		    }
		    if ( this.menu.isFirstItem() && /^previous/.test( direction ) ||
				    this.menu.isLastItem() && /^next/.test( direction ) ) {
			    if ( !this.isMultiLine ) {
				    this._value( this.term );
			    }
			    this.menu.blur();
			    return;
		    }
		    this.menu.activeMenu = this.menu.element; // menu物件指回原本的物件，以避免在Table模式下發生script錯誤
		    this.menu[ direction ]( event );
	    },
        _resizeMenu: function() {            
            $.ui.autocomplete.prototype._resizeMenu.call(this);
            if (!this._isGridMode()) {  return; }
            var tableWidth = 0;
            var ul = this.menu.element;
            for (var col in this.options.columns) {
                var w = this.options.columns[col].width;
                if ((typeof w === 'undefined') || (isNaN(Number(w)))) {
                    w = 0;
                }
                tableWidth += Number(w);
            }
            this._paginationContainerElement.css('width', tableWidth + 'px');
            if (ul.width() < tableWidth) {
                ul.css('width', tableWidth + 'px');
            }                
        },
        _destroy: function () {
            this._paginationContainerElement.remove();
            this._resultsContainerElement.remove();
            $.ui.autocomplete.prototype._destroy.call(this);
        },
        __response: function (content) {
            var self = this;
            self._totalItemsOnPage = content.length;
            self._paginationContainerElement.css('display', self._totalItemsOnPage > 0 ? 'block' : 'none');
            $.ui.autocomplete.prototype.__response.call(this, content);
        }
    });
});
