'use strict';

export default class ItemDrag {
    
    // 鼠标起始相对外层组件的位置
    startX;
    startY;
    // 对应元素
    move;
    // 元素的布局信息，用于计算元素移动后的位置
    layout;
    // 组件的布局信息
    container;
    // 元素交换的fn
    swap;
    
    constructor(swapFn){
        this.dragMove = this.dragMove.bind(this);
        this.endDrag = this.endDrag.bind(this);
        this.getTargetIndex = this.getTargetIndex.bind(this);
        this.swap = swapFn;
    }
    
    startDrag(e, itemDom, layout, container, moveFn){
        const isTouch = e.targetTouches && e.targetTouches.length === 1;
        if(e.button === 0 || isTouch){
            // 绑定布局信息
            this.layout = layout;
            this.container = container;
            // 绑定移动函数，用于渲染移动时元素
            this.move = moveFn;
            // 鼠标起始位置
            this.startX = isTouch ? e.targetTouches[0].clientX : e.clientX;
            this.startY = isTouch ? e.targetTouches[0].clientY : e.clientY;
            // 外层组件的位置
            const rect = itemDom.getBoundingClientRect();
            const { left, top } = container;
            // 获取鼠标相对外层组件的位置
            this.offsetX = rect.left - left;
            this.offsetY = rect.top - top;
            // 绑定事件
            document.addEventListener('mousemove', this.dragMove);
            document.addEventListener('touchmove', this.dragMove);
            document.addEventListener('mouseup', this.endDrag);
            document.addEventListener('touchend', this.endDrag);
            document.addEventListener('touchcancel', this.endDrag);
            e.preventDefault();
        }
    }
    
    // 鼠标拖放时的响应
    dragMove(e) {
        // 触发计算的最小距离
        const trigger = 10;
        // 判断是否是触摸事件
        const isTouch = e.touches && e.touches.length;
        // 获取鼠标相对整个页面的位置
        const clientX = isTouch ? e.touches[0].clientX : e.clientX;
        const clientY = isTouch ? e.touches[0].clientY : e.clientY;
        // 获取偏移
        const xMove = clientX - this.startX;
        const yMove = clientY - this.startY;
        // 当偏移距离大于
        if(Math.abs(xMove) > trigger || Math.abs(yMove) > trigger){
            // 渲染移动元素
            this.move(xMove + this.offsetX, yMove + this.offsetY);
            // 获取移动的目标位置索引
            const targetIndex = this.getTargetIndex(clientX, clientY);
            // 交换索引
            this.swap(targetIndex);
            
            e.stopPropagation();
            e.preventDefault();
        }
    }
    
    // 结束拖放事件
    endDrag() {
        // Drap时自动定位
        this.swap(null);
        // 移除事件绑定
        document.removeEventListener('mousemove', this.dragMove);
        document.removeEventListener('mouseup', this.endDrag);
        if(this.move && typeof this.move === 'function'){
            this.move = null;
        }
    }
    
    // 计算当前鼠标的落点
    getTargetIndex(clientX, clientY){
        const { columns, layoutWidth, rowHeight } = this.layout;
        const { left, top } = this.container;
        const width = Math.round(layoutWidth / columns);
        const height = rowHeight;
        const colIndex = Math.floor((clientX - left) / width);
        const rowIndex = Math.floor((clientY - top) / height);
        return rowIndex * columns + colIndex;
    }
}
