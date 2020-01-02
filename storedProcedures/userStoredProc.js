"use strict";

var dbParams = require('../oracle/dbParams');
//console.log('dbParams:\t'+ JSON.stringify(dbParams));
function storedProcs() {
    
    this.SP_SEEDER_SAVEDATA = {
        name: 'SP_SEEDER_SAVEDATA',
        params: {
            country: {val: null, type: dbParams.STRING, dir: dbParams.BIND_IN},
            capital: {val: null, type: dbParams.STRING, dir: dbParams.BIND_IN},
            added: {val: null, type: dbParams.STRING, dir: dbParams.BIND_OUT},
            exists: {val: null, type: dbParams.STRING, dir: dbParams.BIND_OUT}
        },

        //resultSetColumns: ['username', 'password']
    };
    this.SP_USER_GETMENUS = {
        name: 'sp_user_getmenus',
        params: {
            userId		:  {val: null, type: dbParams.NUMBER, dir : dbParams.BIND_IN},
            dataSource	:  {val: null, type: dbParams.CURSOR, dir : dbParams.BIND_OUT}
        },
        resultSetColumns: ['menuId', 'menuName', 'description', 'parentId', 'route', 'tabOrder']
    };
    this.SP_REPORTS_TRIALBALANCE = {
        name: 'SP_REPORT_GETTRIALBALANCES',
        params: {
            //startDate: {val: null, type: dbParams.STRING, dir: dbParams.BIND_IN},
            //endDate: {val: null, type: dbParams.STRING, dir: dbParams.BIND_IN},
            reportDate: {val: null, type: dbParams.STRING, dir: dbParams.BIND_IN},
            branchId: {val: null, type: dbParams.NUMBER, dir: dbParams.BIND_IN},
            dataSource: {val: null, type: dbParams.CURSOR, dir: dbParams.BIND_OUT}
        },
        resultSetColumns: ['accountNumber' ,'accountName','debit','credit']
        //resultSetColumns: ['accountNumber' ,'accountName','debit','credit','branchCode','branchName','address','tel','fax']
    };
    this.sp_meal_getmealtypes = {
        name: 'sp_meal_getmealtypes',
        params: {
        //employeeId: {val: null, type: dbParams.NUMBER, dir: dbParams.BIND_IN},
        dataSource:  {type: dbParams.CURSOR, dir: dbParams.BIND_OUT}
        }
    }
}

module.exports = storedProcs;