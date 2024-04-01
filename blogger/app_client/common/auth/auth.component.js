angular
    .module('common')
    .component('login', {
        templateUrl: 'common/templates/login.template.html',
        controller: function LoginController ($http, $location, authentication) {
            var ctrl = this;
            ctrl.title = 'Sign into Blogger';
    
            ctrl.credentials = {
                email: "",
                password: ""
            };
    
            ctrl.formError = "";
            ctrl.hasFormError = false;
    
            ctrl.returnPage = $location.search().page || '/';
    
            ctrl.onSubmit = function () {
                ctrl.formError = "";
                ctrl.hasFormError = false;
                if (!ctrl.credentials.email || !ctrl.credentials.password) {
                    ctrl.formError = "All fields are required.";
                    ctrl.hasFormError = true;
                    return false;
                } else {
                    ctrl.doLogin();
                }
            };
    
            ctrl.doLogin = function () {
                authentication
                    .login(ctrl.credentials)
                    .then(() => {
                        $location.search('page', null);
                        $location.path(ctrl.returnPage);
                    })
                    .catch((err) => {
                        ctrl.formError = 'Incorrect email or password.';
                        ctrl.hasFormError = true;
                    });
            };
    
        }
    });

angular
    .module('common')
    .component('register', {
        templateUrl: 'common/templates/register.template.html',
        controller: function RegisterController ($http, $location, authentication) {
            var ctrl = this;
            ctrl.pageHeader = {
                title: 'Sign into Blogger'
            };
    
            ctrl.credentials = {
                email: "",
                password: ""
            };
    
            ctrl.formError = "";
            ctrl.hasFormError = false;
    
            ctrl.returnPage = $location.search().page || '/';
    
            ctrl.onSubmit = function () {
                ctrl.formError = "";
                ctrl.hasFormError = false;
                if (!ctrl.credentials.name 
                    || !ctrl.credentials.email 
                    || !ctrl.credentials.password) 
                {
                    ctrl.formError = "All fields are required."
                    ctrl.hasFormError = true;
                    return false;
                } else {
                    ctrl.doRegister();
                }
            };
    
            ctrl.doRegister = function () {
                authentication
                    .register(ctrl.credentials)
                    .then(() => {
                        $location.search('page', null);
                        $location.path(ctrl.returnPage);
                    })
                    .catch((err) => {
                        console.log("AUTH COMPONENT: Register error " + JSON.stringify(err));
                        ctrl.formError = "The provided email is already registered.";
                        ctrl.hasFormError = true;
                    });
            };
        }
    });