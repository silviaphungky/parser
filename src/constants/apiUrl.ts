export const API_URL = {
  // auth
  LOGIN: 'v1/auth/login',
  CHECK_ACCOUNT: 'v1/auth/is-need-add-password',
  REGIS_PASSWORD: 'v1/auth/register-password',

  // pn
  PN: 'v1/account-reporter',
  PN_LIST: 'v1/account-reporter/list',
  CREATE_PN: 'v1/account-reporter/create',
  DELETE_PN: 'v1/account-reporter/remove',
  LINK_FAMILY: 'v1/account-reporter/family/assign',
  REMOVE_FAMILY: 'v1/account-reporter/revoke',
  PN_EXIST: 'v1/account-reporter/is-exist',

  // family
  FAMILY_LIST: 'v1/account-reporter/family',
  UNLINK_FAMILY: 'v1/account-reporter/family/revoke',
  UNASSIGNED_LIST: 'v1/account-reporter/family/unassigned/list',

  // statements
  UPLOAD_STATEMENT: 'v1/statement/upload',
  STATEMENT_LIST: 'v1/statement',
  VALIDATE_STATEMENT_DUPLICATE: 'v1/statement/file/check-hash',
  TOP_TRANSACTION: 'v1/statement',
  DELETE_STATEMENT: 'v1/statement/remove',
  RESTORE_STATEMENT: 'v1/statement/restore',
  DOWNLOAD_STATEMENT: 'v1/statement/file/download-temp-statement',

  // transactions
  TRANSACTION_LIST: 'v1/transaction/list',
  GENERATE_TRANSACTION_CSV: 'v1/transaction/generate/csv',
  UPDATE_TRANSACTION: 'v1/transaction',

  // notification
  NOTIF_LIST: 'v1/notification/list',
  NOTIF_READ: 'v1/notification/read',

  OVERVIEW: 'v1/statement/summary/overview',

  USER_LIST: 'v1/app-user/list',
  CREATE_USER: 'v1/app-user/create',
  REMOVE_USER: 'v1/app-user/remove',
}
