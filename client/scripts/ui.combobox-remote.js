; (function (factory) {	
    factory(window.jQuery, 'ui');
})
(
    (function ($, nameSpace) {
        var _ns = nameSpace + ".comboboxRemote";
        $.widget(_ns, {
            options: {
                placeholder: null, // 指定Combox中的placeholder
                dropdownCss: 'btn-default', // 指定下拉選單按鈕的CSS名稱
                url: '', // 指定Ajax傳輸網址
                columns: null, // 如要以Table模式呈現，指定columns的數值
                params: {},
                type: 'GET',
                pageSize: 10,
                delay: 250, // 輸入後延遲多久開始查詢
                minLength: 0, // 至少輸入的位數
                destroy: false,
                // Callback
                change: null, // 當改變值的時後要發生的事件
                select: null // 當選取值的時候要發生的事件
            },
            // 指派數值和顯示的文字
            value: function (value, text) {
                var opt = this.element.find('option[value = "' + value + '"]');
                if (opt.length == 0) {
                    this.element.append('<option value="' + value + '" />')
                }
                this.element.val(value);
                if ((typeof text === 'undefined') || (text == '')) {
                    this.input.val(value);
                } else {
                    this.input.val(text);
                }

            },
            // 取得資料內容
            data: function () {
                var itemData = this.input.paginatedAutocomplete('data');
                return itemData;
            },
            // 將游標移至此元件
            setfocus: function() {
                this.input[0].focus();
            },
            // 將游標移至此元件，並選取文字
            setselected: function () {
                this.input[0].select();
            },
            _init: function () {
            },
            _create: function () {
                if (this.element.parents('.input-group').length == 0) {
                    this.element.wrap('<div class="input-group" />');
                }
                this.wrapper = this.element.parents('.input-group');
                this.element.hide();
                this._createAutocomplete();
                this._createShowAllButton();
                this._isCreated = true;
            },
            _isCreated: false,
            _createAutocomplete: function () {
                var widgetBase = this;
                var selected = this.element.children(":selected"),
                    value = selected.val() ? selected.text() : "";
                var baseWidget = this;
                var $resultContainer = $('<div class="pagination-wrapper">');
                this.wrapper.after($resultContainer);
                this.input = $("<input>")
                    .insertBefore(this.element)
                    .val(value)
                    .attr("title", "")
                    .addClass('form-control')
                    .paginatedAutocomplete({
                        delay: this.options.delay,
                        minLength: this.options.minLength,
                        url: this.options.url,
                        type: this.options.type,
                        columns: this.options.columns,
                        pageSize: this.options.pageSize,
                        params: this.options.params,
                        resultContainer: $resultContainer,
                        open: function () {                            
                            $resultContainer.css('width', $resultContainer.find('ul.ui-autocomplete').width() + 'px');
                        }
                    });

                if (this.options.placeholder != null) {
                    this.input.attr('placeholder', this.options.placeholder);
                }

                this._on(this.input, {
                    paginatedautocompleteselect: function (event, ui) {
                        if (!widgetBase._hasValue(ui.item.value)) {
                            var opt = $('<option value="' + ui.item.value + '">' + ui.item.label + '</option>');
                            widgetBase.element.append(opt);
                        }
                        widgetBase.element.val(ui.item.value);
                        widgetBase._setInputText(ui.item);
                        widgetBase._trigger("select", event, ui);
                    },
                    paginatedautocompletechange: function (event, ui) {
                        widgetBase._removeIfInvalid(event, ui);
                        widgetBase._trigger("change", event, ui);
                    }
                });
            },

            _createShowAllButton: function () {
                var input = this.input, base = this;
                wasOpen = false;
                $('<span />').addClass('input-group-btn').append(
                    $('<button type="button" data-toggle="combobox" tabindex="-1" />').addClass('btn')
                        .addClass(this.options.dropdownCss)
                        .append('<i class="fa fa-caret-down"></i>')
                        .on("mousedown." + _ns, function () {
                            wasOpen = input.paginatedAutocomplete("widget").is(":visible");
                        })
                        .on("click." + _ns, function () {
                            input.trigger("focus");
                            if (wasOpen) {
                                return;
                            }
                            input.paginatedAutocomplete({ minLength: 0 });
                            input.paginatedAutocomplete("search", "");
                            input.paginatedAutocomplete({ minLength: base.options.minLength });
                        })
                ).appendTo(this.wrapper);
            },
            _hasValue: function (val) {
                var hasValue = false;
                var opts = this.element.find('option');
                for (var i = 0; i < opts.length; i++) {
                    if ($(opts[i]).val().toLowerCase() === val.toLowerCase()) {
                        return true;
                    }
                }
                return false;
            },
            _setInputText: function (item) {
                var text = '';
                if (typeof item.text !== 'undefined') {
                    text = item.text;
                }                
                if (text == '') { text = item.label; }                
                this.input.val(text);
            },
            _removeIfInvalid: function (event, ui) {
                // Selected an item, nothing to do
                if (ui.item) {
                    return;
                }
                // Search for a match (case-insensitive)
                var value = this.input.val(),
                valueLowerCase = value.toLowerCase(),
                valid = false;
                this.element.children("option").each(function () {
                    if ($(this).text().toLowerCase() === valueLowerCase) {
                        this.selected = valid = true;
                        return false;
                    }
                });

                // Found a match, nothing to do
                if (valid) {
                    return;
                }

                // Remove invalid value                    
                this.input.val("");
                this.element.val("");
                // this.input.autocomplete("instance").term = "";
                this.input.paginatedAutocomplete("instance").term = "";
            },

            _destroy: function () {
                this.wrapper.remove();
                this.element.show();
            }
        });
    })
);