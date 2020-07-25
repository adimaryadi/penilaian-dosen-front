import $ from "jquery";
export default {
    authHeader() {
        // var authorizationBasic =    window.btoa(username + ':' + password);
        let session            =    localStorage.getItem("session");
        // window.console.log(token+" token auth");
        var config = {
            "headers": {
                "Authorization": "Bearer " + session,
                'Content-Type': 'application/json'
            }
        };
        return config;
    },
    HeaderUpload() {
        let session            =    localStorage.getItem("session");
        var config = {
            "headers": {
                'Authorization': 'Bearer '+ session,
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: function(progressEvent) {
                let percentage      =       parseInt( Math.round( ( progressEvent.loaded / progressEvent.total ) * 100 ));
                let Element         =       document.getElementById("myBar");
                Element.style.width =       percentage+ "%";
                if (percentage >= 100) {
                    $('.progress-upload').css('display','none');
                } else {
                    $('.progress-upload').css('display','block');
                }
                // window.console.log(percentage);
            }.bind(this)
        };
        return config
    },
    Upload() {
        var config = {
            onUploadProgress: function(progressEvent) {
                let percentage      =       parseInt( Math.round( ( progressEvent.loaded / progressEvent.total ) * 100 ));
                let Element         =       document.getElementById("myBar");
                Element.style.width =       percentage+ "%";
                if (percentage >= 100) {
                    $('.progress-upload').css('display','none');
                } else {
                    $('.progress-upload').css('display','block');
                }
                // window.console.log(percentage);
            }.bind(this)
        };
        return config
    }
}

