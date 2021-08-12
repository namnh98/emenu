// start
import StartScreen from './StartScreen';

// auth
import Login from './auth/LoginScreen';
import SelectUser from './auth/SelectUserScreen';

// tab
import Home from './TabBottom/HomeScreen';
import OrderTable from './TabBottom/OrderTableScreen';
import Takeaway from './TabBottom/TakeAwayScreen';
import Report from './TabBottom/ReportScreen';
import Confirm from './TabBottom/ConfirmScreen';
import OrderFoodWithoutTable from './TabBottom/OrderFoodWithoutTable';

// stack
import Notification from './stacks/NotificationScreen';
import UserDetail from './stacks/UserDetailScreen';
import BookTable from './stacks/BookTableScreen';
import BookTableDetail from './stacks/BookTableDetailScreen';
import FoodCategory from './stacks/FoodCategoryScreen';
import OrderFood from './stacks/OrderFoodScreen';
import FoodOrdered from './stacks/FoodOrderedScreen';
import OrderPayment from './stacks/OrderPaymentScreen';
import Payment from './stacks/PaymentScreen';
import PaymentDetail from './stacks/PaymentDetailScreen';
import Invoice from './stacks/InvoiceScreen';
import EditFood from './stacks/EditFoodScreen';
import ListBill from './stacks/ListBillScreen';
import ReportDetail from './stacks/ReportDetailScreen';
import TakeAwayPayment from './stacks/TakeAwayPaymentScreen';
import TakeAwayCategory from './stacks/TakeAwayCategoryScreen';
import TakeAwayFood from './stacks/TakeAwayFoodScreen';
import BookSearchTable from './stacks/BookSearchTableScreen';
import OrderDetails from './TabBottom/ConfirmScreen/navigation/OrderDetails';
import TakeAwaySearchScreen from './stacks/TakeAwaySearchScreen';
import CheckInOutScreen from './stacks/CheckInOut';

import BookTableEdit from './stacks/BookTableEditScreen/index';
import SearchFood from './stacks/SearchFoodScreen';
import PayOneByOneScreen from './stacks/PayOneByOne/index';
import ContactScreen from './stacks/ContactScreen/index';

//Quản lý
import Manage from './stacks/ManageScreen/index';
//Quản lý món 
import ManageFood from './stacks/ManageScreen/ManageFoodScreen/index'
//Thêm món 
import AddFood from './stacks/ManageScreen/ManageFoodScreen/AddFoodScreen/index'
//Sửa món 
import Editfood from './stacks/ManageScreen/ManageFoodScreen/EditFoodScreen/index'
//chi tiết món
import FoodDetail from './stacks/ManageScreen/ManageFoodScreen/FoodDetailScreen/index'
//Lịch sử thanh toán
import HistoryPayment from './stacks/HistoryPaymentScreen/index'
//Chi tiết lịch sử thanh toán
import HistoryPaymentDetail from './stacks/HistoryPaymentScreen/HistoryPaymentDetailScreen/index'
export {
  StartScreen,
  Login,
  SelectUser,
  Home,
  OrderTable,
  Takeaway,
  Report,
  Confirm,
  Notification,
  UserDetail,
  BookTable,
  BookTableDetail,
  FoodCategory,
  OrderFood,
  FoodOrdered,
  OrderPayment,
  Payment,
  PaymentDetail,
  Invoice,
  EditFood,
  ListBill,
  ReportDetail,
  TakeAwayPayment,
  TakeAwayCategory,
  TakeAwayFood,
  BookSearchTable,
  OrderDetails,
  TakeAwaySearchScreen,
  BookTableEdit,
  PayOneByOneScreen,
  SearchFood,
  OrderFoodWithoutTable,
  CheckInOutScreen,
  ContactScreen,
  Manage,
  ManageFood,
  HistoryPayment,
  HistoryPaymentDetail,
  AddFood,
  Editfood,
  FoodDetail
};
