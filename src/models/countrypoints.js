import {  loadCountryPointView } from '../services/api';
import { Model } from '../dvapack';
import { Link } from 'dva/router';
 


export default Model.extend({
    namespace: 'countrypoints',
    state: {
        countryBaseInfo:[]
    },
    effects: {
        * querycountrypointdetail({
          payload,
        }, { call, update, put }) {
       
            const countryBaseInfo = yield call(loadCountryPointView, { monitortype:payload.monitortype ,DGIMN:payload.DGIMN});
            yield update({countryBaseInfo:countryBaseInfo });
        }
    }
})