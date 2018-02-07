(function () {
    'use strict';

    angular
        .module('smn-ui')
        .directive('uiTabs', uiTabs);

    function uiTabs() {

        var directive = {
            bindToController: true,
            controller: controller,
            controllerAs: 'vm',
            restrict: 'E',
            transclude: true,
            scope: {
                stretch: '='
            },
            templateUrl: 'components/tabs/tabs.directive.tpl.html'
        };

        return directive;
    }

    controller.$inject = ['$element', '$animateCss', '$timeout', '$scope'];
    function controller($element, $animateCss, $timeout, $scope) {

        var vm = this;

        vm.tabs = [];
        vm.add = add;
        vm.remove = remove;
        vm.openTab = openTab;
        vm.tabsGoRight = tabsGoRight;
        vm.tabsGoLeft = tabsGoLeft;

        angular.element(window).resize(function () {
            $timeout(function () {
                openTab(vm.tabActive);
                verifyTabOverflowScroll();
            });
        });

        function add(tab) {
            tab.index = vm.tabs.length;
            if (tab.index === 0) {
                vm.tabActive = tab;
                $timeout(function () {
                    openTab(tab);
                    verifyTabOverflowScroll();
                    var overflowContainer = angular.element('ui-tabs .ui-flex.wrap');
                    overflowContainer.on('scroll', function () {
                        verifyTabOverflowScroll();
                    });
                });
            }
            vm.tabs.push(tab);
        }

        function remove(tab) {
            var clickedTab = tab.index;

            vm.tabs.splice(vm.tabActive.index, 1);
            for (var i = vm.tabActive.index; i < vm.tabs.length; i++) {
                vm.tabs[i].index = i;
            }
            tab = vm.tabs[tab.index];

            if(clickedTab === vm.tabs.length){
                tab = vm.tabs[clickedTab - 1];
            }

            tab && openTab(tab);
        }

        function openTab(tab) {

            var elements = $element.find('.bar .ui-button');
            var tabsContent = $element.find('ui-tab');

            var tabElement = elements.eq(tab.index);
            var contentElement = tabsContent.eq(tab.index);

            var tabElementActive = elements.eq(vm.tabActive.index);
            var contentElementActive = tabsContent.eq(vm.tabActive.index);

            $animateCss($element.find('indicator'), {
                from: {
                    width: tabElementActive.prop('offsetWidth'),
                    left: tabElementActive.prop('offsetLeft')
                },
                to: {
                    width: tabElement.prop('offsetWidth'),
                    left: tabElement.prop('offsetLeft')
                }
            }).start();

            contentElement.children().removeClass('deactive');
            $animateCss($element.find('.content'), {
                from: {
                    height: contentElementActive.height(),
                },
                to: {
                    transform: 'translateX(-' + tab.index * 100 + '%)',
                    height: contentElement.height(),
                }})
                .start()
                .finally(function () {
                    $element.find('ui-tab').map(function (index, tabItem) {
                        if (index !== tab.index) {
                            angular.element(tabItem).children().addClass('deactive');
                        }
                        else {
                            angular.element(tabItem).children().removeClass('deactive');
                        }
                    });

                    $element.find('.content').height('auto')
                });

            vm.tabActive.active = false;
            tab.active = true;
            vm.tabActive = tab;

            var overflowContainer = angular.element('ui-tabs .ui-flex.wrap');
            overflowContainer.animate({scrollLeft: tabElement.prop('offsetLeft') - 50}, 300);

        }

        function verifyTabOverflowScroll() {
            var buttons = angular.element('ui-tabs .bar button');
            var size = 0;
            angular.forEach(buttons, function(button, index) {
                size = size + angular.element(button).outerWidth();
            });
            var overflowWidth = angular.element('ui-tabs .bar').width();
            var tabsWidth = vm.stretch ? size : size + (overflowWidth > 600 ? 54 : 6);

            var overflowContainer = angular.element('ui-tabs .ui-flex.wrap');
            var scrollLeft = overflowContainer.scrollLeft();

            $scope.$apply(function () {
                if (tabsWidth > overflowWidth) {
                    if (tabsWidth - scrollLeft === overflowWidth) {
                        vm.showRight = false;
                    }
                    else {
                        vm.showRight = true;
                    }

                    if (scrollLeft) {
                        vm.showLeft = true;
                    }
                    else {
                        vm.showLeft = false;
                    }
                } else {
                    vm.showLeft = false;
                    vm.showRight = false;
                }
            });
        }

        function tabsGoRight() {
            var overflowContainer = angular.element('ui-tabs .ui-flex.wrap');

            overflowContainer.animate({scrollLeft: overflowContainer.scrollLeft() + 210}, 300);
        }

        function tabsGoLeft() {
            var overflowContainer = angular.element('ui-tabs .ui-flex.wrap');

            overflowContainer.animate({scrollLeft: overflowContainer.scrollLeft() - 210}, 300);
        }
    }

})();
