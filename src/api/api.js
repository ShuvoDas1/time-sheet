import axios from "axios";

const submitData = async (yearMonth, requestData) => {
  const { status } = await fetchMonthData(yearMonth);

  const payload = {
    id: yearMonth,
    days: requestData,
  };

  let response = null;
  if (status) {
    response = await updateData(payload);
  } else {
    response = saveNewData(payload);
  }

  return response;
};

// SAVE NEW DATA
const saveNewData = async (payload) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/timesheet",
      payload
    );
    return {
      status: true,
      message: "Successfully submitted",
      data: response.data,
    };
  } catch (error) {
    return {
      status: false,
      message: error?.message || "Something went wrong",
      data: null,
    };
  }
};

// UPDATE EXISTING DATA
const updateData = async (payload) => {
  try {
    const response = await axios.put(
      `http://localhost:3001/timesheet/${payload.id}`,
      payload
    );
    return {
      status: true,
      message: "Successfully submitted",
      data: response.data,
    };
  } catch (error) {
    return {
      status: false,
      message: error?.message || "Something went wrong",
      data: null,
    };
  }
};

// GET DATA BY YEAR AND MONTH
const fetchMonthData = async (id) => {
  try {
    const response = await axios.get(`http://localhost:3001/timesheet/${id}`);
    return {
      status: true,
      message: "data get Successfully",
      data: response.data,
    };
  } catch (error) {
    return {
      status: false,
      message: error?.message || "Something went wrong",
      data: null,
    };
  }
};

export { submitData };
