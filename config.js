/**
 * 小程序配置文件
 */

let currentVersion = '1.0.7';
let env = 'production';
let host = '';

if (env === 'development') {
  host = 'http://localhost:7060/meidaplus-api';
} else if (env === 'test') {
  host = 'https://test.api.cxrent.cn/meidaplus-api';
} else if (env === 'production') {
  host = 'https://api.cxrent.cn/meidaplus-api';
}

let config = {
  currentVersion: currentVersion,
  index: `${host}/api/home/index`,
  medical: `${host}/api/home/listShop`,
  medicalDetail: `${host}/api/home/getShopInfo`,
  serve: `${host}/api/home/listServiceCategory`,
  serveDetail: `${host}/api/home/getServiceCategoryInfo`,
  realCase: `${host}/api/home/listRealCase`,
  realCaseDetail: `${host}/api/home/getRealCaseInfo`,
  integral: `${host}/api/integral/integralList`,
  integralTotal: `${host}/api/integral/getCanWithdrawalAmount`,
  integralDetail: `${host}/api/integral/getIntegralInfo`,
  kitting: `${host}/api/integral/saveCashWithdrawal`,
  kittingRecord: `${host}/api/integral/getCashWithdrawalRecord`,
  kittingDetail: `${host}/api/integral/getCashWithdrawalInfo`,
  kittingLatelyRecord: `${host}/api/integral/latelyRecord`,
  cardPackage: `${host}/api/card/bag/list`,
  cards: `${host}/api/consumption/card/list`,
  cardInfos: `${host}/api/card/bag/getInfo`,
  cardDetail: `${host}/api/consumption/card/info`,
  cardCheck: `${host}/api/consumption/card/check`,
  cardBind: `${host}/api/consumption/card/checkBindRelation`,
  cardOrder: `${host}/api/consumption/card/submitOrder`,
  cardOrderSave: `${host}/api/consumption/card/saveOrder`,
  cardOrderInfo: `${host}/api/consumption/card/getOrderInfo`,
  orderExist: `${host}/api/consumption/card/existsUserOrder`,
  order: `${host}/api/miniapp/payment/unifiedOrder`,
  cancelOrder: `${host}/api/consumption/card/cancelOrder`,
  payment: `${host}/api/miniapp/payment/paymentCallback`,
  sendEmail: `${host}/api/card/bag/sendEmail`,
  transferConfirm: `${host}/api/card/bag/transferOtherConfirm`,
  transfer: `${host}/api/card/bag/transferOtherOk`,
  bookingInfo: `${host}/api/card/bag/bookingInfo`,
  bookingSave: `${host}/api/card/bag/saveBooking`,
  bookingCancel: `${host}/api/card/bag/cancelBooking`,
  getFixedCard: `${host}/api/card/bag/getFixedCard`,
  center: `${host}/api/personal/center/index`,
  wxCode: `${host}/api/user/getWXACodeUnlimit`,
  popularize: `${host}/api/personal/center/myPromotionRecord`,
  invitation: `${host}/api/personal/center/scanResult`,
  myTeam: `${host}/api/personal/center/myTeamList`,
  myTeamTotal: `${host}/api/personal/center/getTeamTotal`,
  updateUserNameLogo: `${host}/api/personal/center/updateUserNameLogo`,
  myApply: `${host}/api/activity/free/report/mine`,
  active: `${host}/api/activity/free/get`,
  activeApply: `${host}/api/activity/free/report`,
  activeSupport: `${host}/api/activity/free/shops`,
  activeDetail: `${host}/api/activity/free/report/detail`,
  activeCancelOrder: `${host}/api/activity/free/closeReport`,
  user: `${host}/api/user`,
  userInfo: `${host}/api/user/userInfo`,
  bindMobile: `${host}/api/user/bindMobile`,
  code2session: `${host}/api/user/codeToSessionKey`,
  updateInfo: `${host}/api/user/getUserInfoByOpenid`,
  testVersion: `${host}/api/user/version`,
  testUser: `${host}/api/user/test_user`,
  teamuser: `${host}/api/user/teamuser`
};

module.exports = config;