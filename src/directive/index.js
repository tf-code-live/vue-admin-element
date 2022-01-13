import drag from './el-drag-dialog/drag'

const focusDirective = {
    inserted: function(el) {
        el.querySelector('input').focus();
    }
}

const cusDirectives ={
    install: (Vue) => {
        Vue.directive('focus', focusDirective)
        Vue.directive('el-drag-dialog', drag)
    }
}

export default cusDirectives