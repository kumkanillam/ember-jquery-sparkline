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
        var sparkline,
        _this = this;

        let options = this.get('options') || {};
        let data = this.get('data');
        sparkline = this.$().sparkline(data, options);

        this.$().bind('sparklineClick', function(ev) {
            _this.set('sparklineClick', ev.sparklines[0]);
        });
        this.$().bind('sparklineRegionChange', function(ev) {
            _this.set('sparklineRegionChange', ev.sparklines[0]);
        });
        
        if(isPresent(this.attrs.pieInteractInstance))
        this.attrs.pieInteractInstance.update(sparkline[0].interactInstance);//this instance is used for highlight the pie slice programatically using the handler instance provided with the sparkline instance.
    },

    click() {
        this.sendAction('sparklineClick', this.get('sparklineClick'));
    },

    mouseMove() {
        if (this.get('hover')) {
            let sp = this.get('sparklineRegionChange');
            if (sp) {
                this.sendAction('hover', sp);
            }
        }
    },

    mouseLeave() {
        if (this.get('hoverOut')) {
            this.sendAction('hoverOut');
        }
    },

    listenDataChanges: function () {
        this.drawSparkline();
    }.observes('data.length','data.[]'),

    destroySparkline: on('willDestroyElement', function() {
    this.destroy();
    }),
});
