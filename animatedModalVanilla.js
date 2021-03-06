/*=========================================
 * animatedModalPureJS.js: Version 1.0
 * author: Patrick Canella / (original jQuery author: João Pereira)
 * website: http://patcanella.com / http://www.joaopereira.pt
 * email: patrickcanella@gmail.com / joaopereirawd@gmail.com
 * Licensed MIT 
=========================================*/


function AnimatedModal(el, options) {
    this.initSettings(options);
    this.id = this.$('body').querySelector('#' + this.settings.modalTarget);

    this.modal = document.querySelector(el);
    this.closeBtn = this.$('.close-' + this.settings.modalTarget);
    this.id.classList.add('animated');
    this.id.classList.add(this.settings.modalTarget + '-off');

    for (var key in this.initStyles()) {
        this.id.style[key] = this.initStyles()[key];
    }

    this.modal.addEventListener('click', this.modalOnClick.bind(this));
    this.closeBtn.addEventListener('click', this.closeModal.bind(this));
}


AnimatedModal.prototype = {

    modalCount: 0,

    btnCount: 0,

    settings: {},

    $: document.querySelector.bind(document),

    modal: '',

    initSettings: function(options) {
        var noop = function() {};
        var clonedSettings = JSON.parse(JSON.stringify(this.defaultSettings));
        this.settings = this.extend(clonedSettings, options);
        this.settings.beforeOpen = options.beforeOpen || noop;
        this.settings.beforeClose = options.beforeClose || noop;
        this.settings.afterOpen = options.afterOpen || noop;
        this.settings.afterClose = options.afterOpen || noop;
    },

    initStyles: function() {
        var settings = this.settings;
        return {
            'position': settings.position,
            'width': settings.width,
            'height': settings.height,
            'top': settings.top,
            'left': settings.left,
            'background-color': settings.color,
            'overflow-y': settings.overflow,
            'z-index': settings.zIndexOut,
            'opacity': settings.opacityOut,
            '-webkit-animation-duration': settings.animationDuration,
            '-moz-animation-duration': settings.animationDuration,
            '-ms-animation-duration': settings.animationDuration,
            'animation-duration': settings.animationDuration
        };
    },

    defaultSettings: {
        modalTarget: 'animatedModal',
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: '0px',
        left: '0px',
        zIndexIn: '9999',
        zIndexOut: '-9999',
        color: '#39BEB9',
        opacityIn: '1',
        opacityOut: '0',
        animatedIn: 'zoomIn',
        animatedOut: 'zoomOut',
        animationDuration: '.6s',
        overflow: 'auto',
        // Callbacks
        beforeOpen: function() {},
        afterOpen: function() {},
        beforeClose: function() {},
        afterClose: function() {}
    },

    extend: function(out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
            if (!arguments[i])
                continue;

            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key))
                    out[key] = arguments[i][key];
            }
        }

        return out;
    },

    modalOnClick: function(event) {
        event.preventDefault();
        this.$('body, html').style.overflow = 'hidden';
        var href = this.modal.getAttribute('href');
        var id = this.id;
        var idConc = '#' + id.getAttribute('id');
        var settings = this.settings;
        if (href == idConc) {
            if (id.classList.contains(settings.modalTarget + '-off')) {
                id.classList.remove(settings.animatedOut);
                id.classList.remove(settings.modalTarget + '-off');
                id.classList.add(settings.modalTarget + '-on');
            }
            if (id.classList.contains(settings.modalTarget + '-on')) {
                settings.beforeOpen();
                id.style.opacity = settings.opacityIn;
                id.style['z-index'] = settings.zIndexIn;
                id.classList.add(settings.animatedIn);
                var open = this.afterOpen.bind(this);
                id.addEventListener('webkitAnimationEnd', open);
                id.addEventListener('mozAnimationEnd', open);
                id.addEventListener('MSAnimationEnd', open);
                id.addEventListener('oanimationend', open);
                id.addEventListener('animationEnd', open);
            };
        }
    },

    closeModal: function(event) {
        event.preventDefault();
        this.$('body, html').style.overflow = 'auto';
        var id = this.id;
        var settings = this.settings;
        settings.beforeClose(); //beforeClose
        if (id.classList.contains(settings.modalTarget + '-on')) {
            id.classList.remove(settings.modalTarget + '-on');
            id.classList.add(settings.modalTarget + '-off');
        }

        if (id.classList.contains(settings.modalTarget + '-off')) {
            id.classList.remove(settings.animatedIn);
            id.classList.add(settings.animatedOut);
            var close = this.afterClose.bind(this);
            id.addEventListener('webkitAnimationEnd', close);
            id.addEventListener('mozAnimationEnd', close);
            id.addEventListener('MSAnimationEnd', close);
            id.addEventListener('oanimationend', close);
            id.addEventListener('animationEnd', close);
        };
    },

    afterClose: function(e) {
        e.target.removeEventListener(e.type, arguments.callee);
        this.id.style['z-index'] = this.settings.zIndexOut;
        this.settings.afterClose(); //afterClose
    },

    afterOpen: function(e) {
        e.target.removeEventListener(e.type, arguments.callee);
        this.id.style['z-index'] = this.settings.zIndexIn;
        this.settings.afterOpen(); //afterOpen
    }
}