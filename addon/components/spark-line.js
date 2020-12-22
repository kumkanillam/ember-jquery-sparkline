import Ember from 'ember';
import layout from '../templates/components/spark-line';

const { on,isPresent } = Ember;

export default Ember.Component.extend({
    layout: layout,
    tagName: 'div',

    classNames: ['sparkline'],

    didInsertElement() {
        this.drawSparkline();
    },

    drawSparkline() {
        let sparkline,
        _this = this,
        options = this.get('options') || {},
        data = this.get('data');

        sparkline = this.$().sparkline(data, options);

        this.$().bind('sparklineClick', (ev) => {
            _this.set('sparklineClickedElement', ev.sparklines[0]);
        });
        this.$().bind('sparklineRegionChange', (ev) => {
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

    listenDataChanges: function () {
        this.drawSparkline();
    }.observes('data.length','data.[]'),

    destroySparkline: on('willDestroyElement', function() {
        this.destroy();
    }),
});