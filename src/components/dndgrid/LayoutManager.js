'use strict';

export default class LayoutManager {

    columns;
    horizontalMargin;
    verticalMargin;
    layoutWidth;
    itemHeight;
    itemWidth;
    rowHeight;

    constructor(options, width){
        // 组件宽度
        this.layoutWidth = width;
        // 放大比例
        this.zoom = options.zoom;
        // 显示宽度
        this.itemWidth = Math.round(options.itemWidth * this.zoom);
        // 显示高度
        this.itemHeight = Math.round(options.itemHeight * this.zoom);
        // 显示列数
        this.columns = Math.floor(this.layoutWidth / this.itemWidth);
        // 水平间距
        this.horizontalMargin = (this.columns === 1) ? 0 : Math.round(this.layoutWidth - (this.columns * this.itemWidth)) / (this.columns - 1);
        // 垂直间距
        this.verticalMargin = (options.verticalMargin === -1) ? this.horizontalMargin : options.verticalMargin;
        // 单行高度
        this.rowHeight = this.itemHeight + this.verticalMargin;
    }
    
    // 获取整个组件的高度
    getGridHeight(itemLength){
        return (Math.ceil(itemLength / this.columns) * this.rowHeight) - this.verticalMargin;
    }
    
    // 获取拖放元素的行
    getItemRow(index){
        return Math.floor(index / this.columns);
    }

    // 获取拖放元素的列
    getItemColumn(index){
        return index - (this.getItemRow(index) * this.columns);
    }
    
    // 获取目标位置
    getItemPosition(index){
        const col = this.getItemColumn(index);
        const row = this.getItemRow(index);
        const margin = this.horizontalMargin;
        const width = this.itemWidth;
        return {
            x: Math.round((col * width) + (col * margin)),
            y: Math.round((this.itemHeight + this.verticalMargin) * row)
        };
    }
    
    // 获取元素的最终样式【位置】
    getStyle(index, animation, isFiltered){
        const position = this.getItemPosition(index);
        // 移动到目标位置
        const transform = 'translate3d(' + position.x + 'px, ' + position.y + 'px, 0)';
        const style = {
            width: this.itemWidth + 'px',
            height: this.itemHeight + 'px',
            WebkitTransform: transform,
            MozTransform: transform,
            msTransform: transform,
            transform: transform,
            position: 'absolute',
            boxSizing: 'border-box',
            display: isFiltered ? 'none' : 'block'
        };
        if(animation){
            style.WebkitTransition = '-webkit-' + animation;
            style.MozTransition = '-moz-' + animation;
            style.msTransition = 'ms-' + animation;
            style.transition = animation;
        }
        return style;
    }
}
