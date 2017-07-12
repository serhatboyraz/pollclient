anketbazApp.service('PollService', function ($http) {
    var pollService = {};
    pollService.PollData = {};
    pollService.StartDateTime = null;
    pollService.FieldData = '';
    pollService.PollId = '';
    pollService.OwnerId = '';
    pollService.OwnerType = '';
    pollService.ShowResult = false;
    pollService.Answers = [];

    return pollService;
});

anketbazApp.service('UserService', function ($http) {
    var userService = {};

    userService.SetUser = function (userData) {
        localStorage.setItem('User', JSON.stringify(userData));
    };

    userService.GetUser = function () {
        var localVal = localStorage.getItem('User');
        if (localVal != undefined)
            return JSON.parse(localVal);
        return null;
    };
    return userService;
});

anketbazApp.service('WsProviderService', function ($http) {

    var WsProvider = {};
    WsProvider.RequestActive = false;

    WsProvider.Send = function (serviceName, method, data, successCB) {
        WsProvider.RequestActive = true;
        var bData = Base64.encode(JSON.stringify(data));
        var sendUrl = ServiceUrl + 'DynamicService.svc/CallService?serviceName=' + serviceName + '&methodName=' + method + '&jsonParams=' + bData;
        $http.get(sendUrl).then(function successCallback(response) {
            WsProvider.RequestActive = false;
            var resultData = Deflate(response.data);
            if (!resultData.Result) {
            }
            successCB(resultData);
        }, function errorCallback(response) {
            WsProvider.RequestActive = false;
        });
    };
    WsProvider.SendPost = function (serviceName, method, data, successCB) {
        WsProvider.RequestActive = true;
        var bData = Base64.encode(JSON.stringify(data));
        var postData = {
            serviceName: serviceName,
            methodName: method,
            jsonParams: bData
        };
        var sendUrl = ServiceUrl + 'DynamicService.svc/CallServicePost';

        $http
        ({
            method: 'POST',
            url: sendUrl,
            data: postData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {
            WsProvider.RequestActive = false;
            var resultData = Deflate(response.data.CallServicePostResult);
            if (!resultData.Result) {
            }
            successCB(resultData);
        }, function errorCallback(response) {
            WsProvider.RequestActive = false;
            errorCB(response);
        });
    };
    WsProvider.SendFile = function (fileData, jsonData, successCB, errorCB) {
        WsProvider.RequestActive = true;
        if (!(fileData && fileData.size > 0)) return;
        var bData = Base64.encode(JSON.stringify(jsonData));
        var sendUrl = ServiceUrl + 'FileService.svc/SetFile/' + bData;

        $http
        ({
            method: 'POST',
            url: sendUrl,
            headers: {
                'Content-length': fileData.size
            },
            data: fileData
        }).then(function successCallback(response) {
            WsProvider.RequestActive = false;
            var resultData = Deflate(response.data);
            successCB(resultData);
        }, function errorCallback(response) {
            WsProvider.RequestActive = false;
            errorCB(response);
        });
    };
    WsProvider.RemoveFile = function (jsonData, successCB, errorCB) {
        WsProvider.RequestActive = true;
        var bData = Base64.encode(JSON.stringify(jsonData));
        var sendUrl = ServiceUrl + 'FileService.svc/RemoveFile/' + bData;

        $http.get(sendUrl).then(function successCallback(response) {
            WsProvider.RequestActive = false;
            var resultData = Deflate(response.data);
            successCB(resultData);
        }, function errorCallback(response) {
            WsProvider.RequestActive = false;
            errorCB(response);
        });

    };
    return WsProvider;
});
