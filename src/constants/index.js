import HSBC from '~/assets/images/bank/HSBC.png'
import STB from '~/assets/images/bank/STB.png'
import VBA from '~/assets/images/bank/VBA.png'
import TCB from '~/assets/images/bank/TCB.png'
import VIETINBANK from '~/assets/images/bank/VIETINBANK.png'
import BIDV from '~/assets/images/bank/BIDV.png'
import MB from '~/assets/images/bank/MB.png'
import TPB from '~/assets/images/bank/TPB.png'
import MSB from '~/assets/images/bank/MSB.png'
import VPB from '~/assets/images/bank/VPB.png'
import VCB from '~/assets/images/bank/VCB.png'
import VIB from '~/assets/images/bank/VIB.png'
import SHB from '~/assets/images/bank/SHB.png'
import LPB from '~/assets/images/bank/LPB.png'

export const ADMIN_USER_ID = 1;

export const ADMIN_NAME_DISPLAY = 'Quản trị viên';
export const ADMIN_ROLE_ID = 1;
export const CUSTOMER_ROLE_ID = 2;
export const SELLER_ROLE_ID = 3;

export const ADMIN_ROLE = 'Admin';
export const CUSTOMER_ROLE = 'Customer';
export const SELLER_ROLE = 'Seller';
export const NOT_HAVE_MEANING_FOR_TOKEN = 'not have meaning';
export const NOT_HAVE_MEANING_FOR_TOKEN_EXPRIES = 1000;
export const BANK_ACCOUNT_IMAGE_SRC = "https://img.vietqr.io/image/MB-0336687454-compact.png?accountName=LE%20DUC%20HIEU"

export const BANKS_INFO = [
    {
        id: "458761",
        name: "TNHH MTV HSBC Việt Nam (HSBC)",
        image: HSBC
    },
    {
        id: "970403",
        name: "Sacombank (STB)",
        image: STB
    },
    {
        id: "970405",
        name: "Nông nghiệp và Phát triển nông thôn (VBA)",
        image: VBA
    },
    {
        id: "970407",
        name: "Kỹ Thương (TCB)",
        image: TCB
    },
    {
        id: "970415",
        name: "Công Thương Việt Nam (VIETINBANK)",
        image: VIETINBANK
    },
    {
        id: "970418",
        name: "Đầu tư và phát triển (BIDV)",
        image: BIDV
    },
    {
        id: "970422",
        name: "Quân đội (MB)",
        image: MB
    },
    {
        id: "970423",
        name: "Tiên Phong (TPB)",
        image: TPB
    },
    {
        id: "970426",
        name: "Hàng hải (MSB)",
        image: MSB
    },
    {
        id: "970432",
        name: "Việt Nam Thinh Vượng (VPB)",
        image: VPB
    },
    {
        id: "970436",
        name: "Ngoại thương Việt Nam (VCB)",
        image: VCB
    },
    {
        id: "970441",
        name: "Quốc tế (VIB)",
        image: VIB
    },
    {
        id: "970443",
        name: "Sài Gòn Hà Nội (SHB)",
        image: SHB
    },
    {
        id: "970449",
        name: "Bưu điện Liên Việt (LPB)",
        image: LPB
    },
]

//request's status
export const RESPONSE_CODE_SUCCESS = "00"
export const RESPONSE_CODE_NOT_ACCEPT = "01"
export const RESPONSE_CODE_DATA_NOT_FOUND = "02"
export const RESPONSE_CODE_FAILD = "03"

export const RESPONSE_CODE_BANK_WITHDRAW_PAID = "BANK_01";
export const RESPONSE_CODE_BANK_WITHDRAW_UNPAY = "BANK_02";
export const RESPONSE_CODE_BANK_WITHDRAW_REJECT = "BANK_03";
export const RESPONSE_CODE_BANK_WITHDRAW_BILL_NOT_FOUND = "BANK_04";

export const RESPONSE_CODE_USER_USERNAME_PASSWORD_NOT_ACTIVE = "USER_ACCOUNT_01";
export const RESPONSE_CODE_USER_USERNAME_ALREADY_EXISTS = "USER_ACCOUNT_02";
export const RESPONSE_CODE_USER_PASSWORD_OLD_INCORRECT = "USER_ACCOUNT_03";
//signal r

export const SIGNAL_R_CHAT_HUB_RECEIVE_MESSAGE = "ReceiveMessage";
export const SIGNAL_R_NOTIFICATION_HUB_RECEIVE_NOTIFICATION = "ReceiveNotification";
export const SIGNAL_R_NOTIFICATION_HUB_RECEIVE_ALL_NOTIFICATION = "ReceiveAllNotification";
export const SIGNAL_R_USER_ONLINE_STATUS_HUB_RECEIVE_ONLINE_STATUS = "ReceiveUserOnlineStatus";

//withdraw transaction status
export const WITHDRAW_TRANSACTION_IN_PROCESSING = 1;
export const WITHDRAW_TRANSACTION_PAID = 2;
export const WITHDRAW_TRANSACTION_REJECT = 3;
export const WITHDRAW_TRANSACTION_CANCEL = 4;

// Cart Status
export const RESPONSE_CODE_CART_SUCCESS = "CART_00";
export const RESPONSE_CODE_CART_INVALID_QUANTITY = "CART_01";
export const RESPONSE_CODE_CART_PRODUCT_INVALID_QUANTITY = "CART_02";
export const RESPONSE_CODE_CART_PRODUCT_VARIANT_NOT_IN_SHOP = "CART_03";

// status order
export const ORDER_STATUS_ALL = 0;
export const ORDER_WAIT_CONFIRMATION = 1;
export const ORDER_CONFIRMED = 2;
export const ORDER_COMPLAINT = 3;
export const ORDER_SELLER_REFUNDED = 4;
export const ORDER_DISPUTE = 5;
export const ORDER_REJECT_COMPLAINT = 6;
export const ORDER_SELLER_VIOLATES = 7;

export const RESPONSE_CODE_ORDER_NOT_ENOUGH_QUANTITY = "ORDER_01";
export const RESPONSE_CODE_ORDER_COUPON_NOT_EXISTED = "ORDER_02";
export const RESPONSE_CODE_ORDER_INSUFFICIENT_BALANCE = "ORDER_03";
export const RESPONSE_CODE_ORDER_NOT_ELIGIBLE = "ORDER_04";
export const RESPONSE_CODE_ORDER_PRODUCT_VARIANT_NOT_IN_SHOP = "ORDER_05";
export const RESPONSE_CODE_ORDER_PRODUCT_HAS_BEEN_BANED = "ORDER_06";
export const RESPONSE_CODE_ORDER_CUSTOMER_BUY_THEIR_OWN_PRODUCT = "ORDER_07";
export const RESPONSE_CODE_ORDER_COUPON_INVALID_PRODUCT_APPLY = "ORDER_08";
export const RESPONSE_CODE_ORDER_SELLER_LOCK_TRANSACTION = "ORDER_09";

//order status
export const RESPONSE_CODE_ORDER_STATUS_CHANGED_BEFORE = "ORDER_STATUS_01";

//feedback
export const RESPONSE_CODE_FEEDBACK_ORDER_UN_COMFIRM = "FEEDBACK_01";

// shop
export const RESPONSE_CODE_SHOP_BANNED = "SHOP_01";
export const RESPONSE_CODE_BALANCE_NOT_ENOUGH = "SHOP_02";

// product status
export const PRODUCT_ACTIVE = 1;
export const PRODUCT_BAN = 2;
export const PRODUCT_REMOVE = 3;
export const PRODUCT_HIDE = 4;


export const RESPONSE_CODE_PRODUCT_ACTIVE = "PRODUCT_01";
export const RESPONSE_CODE_PRODUCT_BAN = "PRODUCT_02";
export const RESPONSE_CODE_PRODUCT_REMOVE = "PRODUCT_03";
export const RESPONSE_CODE_PRODUCT_HIDE = "PRODUCT_04";

// reset password status
export const RESPONSE_CODE_RESET_PASSWORD_NOT_CONFIRM = "RS_01";
export const RESPONSE_CODE_RESET_PASSWORD_SIGNIN_GOOGLE = "RS_02";
export const RESPONSE_CODE_RESET_PASSWORD_ACCOUNT_BANNED = "RS_03";
// confirm password status
export const RESPONSE_CODE_CONFIRM_PASSWORD_IS_CONFIRMED = "CF_01";

// order message
export const RESPONSE_MESSAGE_ORDER_COUPON_NOT_EXISTED = 'Rất tiếc, Chúng tôi không thể xử lý đơn đặt hàng của bạn vì mã giảm giá này không tồn tại hoặc đã hết hạn.';
export const RESPONSE_MESSAGE_ORDER_INSUFFICIENT_BALANCE = 'Xin lỗi, Số dư không đủ để xử lý đơn hàng!';
export const RESPONSE_MESSAGE_ORDER_NOT_ENOUGH_QUANTITY = 'Xin lỗi, Số lượng sản phẩm hiện không đủ để đáp ứng đơn đặt hàng của bạn.';
export const RESPONSE_MESSAGE_ORDER_NOT_ELIGIBLE = 'Xin lỗi, Đơn hàng của bạn không đủ điều kiện để sử dụng mã giảm giá!.';
export const RESPONSE_MESSAGE_ORDER_PRODUCT_VARIANT_NOT_IN_SHOP = 'Xin lỗi, Phân loại sản phẩm mà bạn chọn không còn tồn tại trong cửa hàng.';
export const RESPONSE_MESSAGE_ORDER_PRODUCT_HAS_BEEN_BANED = 'Rất tiếc, Đơn hàng của bạn không thể được xử lý do sản phẩm không tồn tại.';
export const RESPONSE_MESSAGE_ORDER_CUSTOMER_BUY_THEIR_OWN_PRODUCT = 'Xin lỗi, Bạn không thể đặt mua sản phẩm của chính bạn.';
export const RESPONSE_MESSAGE_ORDER_COUPON_INVALID_PRODUCT_APPLY = 'Rất tiếc, đơn đặt hàng của bạn không đủ điều kiện để áp dụng mã giảm giá.';
export const RESPONSE_MESSAGE_ORDER_SELLER_LOCK_TRANSACTION = 'Giao dịch hiện không khả dụng do tạm thời bị chặn bởi người bán. Để giải quyết vấn đề này, vui lòng liên hệ trực tiếp với người bán để được hỗ trợ.';

// cart message
export const RESPONSE_MESSAGE_CART_PRODUCT_INVALID_QUANTITY = 'Không thể cập nhật vì số lượng sản phẩm không đủ';
export const RESPONSE_MESSAGE_CART_INVALID_QUANTITY = 'Không thể cập nhật vì số lượng sản phẩm không đủ';
export const RESPONSE_MESSAGE_CART_NOT_FOUND = 'Không tìm thấy sản phẩm trong giỏ hàng';

//Message Type
export const MESSAGE_TYPE_CONVERSATION_TEXT = "0";
export const MESSAGE_TYPE_CONVERSATION_IMAGE = "1";

export const USER_CONVERSATION_TYPE_UN_READ = false;
export const USER_CONVERSATION_TYPE_IS_READ = true;

//Coupon Type
export const COUPON_TYPE_ALL_PRODUCTS = 1; //admin
export const COUPON_TYPE_ALL_PRODUCTS_OF_SHOP = 2;
export const COUPON_TYPE_SPECIFIC_PRODUCTS = 3;

// Coupon Status
export const COUPON_STATUS_ALL = 0;
export const COUPON_STATUS_COMING_SOON = 1;
export const COUPON_STATUS_ONGOING = 2;
export const COUPON_STATUS_FINISHED = 3;

//Feedback search type
export const FEEDBACK_TYPE_ALL = 0;
export const FEEDBACK_TYPE_1_STAR = 1;
export const FEEDBACK_TYPE_2_STAR = 2;
export const FEEDBACK_TYPE_3_STAR = 3;
export const FEEDBACK_TYPE_4_STAR = 4;
export const FEEDBACK_TYPE_5_STAR = 5;
export const FEEDBACK_TYPE_HAVE_COMMENT = 6;
export const FEEDBACK_TYPE_HAVE_MEDIA = 7;

//customer request withdraw, deposit status
export const RESPONSE_CODE_BANK_CUSTOMER_REQUEST_WITHDRAW_INSUFFICIENT_BALANCE = "WITHDRAW_REQUEST_01";
export const RESPONSE_CODE_BANK_CUSTOMER_REQUEST_WITHDRAW_EXCEEDED_REQUESTS_CREATED = "WITHDRAW_REQUEST_02";
export const RESPONSE_CODE_BANK_CUSTOMER_REQUEST_WITHDRAW_EXCEEDED_AMOUNT_A_DAY = "WITHDRAW_REQUEST_03";
export const RESPONSE_CODE_BANK_CUSTOMER_REQUEST_WITHDRAW_CHANGED_BEFORE = "WITHDRAW_REQUEST_04";
export const RESPONSE_CODE_BANK_SELLER_REQUEST_WITHDRAW_ACCOUNT_BALLANCE_REQUIRED = "WITHDRAW_REQUEST_04";
export const RESPONSE_CODE_BANK_CUSTOMER_REQUEST_DEPOSIT_EXCEEDED_REQUESTS_CREATED = "DEPOSIT_REQUEST_01";

export const DEPOSIT_TRANSACTION_STATUS_UNPAY = 1;
export const DEPOSIT_TRANSACTION_STATUS_PAIDED = 2;
export const DEPOSIT_TRANSACTION_STATUS_EXPIRED = 3;

export const MAX_PRICE_CAN_WITHDRAW = 3000000;
export const MIN_PRICE_CAN_WITHDRAW = 50000;
//export const MIN_PRICE_CAN_WITHDRAW = 10000;
export const NUMBER_WITH_DRAW_REQUEST_CAN_MAKE_A_DAY = 20;
export const ACCOUNT_BALANCE_REQUIRED_FOR_SELLER = 500000;

export const REGEX_USERNAME_SIGN_UP = "^(?=[a-z])[a-z\\d]{6,12}$";
export const REGEX_PASSWORD_SIGN_UP = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,16}$";

export const MIN_PERCENT_PRODUCT_VARIANT_DISCOUNT = 0;
export const MAX_PERCENT_PRODUCT_VARIANT_DISCOUNT = 50;
export const MIN_PRICE_PRODUCT_VARIANT = 1000;
export const MAX_PRICE_PRODUCT_VARIANT = 100000000;

export const REGEX_COUPON_CODE = "^[a-zA-Z0-9]{4,10}$";
export const MIN_PRICE_OF_MIN_ORDER_TOTAL_VALUE = 1000;
export const MAX_PRICE_OF_MIN_ORDER_TOTAL_VALUE = 100000000;
export const MIN_PRICE_DISCOUNT_COUPON = 1000;
export const MAX_PERCENTAGE_PRICE_DISCOUNT_COUPON = 0.7;
export const MAX_PRICE_DISCOUNT_COUPON = 100000000;
export const MIN_DURATION_COUPON_TAKE_PLACE = 60 * 60 * 1000;

// Paginations
export const PAGE_SIZE = 10;
export const PAGE_SIZE_FEEDBACK = 5;
export const PAGE_SIZE_PRODUCT_SHOP_DETAIL_CUSTOMER = 30;
export const PAGE_SIZE_NOTIFICATION = 5;
export const PAGE_SIZE_PRODUCT_WISH_LIST = 30;
export const PAGE_SIZE_PRODUCT_HOME_PAGE = 48;
export const PAGE_SIZE_SEARCH_PRODUCT = 20;
export const PAGE_SIZE_SEARCH_SHOP = 10;

export const ALL_CATEGORY = 0;
export const SORTED_BY_DATETIME = 1;
export const SORTED_BY_SALE = 2;
export const SORTED_BY_PRICE_ASC = 3;
export const SORTED_BY_PRICE_DESC = 4;

export const STATISTIC_BY_MONTH = 0;
export const STATISTIC_BY_YEAR = 1;

export const UPLOAD_FILE_SIZE_LIMIT = 2 * 1024 * 1024;

export const RESPONSE_CODE_NOT_FEEDBACK_AGAIN = "FB_01";
export const LIMIT_TIME_TO_FEEDBACK = 7;

//transaction internal status
export const TRANSACTION_TYPE_INTERNAL_PAYMENT = 1
export const TRANSACTION_TYPE_INTERNAL_RECEIVE_PAYMENT = 2
export const TRANSACTION_TYPE_INTERNAL_RECEIVE_REFUND = 3
export const TRANSACTION_TYPE_INTERNAL_RECEIVE_PROFIT = 4
export const TRANSACTION_INTERNAL_TYPE_SELLER_REGISTRATION_FEE = 5

