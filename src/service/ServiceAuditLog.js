import header from '../helper/auth-header'
import { AXIOS } from '../helper/http-commons';
export default {
    getAuditLog( offset, size , term , clazz ,StartDate, EndDate ) {
        let  config         =       {}
        config              =      header.authHeader();
        config.params       =      {
                offset:       offset,
                size:         size,
                term:         term,
                clazz:        clazz,
                startDate:    StartDate,
                endDate:      EndDate
        }
        return AXIOS.get('/audit/', config);
    }
}