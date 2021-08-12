import axios from 'axios';
import BaseUrl from './BaseUrl';
import {users, userInfo} from '../stores';

const getListArea = async () => {
  try {
    const user = await users.getListUser();
    const userInfoStore = await userInfo.getListUser();
    const {partner_id} = userInfoStore;
    const url_area = `${BaseUrl.URL_v1_1}/Partner/${partner_id}/Area`;
    const res = await axios.get(url_area, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    return res.data.data;
  } catch (error) {
    console.log('Err @GetListArea ', error);
    return null;
  }
};

const getListTable = async () => {
  try {
    const {token} = await users.getListUser();
    const url_table = `${BaseUrl.URL_v1_0}/Order/Table`;
    const res = await axios.get(url_table, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.log('Err @GetListTable ', error);
    return [];
  }
};

const updateStatusTable = async (table_id, isEmpty = false) => {
  const STATUS = isEmpty ? 'used' : 'empty';

  const user = await users.getListUser();
  const url = `${BaseUrl.URL_v1_0}/Table/${table_id}/${STATUS}`;
  return axios.put(url, null, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
};

const pushNotiChangeStatus = async (table_id, tableName, area_id) => {
  try {
    const {partner_id} = await userInfo.getListUser();
    const url = `${BaseUrl.URL_v1_1}/Notification`;
    const {token} = await users.getListUser();
    const data = {
      title: 'Chuyển bàn trống ',
      content: `Bàn ${tableName} vừa thực hiện chuyển bàn trống`,
      action: 'reset_table',
      type_notification: '1',
      link: '',
      body_data: {
        table_id,
        table_name: tableName,
        action: 'reset_table',
      },
      partner_id,
      table_id,
      area_id,
      topic: `area_${area_id}`,
      list_user_push_noti: [],
      is_push_noti: '1',
    };
    const res = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log('Err @pushNotiChangeStatus ', error);
    return null;
  }
};
const pushNotiConfirmIntoTable = async (
  actionStatus,
  table_id,
  tableName,
  area_id,
  user_id,
) => {
  try {
    const url = `${BaseUrl.URL_v1_1}/Notification`;
    const {token} = await users.getListUser();
    const {partner_id} = await userInfo.getListUser();
    const data = {
      title:
        actionStatus === 2 ? 'Xác nhận vào bàn' : 'Từ chối yêu cầu vào bàn',
      content: `Yêu cầu vào bàn ${tableName} vừa ${
        actionStatus === 2 ? 'được xác nhận' : 'bị từ chối'
      }`,
      action: actionStatus ? 'confirm_into_table' : 'reject_into_table',
      type_notification: '3',
      link: '',
      body_data: {
        action: actionStatus ? 'confirm_into_table' : 'reject_into_table',
        table_id,
        area_id,
      },
      topic: '',
      list_user: [user_id],
      is_push_noti: '1',
    };
    const res = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log('Err @pushNotiChangeStatus ', error);
    return null;
  }
};

const mergerTable = async (tableId, listTableJoin, isDelete) => {
  try {
    const {token} = await users.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Table/${tableId}/TableJoin?language=vi`;
    console.log(url, listTableJoin, isDelete);
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = isDelete
      ? await axios.delete(url, {
          data: listTableJoin,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      : await axios.post(url, listTableJoin, headers);
    return res.data;
  } catch (error) {
    console.log('Err@MergeTable ', error);
  }
};
const getMergedTableInfo = async tableId => {
  try {
    const {token} = await users.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Table/${tableId}/TableJoin?language=vi`;
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(url, headers);
    return res.data.data;
  } catch (error) {
    console.log('Err@GetMergeTable ', error);
  }
};

const generateQRCode = async tableId => {
  try {
    const url = `${BaseUrl.URL_v1_0}/Table/${tableId}/GenerateQrcode`;
    const {token} = await users.getListUser();
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.put(url, null, headers);
    return res.data.data;
  } catch (error) {
    console.log('Err@GenQRCode', error);
  }
};

const pushNotiMergeTable = async (lisTable, areaId) => {
  try {
    const url = `${BaseUrl.URL_v1_1}/Notification`;
    const {token} = await users.getListUser();
    const groupName = lisTable.reduce(
      (init, item, index) =>
        (init += index === 0 ? item.name : `, ${item.name}`),
      '',
    );
    const data = {
      title: 'Ghép bàn',
      content: `Bàn ${groupName} vừa được ghép thành công.`,
      action: 'merge_table',
      type_notification: '1',
      link: '',
      body_data: {
        tables: JSON.stringify(lisTable),
        areaId,
        action: 'merge_table',
        groupName,
      },
      areaId,
      topic: `area_${areaId}`,
      list_user_push_noti: [],
      is_push_noti: '1',
    };
    const res = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log('Err @pushNotiMergeTable ', error);
    return null;
  }
};
const pushNotiUnMergeTable = async (splitGroup1, splitGroup2, areaId) => {
  try {
    const url = `${BaseUrl.URL_v1_1}/Notification`;
    const separated = splitGroup1.reduce(
      (init, item, index) =>
        (init += index === 0 ? item.name : `, ${item.name}`),
      '',
    );
    const remaining = splitGroup2.reduce(
      (init, item, index) =>
        (init += index === 0 ? item.name : `, ${item.name}`),
      '',
    );

    const {token} = await users.getListUser();
    const data = {
      title: 'Tách bàn',
      content: `Bàn ${separated} vừa được tách khỏi bàn ${remaining}`,
      action: 'unmerge_table',
      type_notification: '1',
      link: '',
      body_data: {
        separatedTables: JSON.stringify(splitGroup1),
        remainingTables: JSON.stringify(splitGroup2),
        areaId,
        action: 'unmerge_table',
      },
      areaId,
      topic: `area_${areaId}`,
      list_user_push_noti: [],
      is_push_noti: '1',
    };
    const res = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log('Err @pushNotiUnMergeTable ', error);
    return null;
  }
};

const pushNotiAddTable = async (table, addedTables, areaId) => {
  try {
    const url = `${BaseUrl.URL_v1_1}/Notification`;
    const groupName = addedTables.reduce(
      (init, item, index) =>
        (init += index === 0 ? item.name : `, ${item.name}`),
      '',
    );
    const {token} = await users.getListUser();
    const data = {
      title: 'Thêm bàn',
      content: `Bàn ${groupName} vừa được thêm vào bàn ghép ${table.name}`,
      action: 'add_table',
      type_notification: '1',
      link: '',
      body_data: {
        initialTables: JSON.stringify(table),
        addedTables: JSON.stringify(addedTables),
        areaId,
        action: 'add_table',
      },
      areaId,
      topic: `area_${areaId}`,
      list_user_push_noti: [],
      is_push_noti: '1',
    };
    const res = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log('Err @pushNotiAddTable ', error);
    return null;
  }
};

const deliveryOrder = async orderId => {
  try {
    const {token} = await users.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Order/${orderId}/DeliveryConfirm`;
    const res = await axios.put(url, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log('Err @deliveryOrder ', error);
    return null;
  }
};

export default {
  getListArea,
  getListTable,
  updateStatusTable,
  pushNotiChangeStatus,
  mergerTable,
  pushNotiConfirmIntoTable,
  getMergedTableInfo,
  generateQRCode,
  pushNotiMergeTable,
  deliveryOrder,
  pushNotiUnMergeTable,
  pushNotiAddTable,
};
