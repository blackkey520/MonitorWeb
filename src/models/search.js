import { Model } from '../dvapack';
import { Link } from 'dva/router';
import {  queryLxSearchInfo } from '../services/api';


export default Model.extend({
    namespace: 'search',
    state: {
        lxsearchinfo:[],
        searchName:"",
        searchresult:[]
    },
    effects: {
        * queryLxSearchResult({
          payload,
        }, { call,select, update, put }) {
            let { searchName } = yield select(_ => _.points);
            if(searchName==payload.value)
              return;
              searchName=payload.value;
            const alllxsearchinfo = yield call(queryLxSearchInfo, { searchName:payload.value ,isLx:true});
            const lxsearchinfo=[];
            if(alllxsearchinfo && alllxsearchinfo.length>0)
            {
                alllxsearchinfo.map((item,key)=>{
                    lxsearchinfo.push(item.Name);
                })
            }
            yield update({ lxsearchinfo,searchName });
        },
        *querySearchResult({
            payload
        },{call,select, update, put}){
            const searchresult = yield call(queryLxSearchInfo, { searchName:payload.value ,isLx:false});
            if(searchresult && searchresult.length>0)
            {
                yield update({ searchresult });
            }
        }
    }
})