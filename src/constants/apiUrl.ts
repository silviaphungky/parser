export const API_URL = {
  // auth
  LOGIN: 'v1/auth/login',

  // pn
  PN_LIST: 'v1/account-reporter/list',
  CREATE_PN: 'v1/account-reporter/create',
  DELETE_PN: 'v1/account-reporter/remove',
  LINK_FAMILY: 'v1/account-reporter/family/assign',
  REMOVE_FAMILY: 'v1/account-reporter/revoke',
  PN_EXIST: 'v1/account-reporter/is-exist',

  // family
  FAMILY_LIST: 'v1/account-reporter/family',
  UNLINK_FAMILY: 'v1/account-reporter/family/revoke',

  // statement
  UPLOAD_STATEMENT: 'v1/statement/upload',
}
