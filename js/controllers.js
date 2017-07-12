anketbazApp.controller('PollListController', function ($scope, $state) {
    $scope.PollList = [];
    $scope.OpenPoll = function (pollId) {
        $state.go('main', {pollId: pollId});
    };
});
anketbazApp.controller('LoginController', function ($scope, $state, $stateParams, WsProviderService, UserService) {
    $scope.UserData = {
        Mail: '',
        Password: ''
    };
    $scope.Login = function () {
        var serviceData = {
            mail: $scope.UserData.Mail,
            password: $scope.UserData.Password
        };
        WsProviderService.Send('StaffService', 'Login', serviceData, function (e) {
            if (e.Result) {
                UserService.SetUser(e.Data);
            } else {
                alert(e.Data);
            }
        });
    };
});

anketbazApp.controller('QuestionListController', function ($scope, $state, $stateParams, WsProviderService, PollService) {
    $scope.PollData = {};
    $scope.QuestionList= PollService.PollData.Questions;

});
anketbazApp.controller('PollPasswordController', function ($scope, $state, $stateParams, WsProviderService, PollService) {
    $scope.PollData = {};

    $scope.CheckPassword = function () {
        if ($scope.PollData.Password == PollService.PollData.Password) {
            $state.go('startPoll');
            //$state.go('questionList');
        } else {
            alert('hatali sifre');
        }
    };
});

anketbazApp.controller('EndPollController', function ($scope, $state, $stateParams, WsProviderService, PollService) {
    var diffSecond = Math.floor((new Date() - PollService.StartDateTime) / 1000);
    var serviceData = {
        pollid: PollService.PollId,
        ownerid: PollService.OwnerId,
        ownertype: PollService.OwnerType,
        guestanswerdata: PollService.Answers,
        fielddata: PollService.FieldData,
        complatesecond: diffSecond
    };
    WsProviderService.Send('PollService', 'SetGuestAnswers', serviceData, function (e) {
        if (e.Result) {
            alert('anket tamamlandi.');
            setCookie('polldata-' + PollService.PollId, JSON.stringify({
                PollId: PollService.PollId,
                OwnerId: PollService.OwnerId,
                OwnerType: PollService.OwnerType
            }));
            if (PollService.ShowResult) {

                //Sonuclari gostermek icin servisten cek.
            }
        } else {
            alert(e.Data);
        }
    });
});

anketbazApp.controller('QuestionController', function ($scope, $state, $stateParams, WsProviderService, PollService) {
    $scope.QuestionData = {};
    $scope.Answers = [];
    $scope.ShowPreviousQuestionButton = false;
    $scope.ShowNextQuestionButton = false;

    var currentIndex = 0;

    for (var i = 0; i < PollService.PollData.Questions.length; i++) {
        if (PollService.PollData.Questions[i].QuestionId == $stateParams.questionId) {
            $scope.QuestionData = PollService.PollData.Questions[i];
            currentIndex = i;
            break;
        }
    }

    if (currentIndex != 0)
        $scope.ShowPreviousQuestionButton = true;

    if (currentIndex != PollService.PollData.Questions.length - 1)
        $scope.ShowNextQuestionButton = true;

    $scope.SetAnswer = function (questionId, answerId) {
        var isExist = false;
        $scope.QuestionData.Answers.forEach(function (e) {
            if (e.QuestionId == questionId) {
                e.AnswerId = answerId;
                isExist = true;
            }
        });
        if (!isExist) {
            PollService.Answers.push({QuestionId: questionId, AnswerId: answerId});
        }
        $scope.NextQuestion(questionId);
    };

    $scope.SetNextQuestion = function () {
        for (var i = 0; i < PollService.Answers.length; i++) {
            if ($scope.QuestionData.QuestionId == PollService.Answers[i].QuestionId) {
                PollService.Answers.splice(i, 1);
            }
        }
        if ($scope.QuestionData.QuestionType == 'S') {
            if ($scope.QuestionData.AnswerId != undefined)
                PollService.Answers.push({
                    QuestionId: $scope.QuestionData.QuestionId,
                    AnswerId: $scope.QuestionData.AnswerId
                });
        }
        if ($scope.QuestionData.QuestionType == 'M') {
            $scope.QuestionData.Answers.forEach(function (e) {
                if (e.Checked != undefined) {
                    PollService.Answers.push({
                        QuestionId: $scope.QuestionData.QuestionId,
                        AnswerId: e.AnswerId
                    });
                }
            });

        }
        nextQuestion();
    };

    $scope.EndPoll = function () {
        $scope.SetNextQuestion();
        $state.go('endpoll');
    };

    $scope.PreviousQuestion = function () {
        var currentIndex = 0;
        for (var i = 0; i < PollService.PollData.Questions.length; i++) {
            if (PollService.PollData.Questions[i].QuestionId == $scope.QuestionData.QuestionId) {
                currentIndex = i;
                break;
            }
        }
        if (PollService.PollData.Questions[currentIndex - 1] != undefined) {
            $state.go('question', {questionId: PollService.PollData.Questions[currentIndex - 1].QuestionId});
        }
    };

    $scope.NextQuestion = function () {

        $scope.SetNextQuestion();
    };

    var nextQuestion = function () {
        var currentIndex = 0;
        for (var i = 0; i < PollService.PollData.Questions.length; i++) {
            if (PollService.PollData.Questions[i].QuestionId == $scope.QuestionData.QuestionId) {
                currentIndex = i;
                break;
            }
        }
        if (PollService.PollData.Questions[currentIndex + 1] != undefined) {
            $state.go('question', {questionId: PollService.PollData.Questions[currentIndex + 1].QuestionId});
        }
    };

});

anketbazApp.controller('StartPollController', function ($scope, $state, $stateParams, WsProviderService, PollService) {
    $scope.FieldList = JSON.parse(PollService.PollData.Fields);
    if ($scope.FieldList.length == 0) {
        PollService.FieldData = JSON.stringify([]);
        PollService.StartDateTime = new Date();
        $state.go('question', {questionId: PollService.PollData.Questions[0].QuestionId});
    }
    $scope.FieldList.forEach(function (e) {
        e.FieldValue = '';
    });

    $scope.StartPoll = function () {
        var pollFieldData = [];

        var fieldError = false;
        for (var i = 0; i < $scope.FieldList.length; i++) {
            if ($scope.FieldList[i].FieldValue == undefined || $scope.FieldList[i].FieldValue == '') {
                fieldError = true;
                break;
            }
        }
        if (fieldError) {
            alert('Field doldur.');
            return;
        }
        $scope.FieldList.forEach(function (e) {
            pollFieldData.push({
                FieldCode: e.FieldCode,
                FieldValue: e.FieldValue
            });
        });

        PollService.FieldData = JSON.stringify(pollFieldData);
        PollService.StartDateTime = new Date();
        $state.go('question', {questionId: PollService.PollData.Questions[0].QuestionId});
    };
});

anketbazApp.controller('MainController', function ($scope, $state, $stateParams, WsProviderService, PollService) {
    var pollId = $stateParams.pollId;
    var ownerId = $stateParams.ownerId;
    var ownerType = $stateParams.ownerType;


    WsProviderService.Send('PollService', 'GetPollData', {
        pollid: pollId,
        ownerid: ownerId,
        ownertype: ownerType
    }, function (e) {
        if (e.Result) {
            console.log(e.Data);
            if (e.Data.Active != "X") {
                alert('bu anket aktif degil');
                return;
            }
            if (e.Data.IsCookieCheck == "X") {
                var cookieStrValue = getCookie('polldata-' + pollId);
                if (cookieStrValue != "") {
                    var cookieVal = JSON.parse(cookieStrValue);
                    if (pollId == cookieVal.PollId && ownerId == cookieVal.OwnerId && ownerType == cookieVal.OwnerType) {
                        alert('Cookie dogrulamasi ');
                        return;
                    }
                }
            }
            if (e.Data.IsPassword == "X") {
                //sifreli anket
                PollService.PollData = e.Data;
                PollService.ShowResult = e.Data.isshowresult == "X";
                PollService.PollId = pollId;
                PollService.OwnerId = ownerId;
                PollService.OwnerType = ownerType;
                $state.go('pollPassword');
            } else {
                //ankete basla.
                PollService.PollData = e.Data;
                PollService.PollId = pollId;
                PollService.OwnerId = ownerId;
                PollService.OwnerType = ownerType;
                $state.go('startPoll');
                //$state.go('questionList');

            }
        } else {
            switch (e.Data) {
                case "0x0012":
                    alert("anket bulunamadi.");
                    break;
                case "0x0017":
                    alert("staff auth gerekli.");
                    break;
                case "0x0018":
                    alert("ip dogrulamasi.");
                    break;
                default:
                    alert(e.Data);
                    break;
            }

        }
    });
});