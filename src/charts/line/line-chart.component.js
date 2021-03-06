/**
 * @ngdoc directive
 * @name patternfly.charts.component:pfLineChart
 * @restrict E
 *
 * @description
 *   Component for rendering a line chart.
 *   <br><br>
 *   See http://c3js.org/reference.html for a full list of C3 chart options.
 *
 * @param {object} config configuration settings for the line chart:<br/>
 * <ul style='list-style-type: none'>
 * <li>.chartId            - the ID of the container that the chart should bind to
 * <li>.units              - unit label for values, ex: 'MHz','GB', etc..
 * <li>.tooltipFn          - (optional) override the tooltip contents generation functions. Should take a data point and
 *                           return HTML markup for the tooltip contents. Setting this overrides the tooltipType value.
 * <li>.area               - (optional) overrides the default Area properties of the C3 chart
 * <li>.size               - (optional) overrides the default Size properties of the C3 chart
 * <li>.axis               - (optional) overrides the default Axis properties of the C3 chart
 * <li>.color              - (optional) overrides the default Color properties of the C3 chart
 * <li>.legend             - (optional) overrides the default Legend properties of the C3 chart
 * <li>.point              - (optional) overrides the default Point properties of the C3 chart
 * </ul>
 *
 * @param {object} chartData the data to be shown as an area chart<br/>
 * First and second Array elements, xData and yData, must exist, next data arrays are optional.<br/>
 * <ul style='list-style-type: none'>
 * <li>.xData      - Array, X values for the data points, first element must be the name of the data
 * <li>.yData      - Array, Y Values for the data points, first element must be the name of the data
 * <li>.yData1     - Array, Y Values for the data points, first element must be the name of the data
 * <li>.[...]      - Array, Y Values for the data points, first element must be the name of the data
 * </ul>
 *
 * @param {boolean=} showXAxis override config settings for showing the X Axis
 * @param {boolean=} showYAxis override config settings for showing the Y Axis
 * @param {boolean=} setAreaChart override config settings for showing area type chart

 * @example
 <example module="patternfly.charts">
   <file name="index.html">
     <div ng-controller="ChartCtrl" class="row" style="display:inline-block; width: 100%;">
       <div class="col-md-12">
         <pf-line-chart config="config" chart-data="data" set-area-chart="custAreaChart" show-x-axis="custShowXAxis" show-y-axis="custShowYAxis"></pf-line-chart>
       </div>
       <hr class="col-md-12">
       <div class="col-md-12">
         <div class="row">
           <div class="col-md-6">
             <form role="form"">
               <div class="form-group">
                 <label class="checkbox-inline">
                   <input type="checkbox" ng-model="custShowXAxis">X Axis</input>
                 </label>
                 <label class="checkbox-inline">
                   <input type="checkbox" ng-model="custShowYAxis">Y Axis</input>
                 </label>
                 <label class="checkbox-inline">
                   <input type="checkbox" ng-model="custAreaChart">Area Chart</input>
                 </label>
               </div>
             </form>
           </div>
           <div class="col-md-3">
                 <button ng-click="addDataPoint()">Add Data Point</button>
                 <button ng-click="resetData()">Reset Data</button>
           </div>
         </div>
       </div>
       <div class="col-md-12">
         <div class="row">
           <div class="col-md-6">
             <form role="form"">
               <div class="form-group">
                 <label class="checkbox-inline">
                   <input type="checkbox" ng-model="data.dataAvailable">Data Available</input>
                 </label>
               </div>
             </form>
           </div>
         </div>
       </div>
     </div>
   </file>

   <file name="script.js">
     angular.module( 'patternfly.charts' ).controller( 'ChartCtrl', function( $scope, pfUtils ) {

       $scope.config = {
         chartId: 'exampleLine',
         grid: {y: {show: false}},
         point: {r: 1},
         color: {pattern: [pfUtils.colorPalette.blue, pfUtils.colorPalette.green]}
       };

       var today = new Date();
       var dates = ['dates'];
       for (var d = 20 - 1; d >= 0; d--) {
         dates.push(new Date(today.getTime() - (d * 24 * 60 * 60 * 1000)));
       }

       $scope.data = {
         dataAvailable: true,
         xData: dates,
         yData0: ['Created', 12, 10, 10, 62, 17, 10, 15, 13, 17, 10, 12, 10, 10, 12, 17, 16, 15, 13, 17, 10],
         yData1: ['Deleted', 10, 17, 76, 14, 10, 10, 10, 10, 10, 10, 10, 17, 17, 14, 10, 10, 10, 10, 10, 10]
       };

       $scope.custShowXAxis = false;
       $scope.custShowYAxis = false;
       $scope.custAreaChart = false;

       $scope.addDataPoint = function () {
         $scope.data.xData.push(new Date($scope.data.xData[$scope.data.xData.length - 1].getTime() + (24 * 60 * 60 * 1000)));
         $scope.data.yData0.push(Math.round(Math.random() * 100));
         $scope.data.yData1.push(Math.round(Math.random() * 100));
       };

       $scope.resetData = function () {
         $scope.data = {
           xData: dates,
           yData0: ['Created', 12, 10, 10, 62],
           yData1: ['Deleted', 10, 17, 76, 14]
         };
       };
     });
   </file>
 </example>
 */
angular.module('patternfly.charts').component('pfLineChart', {
  bindings: {
    config: '<',
    chartData: '<',
    showXAxis: '<?',
    showYAxis: '<?',
    setAreaChart: '<?'
  },
  templateUrl: 'charts/line/line-chart.html',
  controller: function (pfUtils) {
    'use strict';
    var ctrl = this, prevChartData;

    ctrl.updateAll = function () {
      // Need to deep watch changes in chart data
      prevChartData = angular.copy(ctrl.chartData);

      // Create an ID for the chart based on the chartId in the config if given
      if (ctrl.lineChartId === undefined) {
        ctrl.lineChartId = 'lineChart';
        if (ctrl.config.chartId) {
          ctrl.lineChartId = ctrl.config.chartId + ctrl.lineChartId;
        }
      }

      /*
       * Setup Axis options. Default is to not show either axis. This can be overridden in two ways:
       *   1) in the config, setting showAxis to true will show both axes
       *   2) in the attributes showXAxis and showYAxis will override the config if set
       *
       * By default only line and the tick marks are shown, no labels. This is a line and should be used
       * only to show a brief idea of trending. This can be overridden by setting the config.axis options per C3
       */

      if (ctrl.showXAxis === undefined) {
        ctrl.showXAxis = (ctrl.config.showAxis !== undefined) && ctrl.config.showAxis;
      }

      if (ctrl.showYAxis === undefined) {
        ctrl.showYAxis = (ctrl.config.showAxis !== undefined) && ctrl.config.showAxis;
      }

      ctrl.defaultConfig = patternfly.c3ChartDefaults().getDefaultLineConfig();
      ctrl.defaultConfig.axis = {
        x: {
          show: ctrl.showXAxis === true,
          type: 'timeseries',
          tick: {
            format: function () {
              return '';
            }
          }
        },
        y: {
          show: ctrl.showYAxis === true,
          tick: {
            format: function () {
              return '';
            }
          }
        }
      };

      /*
       * Setup Chart type option. Default is Line Chart.
       */
      if (ctrl.setAreaChart === undefined) {
        ctrl.setAreaChart = (ctrl.config.setAreaChart !== undefined) && ctrl.config.setAreaChart;
      }

      // Convert the given data to C3 chart format
      ctrl.config.data = ctrl.getLineData(ctrl.chartData);

      // Override defaults with callers specifications
      ctrl.defaultConfig = pfUtils.merge(ctrl.defaultConfig, ctrl.config);

      // Will trigger c3 chart generation
      ctrl.chartConfig = pfUtils.merge(ctrl.defaultConfig, ctrl.config);
    };

    /*
     * Convert the config data to C3 Data
     */
    ctrl.getLineData = function (chartData) {
      var lineData = {
        type: ctrl.setAreaChart ? "area" : "line"
      };

      if (chartData && chartData.dataAvailable !== false && chartData.xData) {
        lineData.x = chartData.xData[0];
        // Convert the chartData dictionary into a C3 columns data arrays
        lineData.columns = Object.keys(chartData).map(function (key) {
          return chartData[key];
        });
      }

      return lineData;
    };

    ctrl.$onChanges = function (changesObj) {
      ctrl.updateAll();
    };

    ctrl.$doCheck = function () {
      // do a deep compare on chartData
      if (!angular.equals(ctrl.chartData, prevChartData)) {
        ctrl.updateAll();
      }
    };
  }
});
