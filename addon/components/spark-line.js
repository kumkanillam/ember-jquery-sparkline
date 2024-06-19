import Component from '@ember/component';
import layout from '../templates/components/spark-line';
import { addObserver, removeObserver } from '@ember/object/observers';
import { on } from '@ember/object/evented';
import { isPresent } from '@ember/utils';

export default Component.extend({
    layout: layout,
    tagName: 'div',

    classNames: ['sparkline'],

    didInsertElement() {
        this.drawSparkline();
    },
    init() {
        this._super(...arguments);
        addObserver(this, 'data.length',this, "listenDataChanges");
        addObserver(this, 'data.[]', this, "listenDataChanges");
    },

    drawSparkline() {
        let sparkline,
        _this = this,
        options = this.get('options') || {},
        data = this.get('data');

        sparkline = $(this.element).sparkline(data, options);

        $(this.element).on('sparklineClick', function(ev){
            _this.set('sparklineClickedElement', ev.sparklines[0]);
        });
        $(this.element).on('sparklineRegionChange', function(ev){
            _this.set('sparklineRegionChange', ev.sparklines[0]);
        });

        if(isPresent(this.attrs.pieInteractInstance))
            this.attrs.pieInteractInstance.update(sparkline[0].interactInstance);//this instance is used for highlight the pie slice programatically using the handler instance provided with the sparkline instance.
    },

    click() {
        if(this.get('sparklineClick')){
            this.sparklineClick(this.get('sparklineClickedElement'));
        }
    },

    mouseMove() {
        if (this.get('sparklineHover')) {
            let sp = this.get('sparklineRegionChange');
            if (sp) {
                this.sparklineHover(sp);
            }
        }
    },

    mouseLeave() {
        if (this.get('sparklineHoverOut')) {
            this.sparklineHoverOut();
        }
    },
    listenDataChanges() {
        this.drawSparkline();
    },
    destroySparkline: on('willDestroyElement', function() {
        removeObserver(this, 'data.length',this, "listenDataChanges");
        removeObserver(this, 'data.[]', this, "listenDataChanges");
        this.destroy();
    }),
});