layui.define(['jquery'],function(exports){
    var $ = layui.jquery;
    var CLS_DROPDOWN = 'layui-dropdown';
    var CLS_DROPDOWN_RIGHT = 'layui-dropdown-direright';
    var CLS_SELECT = 'layui-dropdown-select';
    var CLS_OPTION = 'layui-dropdown-option';
    var CLS_TITLE = 'layui-dropdown-title';
    var CLS_ARROW = 'nepadmin-arrow-up'
    var HTML_DROPDOWN = '<div class="'+CLS_DROPDOWN+'">奥术大师大所<div>';
    var DEPTH = 0;

    var Class = function(config){
        this.config = $.extend({},this.config,config);
        this.render(config);
    };
    Class.prototype.config = {
        width:150,
        trigger:'click'
    }
    Class.prototype.dropdownElem = '';
    Class.prototype.exists = false;
    Class.prototype.depth = 0;
    Class.prototype.render = function(config){
        var self = this;
        
        $(document).on('click',this.config.elem,function(){

            if(self.dropdownElem == ''){
                var dropdown = $(HTML_DROPDOWN);
                dropdown.html(self.createOptionsHtml(config));
                $('body').prepend(dropdown);
                dropdown.on('click','.'+CLS_OPTION,function(e){
                    if($.isFunction(config.click)){
                        config.click($(this).attr('lay-name'),$(this),e);
                        dropdown.fadeOut();
                    }
                });
                self.dropdownElem = dropdown;
                self.dropdownSelect = dropdown.find('.'+CLS_SELECT);
            }

            var dropdown = self.dropdownElem;
            var top = $(this).offset().top + $(this).height() + 12;
            var left = $(this).offset().left;
            dropdown.css({
                'top':top,
                'display':'none'
            });
            var offsetWidth = (self.depth + 1) * self.config.width;

            if(left + offsetWidth > $(window).width()){
                dropdown.addClass('layui-dropdown-right').css('left',left - dropdown.width() + $(this).width());
                self.dropdownSelect.css({left:'auto',right:self.config.width});
            }else{
                dropdown.removeClass('layui-dropdown-right').css('left',left);
                self.dropdownSelect.css({right:'auto',left:self.config.width});
            }

            $(document).one('click',function(e){
                var dropdownExists = $(e.target).parents('.layui-dropdown');
                if(dropdownExists.length == 0){
                    dropdown.fadeOut();
                }
            });
            
            dropdown.fadeIn();
        })
    }
    Class.prototype.createOptionsHtml = function(data,depth){
        depth = depth || 0;
        var self = this;
        var width = self.config.width + 'px;';
        var html = '<div class="'+CLS_SELECT+'" style="width:'+ width + (depth > 0 ? 'left:'+width :'')+'">';
        if(depth == 0){
            html += '<div class="'+CLS_ARROW+'"></div>';
        }
        layui.each(data.options,function(i,option){
            var options = option.options || [];
            html += '<div lay-name='+option.name+' class="'+CLS_OPTION+'"><p class="'+CLS_TITLE+' layui-elip"><span class="layui-icon '+option.icon+'"></span>'+option.title+'</p>' + (options.length>0?'<i class="layui-icon layui-icon-right"></i>':'');
            option.options = option.options || [];
            if(option.options.length > 0) html += self.createOptionsHtml(option,depth + 1);
            html += '</div>';
            if(self.depth < depth) self.depth = depth;
        });
        html += '</div>';
        return html;
    }

    var self = {
        render:function(config){
            new Class(config);
        }
    }
    exports('dropdown',self);
})