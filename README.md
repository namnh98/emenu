## Hướng dẫn clone code về máy

**clone source về mày**
git clone https://LCoder@bitbucket.org/LCoder/rn-omenu-staff.git

**Cài thư viện cho source**
npm install

**Chạy máy ảo android hoặc ios**

- Chạy android: npx react-native run-android
Khi chạy ios, cần cd/ios && pod install trước khi chạy
- Chạy ios: npx react-native run-ios.


chỉ dùng khi đã cài yarn
**Cài thư viện cho source**
yarn install

**Chạy máy ảo android hoặc ios**

- Chạy android: yarn android.
Khi chạy ios, cần cd/ios && pod install trước khi chạy
- Chạy ios: yarn ios.

---

## Ý nghĩa của từng thư mục trong src

**Tất các các folder đều có index.js để sử dụng trong các file phải thông qua file index.js.**

1. api: quản lý tất cả api.
   - **BaseUrl.js** url của api.
2. assets: quản lý hình ảnh với màu.
   - **colors.js** constant màu dùng chung cho app.
   - folder **images** chứa tất cả các hình ảnh.
3. common: quản lý các key, value const.
4. components: quản lý các component.
5. i18n: quản lý đa ngôn ngữ.
   - folder **locales** chứa config import của file khác. (vd: HomeScreen/locale.js)
6. navigators: quản lý chuyển màn hình.
   - **RootNavigator.js** là root chính của app.
   - **ScreenName.js** chứa các name của các screen.
   - **TabNavigator.js** là bottom tab.
7. redux: quản lý state global.
   - folder **actions** chứa các action trong redux.
   - folder **reducers** là các reducer của redux.
   - folder **sagas** file để control khi call api trong redux.
   - **action-types.js** chứa các tên của action.
8. screens: quản lý các màn hình chính.
   - folder **auth** chứa liên quan đến login của user.
   - folder **TabBottom** là file main của app.
   - **StartScreen.js** file chạy đầu tiên khi app khởi động.
9. stores: quản lý dự liệu local.
   - **lastLogin.js** là danh sách đã login từ trước.
   - **userInfo.js** là thông tin chi tiết của nhân viên. (vd: name, age, phone, partnerId, email,...)
   - **users.js** là thông tin của api. (vd: token, refreshToken,...)
10. theme: quản lý chuyển màu.
11. untils: quản lý những logic.

---

## Luồng chạy của project

1. App.js **Config codepush với redux**.
2. RootNavigator.js **Config notify, chứa tất cả screen**.
3. StartScreen.js **Kiểm tra người dùng đã đăng nhập hay chưa**.
4. Login.js **Đăng nhập** thành công **Loading.js** --> **TabNavigator.js**.
5. TabNavigator.js **HomeScreen, OrderTableScreen, ReportScreen, ReservedTableScreen, TakeAwayScreen**.

---

## Các lưu ý trong project

1. Sử dụng try/catch trong function logic.
2. Log lỗi sử dụng theo cú pháp (vd: console.log('Err @nameFunction ', error)).
3. Thiết kế giao diện sử dụng thư viện styled.

---

## Tài liệu tham khảo thư viện

Thư viện chuyển các màn hình sẽ sử dụng [navigation](https://reactnavigation.org).

Thư viện style cho các component [styled](https://styled-components.com).

Thư viện [firebase](https://rnfirebase.io).

Thư viện sử dụng svg để custom [loader](https://github.com/danilowoz/react-content-loader).

Thư viện animation cho [modal](https://github.com/danilowoz/react-content-loader).

Thư viện animation modal từ dưới lên trên [bottom sheet](https://www.npmjs.com/package/react-native-raw-bottom-sheet).

Thư viện custom loading bằng view [placeholder](https://www.npmjs.com/package/react-native-skeleton-placeholder).

Thư viện hỗ trợ các [icon](https://github.com/oblador/react-native-vector-icons) và đây là [trang để tìm icon](https://oblador.github.io/react-native-vector-icons).

Thư viện quản lý state global [redux](https://redux-saga.js.org).
