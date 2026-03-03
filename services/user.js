
export const userLogin = async (data) => {
  console.log('userLogin()')
  console.log(data)
  const response = await fetch("/api/user/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  console.log(resData);
  return resData.data;
};

export const getUserList = async () => {
  const response = await fetch(`/api/user/list`);
  const resData = await response.json();
  return resData.data;
};

export const getUser = async (tel) => {
  const response = await fetch(`/api/user/detail?tel=${tel}`);
  const resData = await response.json();
  return resData.data;
};

export const updateBank = async (data) => {
  console.log(data)
  const _data = {
    tel: data.tel,
    dealer_tel: data.dealerTel,
    amount: data.change
  }

  const response = await fetch("/api/user/updateBank", {
    method: "POST",
    body: JSON.stringify(_data),
  });
  const resData = await response.json();
  console.log(resData);
  return resData.data;
}

export const updateCapital = async (data) => {
  console.log(data)


  const response = await fetch("/api/user/updateCapital", {
    method: "POST",
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  console.log(resData);
  return resData.data;
}

