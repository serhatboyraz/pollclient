var anketbazApp = angular.module('anketbazApp', ['ui.router', 'ui.mask']);

anketbazApp.run(function ($rootScope, WsProviderService, $state) {
    $rootScope.WsProviderService = WsProviderService;


    $rootScope.CheckUser = function () {
        $rootScope.User = UserService.GetUser();
        if ($rootScope.User == null) {
            $state.go('login');
        }
    };
});

anketbazApp.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('main', {
            url: '/main/:pollId/:ownerId/:ownerType',
            controller: 'MainController'
        })
        .state('startPoll', {
            url: '/startpoll',
            templateUrl: 'templates/startpoll.html',
            controller: 'StartPollController'
        })
        .state('pollPassword', {
            url: '/pollpassword',
            templateUrl: 'templates/password.html',
            controller: 'PollPasswordController'
        })
        .state('question', {
            url: '/question/:questionId',
            templateUrl: 'templates/question.html',
            controller: 'QuestionController'
        })
        .state('questionList', {
            url: '/questionList',
            templateUrl: 'templates/questionList.html',
            controller: 'QuestionListController'
        })
        .state('404', {
            url: '/404',
            templateUrl: 'templates/404.html'
            // controller: 'LoginController'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
        })
        .state('endpoll', {
            url: '/endpoll',
            //templateUrl: 'templates/endpoll.html',
            controller: 'EndPollController'
        })
        .state('pollList', {
            url: '/polllist',
            templateUrl: 'templates/pollList.html',
            controller: 'PollListController'
        });
    $urlRouterProvider.otherwise('/login');
});


anketbazApp.filter('stringToDate', function () {
    return function (data) {
        return data.substring(6, 8) + "/" + data.substring(4, 6) + "/" + data.substring(0, 4);
    }
});

anketbazApp.filter('stringToTime', function () {
    return function (data) {
        return data.substring(0, 2) + ":" + data.substring(2, 4);
    }
});

