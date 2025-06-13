const storeToken = (value, isRemeber) => {
  if (value) {
    if (isRemeber) {
      localStorage.setItem("access_token", value);
    } else {
      sessionStorage.setItem("access_token", value);
    }
  }
};

const getToken = () => {
  let access_token = "";
  if (localStorage.getItem("access_token") !== null) {
    access_token = localStorage.getItem("access_token");
  }

  if (sessionStorage.getItem("access_token") !== null) {
    access_token = sessionStorage.getItem("access_token");
  }
  return { access_token };
};

const removeToken = () => {
  sessionStorage.clear();
  localStorage.clear();
};

const setProfile = (value, isRemeber) => {
  if (isRemeber) {
    localStorage.setItem("profile", JSON.stringify(value));
  } else {
    sessionStorage.setItem("profile", JSON.stringify(value));
  }
};

const getProfile = () => {
  let profile = "";
  if (localStorage.getItem("profile") !== null) {
    profile = JSON.parse(localStorage.getItem("profile"));
  }

  if (sessionStorage.getItem("profile") !== null) {
    profile = JSON.parse(sessionStorage.getItem("profile"));
  }
  return { profile };
};

export { storeToken, getToken, removeToken, setProfile, getProfile };
