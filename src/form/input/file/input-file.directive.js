(function () {
    'use strict';

    angular
        .module('smn-ui')
        .directive('uiInputFile', uiInputFile);

    uiInputFile.$inject = ['$compile'];

    function uiInputFile($compile) {
        var directive = {
            require: 'ngModel',
            restrict: 'A',
            link: link,
            scope: {
                'ngModel': '=',
                'accept': '@?',
                'uiFileChange': '&',
                'uiMaxSize': '@?',
                'uiMaxFileSize': '@?',
                'uiValidExt': '@?',
                'uiRead': '&?',
                'uiError': '=?',
                'uiReadDataUrl': '=?'
            }
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            ctrl.$formatters.push(function (value) {
                if (!value) {
                    element.val('').trigger('change');
                    ctrl.$setValidity('uiMaxSize', true);
                    ctrl.$setValidity('uiMaxFileSize', true);
                    ctrl.$setValidity('uiAccept', true);
                }
            });
            ctrl.$parsers.push(function (value) {
                if (!value)
                    element.val('').trigger('change');
            });

            element[0].addEventListener('change', handleFileSelect, false)
            function handleFileSelect(e) {
                e.stopPropagation();
                e.preventDefault();

                var files = e.target.files;
                scope.$apply(function () {
                    scope.uiReadDataUrl = 'uiReadDataUrl' in attrs && files.length ? [] : null;
                    ctrl.$setDirty();
                    ctrl.$setValidity('uiMaxSize', true);
                    ctrl.$setValidity('uiMaxFileSize', true);
                    ctrl.$setValidity('uiAccept', true);

                    // Verificação de tamanho
                    var maxSize = scope.uiMaxSize ? toByte(scope.uiMaxSize) : null,
                        maxFileSize = scope.uiMaxFileSize ? toByte(scope.uiMaxFileSize) : null,
                        accepts = scope.accept.split(',');
                    var sum = 0;
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i],
                            fileSize = file.size,
                            fileType = file.type,
                            validMaxFileSize = maxFileSize && fileSize > maxFileSize,
                            validMaxSize = maxSize && sum > maxSize,
                            fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1);

                        if (validMaxFileSize)
                            ctrl.$setValidity('uiMaxFileSize', false);
                        sum += fileSize;

                        // Verificar MIME Types
                        var validType = false;
                        for (var j = 0; j < accepts.length; j++) {
                            var accept = accepts[j].trim();
                            // Checa se tem apenas um asterisco
                            // e se ele está no final
                            var regex = accept.match(/^[^\*]*\*$/) ? new RegExp('^' + accept) : new RegExp('^' + accept + '$');
                            if (fileType.match(regex) || fileExtension.match(regex)) {
                                validType = true;
                                break;
                            }
                        }
                        if (!validType)
                            ctrl.$setValidity('uiAccept', false);

                        if (maxSize && sum > maxSize)
                            ctrl.$setValidity('uiMaxSize', false);

                        if (validType && !validMaxFileSize && !validMaxSize) {
                            scope.uiReadDataUrl.push({});
                            readFile(file, scope.uiReadDataUrl[i], i);
                        }
                        else if (scope.uiError) {
                            scope.uiError(file, {
                                type: !validType,
                                maxSize: validMaxSize,
                                maxFileSize: validMaxFileSize
                            }, i);
                        }
                    }

                    scope.ngModel = e.target.files;

                    scope.uiFileChange({ '$files': scope.ngModel, '$error': ctrl.$invalid ? ctrl.$error : null });
                });
            }

            function toByte(sizeString) {
                sizeString = sizeString.toString();
                var unitMatch = sizeString.match(/[a-zA-Z]+/g),
                    unit = unitMatch ? unitMatch[0] : null,
                    sizeMatch = sizeString.match(/\d+/),
                    unitSize = sizeMatch ? parseInt(sizeMatch[0]) : null,
                    size = unitSize;
                switch (unit) {
                    case 'KB':
                        size = unitSize * 1024;
                        break;
                    case 'MB':
                        size = unitSize * Math.pow(1024, 2);
                        break;
                    case 'GB':
                        size = unitSize * Math.pow(1024, 3);
                        break;
                    case 'TB':
                        size = unitSize * Math.pow(1024, 4);
                        break;
                    case 'PB':
                        size = unitSize * Math.pow(1024, 5);
                        break;
                    case 'EB':
                        size = unitSize * Math.pow(1024, 6);
                        break;
                    case 'ZB':
                        size = unitSize * Math.pow(1024, 7);
                        break;
                    case 'YB':
                        size = unitSize * Math.pow(1024, 8);
                        break;
                }
                return size;
            }

            function readFile(file, data, index) {
                var reader = new FileReader();
                data.resolved = 'false';
                reader.onload = function (e) {
                    scope.$apply(function () {
                        data.result = e.target.result;
                        data.resolved = true;
                        scope.uiRead && scope.uiRead({ $data: data.result, $index: index, $file: file })
                    });
                };
                reader.onerror = function (e) {
                    scope.$apply(function () {
                        data.error = e.target.error;
                    });
                };
                reader.onprogress = function (e) {
                    if (!e.lengthComputable)
                        return;
                    scope.$apply(function () {
                        data.progress = {
                            loaded: e.loaded,
                            total: e.total,
                            percent: Math.round((e.loaded/e.total) * 100)
                        }
                    });
                };
                reader.readAsDataURL(file);
            }
        }
    }

})();

