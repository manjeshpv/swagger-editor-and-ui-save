'use strict';
angular.module('saveOption',[]).factory('saveOptionService',function($q, $http){
  var dataFactory, urlBase;
  urlBase = "/services";
  dataFactory = {
    serviceName: "No Service Selected"
  };
  dataFactory.service = function() {
    console.log("returning",dataFactory.service);
    return localStorage.service
  };
  dataFactory.getServices = function() {
    var deferred;
    deferred = $q.defer();
    $http({
      method: "GET",
      url: urlBase
    }).success(function(data, status, headers, config) {
      return deferred.resolve(data);
    }).error(function(data, status) {
      return deferred.reject(data);
    });
    return deferred.promise;
  };



  dataFactory.loadProject = function(service) {
    alert("load service: "+service)
    var deferred;
    deferred = $q.defer();
    $http({
      method: "GET",
      url: urlBase+"/"+service
    }).success(function(data, status, headers, config) {
      localStorage['ngStorage-SwaggerEditorCache'] = JSON.stringify(data);
      localStorage.service = service
      window.location = "/"
      return deferred.resolve(data);
    }).error(function(data, status) {
      return deferred.reject(data);
    });
    return deferred.promise;
  };
  dataFactory.saveProject = function() {
    localStorage.service = service
    alert("Saving Service: " + service)
    var deferred;
    deferred = $q.defer();
    console.log("localStorage['ngStorage-SwaggerEditorCache']",localStorage['ngStorage-SwaggerEditorCache'])
    $http({
      method: "POST",
      url: urlBase,
      data: {
        name:service,
        file:localStorage['ngStorage-SwaggerEditorCache']

      }
    }).success(function(data, status, headers, config) {
      localStorage.service = service
      window.location = "/"
      return deferred.resolve(data);
    }).error(function(data, status) {
      return deferred.reject(data);
    });
    return deferred.promise;
  };

  return dataFactory
});
window.SwaggerEditor = angular.module('SwaggerEditor', [
  'ngSanitize',
  'ui.router',
  'ui.ace',
  'ui.bootstrap',
  'ngStorage',
  'ngSanitize',
  'hc.marked',
  'ui.layout',
  'ngFileUpload',
  'mohsen1.schema-form',
  'jsonFormatter',
  'saveOption'
]);
