import moment from 'moment'
import $ from "jquery";
import Papa from  'papaparse'
import 'notifyjs-node/dist/notify'
export default {
    DateLong(datetime) {
        try {
            let newDate         =       new Date(datetime);
            let momentFormat    =       moment(String(newDate)).format('MM-DD-YYYY');
            return momentFormat;
        } catch (e) {
            window.console.log(e);
            return e;
        }
    },
    GetDateNow() {
        try {
            let dateNow         =       new Date();
            let momentTime      =       moment(String(dateNow)).format('YYYY-MM-DD');
            return momentTime;
        } catch (e) {
            window.console.log(e);
            return e;
        }
    },
    MinuteToSecond(minute) {
        try {
            return Math.floor(minute * 60);
        } catch (e) {
            window.console.log(e);
            return e;
        }
    },
    HideLoading(id) {
        $('button #'+id).css('display','none');
        $('#'+id+'.icon-select').css('display','block');
    },
    ShowLoading(id) {
        $('button #'+id).css('display','block');
        $('#'+id+'.icon-select').css('display','none');
    },
    CheckExtention(file) {
        if (file == null || undefined) {
            return alert("No file exist!");
        } else {
            const lastPoint         =    file.name.lastIndexOf('.');
            const ext               =    file.name.substring(lastPoint+1);
            if (ext == "csv") {
                return true;
            } else {
                return false;
            }
        }
           
    },
    ReadCsv(file) {
        return new Promise((resolve) => {
            Papa.parse(file, {
                complete: function(result) {
                    resolve(result);
                }
            });
        });
    },
    notifyForm(element, message, type) {
        $("." + element).notify(message, type);
    }
}