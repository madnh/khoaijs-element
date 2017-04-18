(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['khoaijs'], function (Khoai) {
            Khoai.Element = factory();
        });
    } else {
        root.Khoai.Element = factory();
    }
}(this, function () {
    "use strict";

    var Element = {};

    /**
     *
     * @param el
     * @param className
     * @return {boolean}
     */
    Element.hasClass = function (el, className) {
        if (el.classList)
            return el.classList.contains(className);

        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    };

    /**
     *
     * @param el
     * @param className
     */
    Element.addClass = function (el, className) {
        var classes = className.split(' ');

        for (var i = 0, len = classes.length; i < len; i++) {
            var currentClass = classes[i].trim();

            if (this.hasClass(el, currentClass))
                return;

            if (el.classList)
                el.classList.add(currentClass);
            else
                el.className += ' ' + currentClass;
        }
    };

    /**
     *
     * @param el
     * @param className
     */
    Element.removeClass = function (el, className) {
        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    };

    /**
     *
     * @param el
     * @param className
     * @param add
     */
    Element.toggleClass = function (el, className, add) {
        if (add === undefined) {
            if (this.hasClass(el, className)) {
                this.removeClass(el, className)
            }
            else {
                this.addClass(el, className)
            }
        }

        if (add && !this.hasClass(el, className)) {
            this.addClass(el, className);
            return
        }

        if (!add && this.hasClass(el, className)) {
            this.removeClass(el, className);

        }
    };

    /**
     * Get element absolution position.
     * If the second parameter value is false, the scrolling
     * won't be added to the result (which could improve the performance).
     *
     * @param element
     * @param ignoreScrolling
     * @return {{top: number, left: number}}
     */
    Element.absolutePosition = function (element, ignoreScrolling) {
        var top = ignoreScrolling === true ? 0 : document.body.scrollTop,
            left = 0;

        do {
            top += element.offsetTop || 0;

            if (ignoreScrolling !== true)
                top -= element.scrollTop || 0;

            left += element.offsetLeft || 0;
            element = element.offsetParent
        } while (element);

        return {
            top: top,
            left: left
        }
    };

    /**
     *
     * @param input
     * @return {*}
     */
    Element.getCaretPosition = function (input) {
        if (document.selection) {
            var selection = document.selection.createRange();

            selection.moveStart('character', -input.value.length);
            return selection.text.length
        }

        if (input.selectionStart !== undefined)
            return input.selectionStart;

        return 0
    };

    /**
     *
     * @param input
     * @param position
     */
    Element.setCaretPosition = function (input, position) {
        if (document.selection) {
            var range = input.createTextRange();

            setTimeout(function () {
                // Asynchronous layout update, better performance
                range.collapse(true);
                range.moveStart("character", position);
                range.moveEnd("character", 0);
                range.select();
                range = null;
                input = null
            }, 0)
        }

        if (input.selectionStart !== undefined) {
            setTimeout(function () {
                // Asynchronous layout update
                input.selectionStart = position;
                input.selectionEnd = position;
                input = null
            }, 0)
        }
    };

    /**
     *
     * @param element
     * @param point
     * @return {boolean}
     */
    Element.elementContainsPoint = function (element, point) {
        var elementPosition = this.absolutePosition(element),
            elementRight = elementPosition.left + element.offsetWidth,
            elementBottom = elementPosition.top + element.offsetHeight;

        return point.x >= elementPosition.left && point.x <= elementRight
            && point.y >= elementPosition.top && point.y <= elementBottom
    };

    return Element;
}));