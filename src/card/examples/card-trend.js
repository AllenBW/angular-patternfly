/**
 * @ngdoc directive
 * @name patternfly.card.component:pfCard - Trends
 * @restrict E
 *
 * @param {string} headTitle Title for the card
 * @param {string=} subTitle Sub-Title for the card
 * @param {string=} spinnerText Text for the card spinner
 * @param {string=} spinnerCardHeight Height to set for the card when data is loading and spinner is shown
 * @param {boolean=} showTopBorder Show/Hide the blue top border. True shows top border, false (default) hides top border
 * @param {boolean=} showSpinner Show/Hide the spinner for loading state. True shows the spinner, false (default) hides the spinner
 * @param {boolean=} showTitlesSeparator Show/Hide the grey line between the title and sub-title.
 * True (default) shows the line, false hides the line
 * @param {object=} footer footer configuration properties:<br/>
 * <ul style='list-style-type: none'>
 * <li>.iconClass  - (optional) the icon to show on the bottom left of the footer panel
 * <li>.text       - (optional) the text to show on the bottom left of the footer panel, to the right of the icon
 * <li>.href       - (optional) the href link to navigate to when the footer href is clicked
 * <li>.callBackFn - (optional) user defined function to call when the footer href is clicked
 * </ul>
 * *Note: If a href link and a callBackFn are specified, the href link will be called
 * @param {object=} filter filter configuration properties:<br/>
 * <ul style='list-style-type: none'>
 * <li>.filters    - drop down items for the filter.
 *<pre class=''>
 *  Ex:  'filters' : [{label:'Last 30 Days', value:'30'},
 *                    {label:'Last 15 Days', value:'15'},
 *                    {label:'Today', value:'today'}]</pre>
 * <li>.defaultFilter - integer, 0 based index into the filters array
 * <li>.callBackFn - user defined function to call when a filter is selected
 * </ul>
 * @description
 * Component for easily displaying a card with html content
 *
 * @example
 <example module="demo">

 <file name="index.html">
   <div ng-controller="ChartCtrl">
     <label class="label-title">Card With Single Trend</label>
     <pf-card head-title="Cluster Utilization" show-top-border="true" footer="footerConfig" filter="filterConfig" style="width: 50%">
       <pf-trends-chart config="configSingle" chart-data="dataSingle"></pf-trends-chart>
     </pf-card>
     <pf-card head-title="Cluster Utilization" show-top-border="true" show-spinner="dataLoading" spinner-text="Loading" footer="footerConfig" filter="filterConfig" style="width: 50%">
       <pf-trends-chart config="configRightLabel" chart-data="dataSingle"></pf-trends-chart>
     </pf-card>
     <label class="label-title">Card with Multiple Trends</label>
     <pf-card head-title="Performance" sub-title="Last 30 Days" show-top-border="false" show-titles-separator="false" style="width: 65%" footer="actionBarConfig">
       <pf-trends-chart config="configVirtual" chart-data="dataVirtual"></pf-trends-chart>
       <pf-trends-chart config="configPhysical" chart-data="dataPhysical"></pf-trends-chart>
       <pf-trends-chart config="configMemory" chart-data="dataMemory"></pf-trends-chart>
     </pf-card>
   </div>
 </div>
 </file>
 <file name="script.js">
 angular.module( 'demo', ['patternfly.charts', 'patternfly.card'] ).controller( 'ChartCtrl', function( $scope, $timeout ) {

       $scope.dataLoading = true;

       $timeout(function () {
         $scope.dataLoading = false;
       }, 3000 );

       $scope.footerConfig = {
         'iconClass' : 'fa fa-flag',
         'text'      : 'View All Events',
         'callBackFn': function () {
            alert("Footer Callback Fn Called");
          }
       };

       $scope.filterConfig = {
         'filters' : [{label:'Last 30 Days', value:'30'},
                      {label:'Last 15 Days', value:'15'},
                      {label:'Today', value:'today'}],
         'callBackFn': function (f) {
            alert("Filter Callback Fn Called for '" + f.label + "' value = " + f.value);
          },
        'defaultFilter' : '1'
       };

       var today = new Date();
       var dates = ['dates'];
       for (var d = 20 - 1; d >= 0; d--) {
         dates.push(new Date(today.getTime() - (d * 24 * 60 * 60 * 1000)));
       }

       $scope.configSingle = {
         'chartId'      : 'example2TrendsChart',
         'title'        : 'Storage Capacity',
         'layout'       : 'compact',
         'valueType'    : 'actual',
         'units'        : 'TB',
         'tooltipType'  : 'percentage'
       };

       $scope.configRightLabel = {
       'chartId'      : 'exampleRightLabelTrendsChart',
         'title'        : 'Storage Capacity',
         'layout'       : 'compact',
         'valueType'    : 'actual',
         'units'        : 'TB',
         'tooltipType'  : 'percentage',
         'compactLabelPosition'  : 'right'
       };

       $scope.dataSingle = {
         'total': '250',
         'xData': dates,
         'yData': ['used', '90', '20', '30', '20', '20', '10', '14', '20', '25', '68', '44', '56', '78', '56', '67', '88', '76', '65', '87', '76']
       };

       $scope.configVirtual = {
         'chartId'      : 'virtualTrendsChart',
         'layout'       : 'inline',
         'trendLabel'   : 'Virtual Disk I/O',
         'units'        : 'GB',
         'tooltipType'  : 'percentage'
       };

       $scope.dataVirtual = {
         'total': '250',
         'xData': dates,
         'yData': ['used', '90', '20', '30', '20', '20', '10', '14', '20', '25', '68', '44', '56', '78', '56', '67', '88', '76', '65', '87', '76']
       };

       $scope.configPhysical = {
         'chartId'      : 'physicalTrendsChart',
         'layout'       : 'inline',
         'trendLabel'   : 'Physical Disk I/O',
         'units'        : 'MHz',
         'tooltipType'  : 'percentage'
       };

       $scope.dataPhysical = {
         'total': '250',
         'xData': dates,
         'yData': ['used', '20', '20', '35', '20', '20', '87', '14', '20', '25', '28', '44', '56', '78', '56', '67', '88', '76', '65', '87', '16']
       };

       $scope.configMemory = {
         'chartId'      : 'memoryTrendsChart',
         'layout'       : 'inline',
         'trendLabel'   : 'Memory Utilization',
         'units'        : 'GB',
         'tooltipType'  : 'percentage'
       };

       $scope.dataMemory = {
         'total': '250',
         'xData': dates,
         'yData': ['used', '20', '20', '35', '70', '20', '87', '14', '95', '25', '28', '44', '56', '66', '16', '67', '88', '76', '65', '87', '56']
       };

       $scope.actionBarConfig = {
         'iconClass' : 'fa fa-plus-circle',
         'text'      : 'Add New Cluster',
         'callBackFn': function () {
            alert("Footer Callback Fn Called");
          }
       }
     });
 </file>
 </example>
 */
