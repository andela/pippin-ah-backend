const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExZTkyOGU5LTk1NzgtNGIyNi1iMDUyLTc2YmJlYjIyZDM0NiIsImlzTWVudG9yIjpmYWxzZSwiaXNBZG1pbiI6ZmFsc2UsImJvZHkiOlsicmVkY29sb25pYWwganVzdCBjb21tZW50ZWQgb24geW91ciBhcnRpY2xlOiBKdXN0IGNhbGwgbWUgbWFyayIsInJlZGNvbG9uaWFsIGp1c3QgY29tbWVudGVkIG9uIHlvdXIgYXJ0aWNsZTogSnVzdCBjYWxsIG1lIG1hcmsiLCJyZWRjb2xvbmlhbCBqdXN0IGNvbW1lbnRlZCBvbiB5b3VyIGFydGljbGU6IEp1c3QgY2FsbCBtZSBtYXJrIiwicmVkY29sb25pYWwganVzdCBjb21tZW50ZWQgb24geW91ciBhcnRpY2xlOiBKdXN0IGNhbGwgbWUgbWFyayIsInJlZGNvbG9uaWFsIGp1c3QgY29tbWVudGVkIG9uIHlvdXIgYXJ0aWNsZTogSnVzdCBjYWxsIG1lIG1hcmsiLCJyZWRjb2xvbmlhbCBqdXN0IGNvbW1lbnRlZCBvbiB5b3VyIGFydGljbGU6IEp1c3QgY2FsbCBtZSBtYXJrIiwicmVkY29sb25pYWwganVzdCBjb21tZW50ZWQgb24geW91ciBhcnRpY2xlOiBKdXN0IGNhbGwgbWUgbWFyayIsInJlZGNvbG9uaWFsIGp1c3QgY29tbWVudGVkIG9uIHlvdXIgYXJ0aWNsZTogSnVzdCBjYWxsIG1lIG1hcmsiLCJyZWRjb2xvbmlhbCBqdXN0IGNvbW1lbnRlZCBvbiB5b3VyIGFydGljbGU6IEp1c3QgY2FsbCBtZSBtYXJrIiwicmVkY29sb25pYWwganVzdCBjb21tZW50ZWQgb24geW91ciBhcnRpY2xlOiBKdXN0IGNhbGwgbWUgbWFyayIsInJlZGNvbG9uaWFsIGp1c3QgY29tbWVudGVkIG9uIHlvdXIgYXJ0aWNsZTogSnVzdCBjYWxsIG1lIG1hcmsiLCJyZWRjb2xvbmlhbCBqdXN0IGNvbW1lbnRlZCBvbiB5b3VyIGFydGljbGU6IEp1c3QgY2FsbCBtZSBtYXJrIiwicmVkY29sb25pYWwganVzdCBjb21tZW50ZWQgb24geW91ciBhcnRpY2xlOiBKdXN0IGNhbGwgbWUgbWFyayIsInJlZGNvbG9uaWFsIGp1c3QgY29tbWVudGVkIG9uIHlvdXIgYXJ0aWNsZTogSnVzdCBjYWxsIG1lIG1hcmsiXSwiaWF0IjoxNTQ4ODM1MDMyLCJleHAiOjE1NDkwOTQyMzJ9.ywYtbr7Lb4Xl2H97z3PoRCoJFqCPi7KE6jYiA6KK-Cw';

// eslint-disable-next-line require-jsdoc
function fetchNotification() {
  const allNotificationsUrl = 'http://localhost:3000/api/v1/user/notifications';
  // eslint-disable-next-line no-undef
  fetch(allNotificationsUrl, {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain, */*',
      Authorization: token,
      'Content-type': 'application/json'
    }
  })
    .then(response => response.json())
    .then((myJson) => {
      const notificationIcon = document.getElementById('number');
      notificationIcon.innerText = myJson.length;
    });
}
